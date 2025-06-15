import { useEffect, useCallback, useMemo } from 'react';
import type { AgentWithSettings } from './useAgentManagement';
import type { Contact } from './useContactManagement';
import { useCallState, type TranscriptLine } from './useCallState';
import { useCallTimer } from './useCallTimer';
import { useToast } from "@/components/ui/use-toast";

const greetings = [
  "Hallo, ZOE Solar, mein Name ist Alex, der KI-Assistent. Wie kann ich Ihnen helfen?",
  "Guten Tag, hier ZOE Solar. Sie sprechen mit Alex, dem KI-Assistenten. Was kann ich für Sie tun?",
  "Willkommen bei ZOE Solar. Mein Name ist Alex, Ihr persönlicher KI-Assistent. Womit kann ich Ihnen dienen?",
];

const mockConversation: { speaker: 'agent' | 'caller'; text: string; }[] = [
  { speaker: 'caller', text: "Guten Tag, hier ist Müller. Ich habe eine Frage zu meiner letzten Rechnung." },
  { speaker: 'agent', text: "Selbstverständlich, Herr Müller. Um Ihnen zu helfen, benötige ich bitte Ihre Kunden- oder Rechnungsnummer." },
  { speaker: 'caller', text: "Moment, die habe ich hier... das ist die 12345." },
  { speaker: 'agent', text: "Vielen Dank. Ich prüfe das für Sie..." },
  { speaker: 'agent', text: "Es scheint ein Problem mit der Abrechnung der sonderleistung zu geben. Ich verbinde Sie mit einem Menschen." },
];

interface CallManagementProps {
  autoAnswerEnabled: boolean;
  agents: AgentWithSettings[];
  contacts: Contact[];
  silentModeEnabled: boolean;
  workingHoursStart: number;
  workingHoursEnd: number;
  handleInBackground: boolean;
}

export const useCallManagement = ({
  autoAnswerEnabled,
  contacts,
  agents,
  silentModeEnabled,
  workingHoursStart,
  workingHoursEnd,
  handleInBackground,
}: CallManagementProps) => {
  const { activeCall, setActiveCall, isForwarding, setIsForwarding } = useCallState();
  const { duration, startTimer, stopTimer } = useCallTimer();
  const { toast } = useToast();

  const fullTranscript: TranscriptLine[] = useMemo(() => {
      if (!activeCall?.agentId) return [];
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      return [{ speaker: 'agent', text: randomGreeting }, ...mockConversation];
  }, [activeCall?.agentId]);

  useEffect(() => {
      if (activeCall?.status === 'active' && activeCall.agentId && fullTranscript.length > 0) {
          let transcriptIndex = 0;
          
          const initialTranscript = [fullTranscript[0]];
          setActiveCall(prev => prev ? { ...prev, transcript: initialTranscript } : null);
          transcriptIndex = 1;

          const transcriptTimer = setInterval(() => {
              if (transcriptIndex < fullTranscript.length) {
                  setActiveCall(prev => {
                      if (!prev || !prev.transcript) return prev;
                      const newTranscriptLine = fullTranscript[transcriptIndex];
                      return { ...prev, transcript: [newTranscriptLine, ...prev.transcript] };
                  });
                  transcriptIndex++;
              } else {
                  clearInterval(transcriptTimer);
              }
          }, 3500);

          return () => {
              clearInterval(transcriptTimer);
          };
      } else if (activeCall?.status === 'active' && !activeCall.agentId) {
           setActiveCall(prev => prev ? { ...prev, transcript: [] } : null);
      }
  }, [activeCall?.status, activeCall?.agentId, fullTranscript, setActiveCall]);


  const endCall = useCallback(() => {
    setActiveCall(null);
    stopTimer();
    setIsForwarding(false);
  }, [setActiveCall, stopTimer, setIsForwarding]);

  const acceptCall = useCallback((agentId: string) => {
    setActiveCall(prev => {
        if (!prev) return prev;
        return { ...prev, status: 'active' as const, agentId };
    });
    startTimer();
  }, [setActiveCall, startTimer]);

  const acceptCallManually = useCallback(() => {
    setActiveCall(prev => {
        if (!prev) return prev;
        return { ...prev, status: 'active' as const, agentId: undefined };
    });
    startTimer();
  }, [setActiveCall, startTimer]);

  const startIncomingCall = useCallback((number: string) => {
    const currentHour = new Date().getHours();
    const isOutsideWorkingHours = currentHour < workingHoursStart || currentHour >= workingHoursEnd;
    const contact = contacts.find(c => c.number === number);
    const displayName = contact?.name || number;

    if (handleInBackground && autoAnswerEnabled && !isOutsideWorkingHours) {
        const defaultAgent = agents.find(a => a.isDefault) || agents[0];
        if (!defaultAgent) return;

        toast({
            title: "KI-Agent ist am Telefon",
            description: `Anruf von ${displayName} wird im Hintergrund bearbeitet.`,
        });

        const backgroundCall = {
            number,
            contactName: contact?.name,
            status: 'active' as const,
            agentId: defaultAgent.id,
            isMinimized: true,
            startMuted: false,
        };
        
        setActiveCall(backgroundCall);
        startTimer();
        return;
    }
    
    const shouldBeMuted = silentModeEnabled && isOutsideWorkingHours;

    if (shouldBeMuted) {
      console.log("Silent mode on: Call will be muted as it's outside of working hours.");
    }

    const incomingCall = {
      number,
      contactName: contact?.name,
      status: 'incoming' as const,
      isMinimized: false,
      startMuted: shouldBeMuted,
    };
    setActiveCall(incomingCall);

    if (autoAnswerEnabled && !isOutsideWorkingHours) {
      const defaultAgent = agents.find(a => a.isDefault) || agents[0];
      if (!defaultAgent) return;
      
      const randomDelay = 3000 + Math.random() * 5000; // 3 to 8 seconds

      setTimeout(() => {
        setActiveCall(currentCall => {
          if (currentCall && currentCall.number === number && currentCall.status === 'incoming') {
            startTimer();
            return { ...currentCall, status: 'active', agentId: defaultAgent.id };
          }
          return currentCall;
        });
      }, randomDelay);
    }
  }, [contacts, autoAnswerEnabled, agents, setActiveCall, startTimer, silentModeEnabled, workingHoursStart, workingHoursEnd, handleInBackground, toast]);

  const startAiCall = useCallback((number: string, agentId: string) => {
    const contact = contacts.find(c => c.number === number);
    const newCall = {
      number,
      contactName: contact?.name,
      status: 'active' as const,
      agentId,
      isMinimized: false
    };
    setActiveCall(newCall);
    startTimer();
  }, [contacts, setActiveCall, startTimer]);

  const startManualCall = useCallback((number: string) => {
    const contact = contacts.find(c => c.number === number);
    const newCall = {
      number,
      contactName: contact?.name,
      status: 'active' as const,
      agentId: undefined,
      isMinimized: false
    };
    setActiveCall(newCall);
    startTimer();
  }, [contacts, setActiveCall, startTimer]);

  const minimizeCall = useCallback(() => {
    setActiveCall(prev => prev ? { ...prev, isMinimized: true } : null);
  }, [setActiveCall]);

  const maximizeCall = useCallback(() => {
    setActiveCall(prev => prev ? { ...prev, isMinimized: false } : null);
  }, [setActiveCall]);

  const forwardCall = useCallback(() => {
    if (!activeCall || activeCall.status !== 'active') return;
    setIsForwarding(true);
    // Simulate forwarding delay
    setTimeout(() => {
        console.log("Call forwarded!");
        endCall(); // End call after forwarding
    }, 2500);
  }, [activeCall, setIsForwarding, endCall]);

  const interveneInCall = useCallback(() => {
    console.log("Human is intervening in the call...");
    setActiveCall(prev => prev ? { ...prev, agentId: undefined } : null);
  }, [setActiveCall]);
  
  const handleSendNote = useCallback((newNote: string) => {
      if (!newNote.trim() || !activeCall) return;
      const noteLine: TranscriptLine = { speaker: 'system', text: `[Notiz an KI]: ${newNote}` };
      setActiveCall(prev => {
          if (!prev) return null;
          const updatedTranscript = prev.transcript ? [noteLine, ...prev.transcript] : [noteLine];
          return { ...prev, transcript: updatedTranscript };
      });
  }, [activeCall, setActiveCall]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!activeCall) {
        startIncomingCall('0176 12345678');
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [activeCall, startIncomingCall]);


  return {
    activeCall,
    duration,
    isForwarding,
    endCall,
    acceptCall,
    acceptCallManually,
    minimizeCall,
    maximizeCall,
    startIncomingCall,
    startAiCall,
    startManualCall,
    forwardCall,
    interveneInCall,
    handleSendNote,
  };
};
