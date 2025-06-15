import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import type { CallHistoryItem, CallState } from '@/types/call';
import type { AgentWithSettings } from '@/hooks/useAgentManagement';

interface CallManagementProps {
  silentModeEnabled: boolean;
  workingHoursStart: number;
  workingHoursEnd: number;
  autoAnswerEnabled: boolean;
  agents: AgentWithSettings[];
  globalSystemInstructions: string;
}

export const useCallManagement = ({ silentModeEnabled, workingHoursStart, workingHoursEnd, autoAnswerEnabled, agents, globalSystemInstructions }: CallManagementProps) => {
  const [callState, setCallState] = useState<CallState>(null);
  const [showAgentSelector, setShowAgentSelector] = useState<string | null>(null);
  const [selectedCall, setSelectedCall] = useState<CallHistoryItem | null>(null);
  const { toast } = useToast();
  const [outboundCallActive, setOutboundCallActive] = useState(false);
  const [isUiForwarding, setIsUiForwarding] = useState(false);

  // Simulate an incoming call for demonstration & set muted state based on time
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!callState) {
        const hour = new Date().getHours();
        const isOffHours = hour >= workingHoursEnd || hour < workingHoursStart;
        
        setCallState({ 
            number: '0176 1234 5678',
            status: 'incoming', 
            startMuted: silentModeEnabled && isOffHours
        });
      }
    }, 8000); // Incoming call after 8 seconds
    return () => clearTimeout(timeout);
  }, [callState, silentModeEnabled, workingHoursStart, workingHoursEnd]);

  // Handle auto-answer during working hours
  useEffect(() => {
    if (outboundCallActive || callState?.status !== 'incoming' || !autoAnswerEnabled) {
      return;
    }

    const autoAnswerTimeout = setTimeout(() => {
      setCallState(currentCallState => {
        // Check again in case the user answered/rejected in the meantime
        if (currentCallState?.status === 'incoming') {
          toast({
            title: "Anruf automatisch angenommen",
            description: `KI-Agent für allgemeine Anfragen übernimmt.`
          });

          const agentId = 'general';
          const agent = agents.find(a => a.id === agentId);
          const fullInstructions = agent 
            ? `${globalSystemInstructions}\n\n${agent.systemInstructions}`
            : globalSystemInstructions;

          console.log("--- AUTO-ANSWER ---");
          console.log("Anruf wird automatisch mit Agent 'general' beantwortet.");
          console.log("VOLLSTÄNDIGE ANWEISUNGEN:", fullInstructions);
          console.log("-------------------");
          
          return {
            ...currentCallState,
            status: 'active',
            agentId: 'general',
            notes: 'Anruf automatisch nach 6 Sekunden angenommen.'
          };
        }
        // If call was already handled, do not change state
        return currentCallState;
      });
    }, 6000); // 6 seconds

    return () => {
      clearTimeout(autoAnswerTimeout);
    };
  }, [callState, toast, autoAnswerEnabled, outboundCallActive, agents, globalSystemInstructions]);


  const handleStartCall = (number: string) => {
    setShowAgentSelector(number);
  };

  const handleStartCallManually = (number: string) => {
    setOutboundCallActive(true);
    setCallState({ number, status: 'active' });
  };

  const handleAgentSelect = (agentId: string, notes: string) => {
    if(!showAgentSelector) return;

    const agent = agents.find(a => a.id === agentId);
    if (!agent) {
        console.error("Agent not found:", agentId);
        toast({ title: "Fehler", description: "Ausgewählter Agent nicht gefunden.", variant: "destructive" });
        return;
    }

    const fullInstructions = `${globalSystemInstructions}\n\n${agent.systemInstructions}`;
    console.log(`--- STARTING CALL WITH AGENT: ${agent.name} ---`);
    console.log("FULL INSTRUCTIONS:", fullInstructions);
    console.log("USER NOTES:", notes || "(none)");
    console.log("---------------------------------------");

    const isForward = callState?.status === 'active' && callState?.number === showAgentSelector;

    if (isForward) {
        // Forwarding logic
        toast({ title: "Anruf wird weitergeleitet...", description: `Zu ${agent.name} mit neuen Anweisungen.` });
        setIsUiForwarding(true);
        setShowAgentSelector(null);

        setTimeout(() => {
            setCallState(cs => cs ? { 
                ...cs, 
                agentId, 
                notes: (cs.notes ? cs.notes + "\n" : "") + "Weitergeleitet mit Notiz: " + notes 
            } : null);
            setIsUiForwarding(false);
        }, 2000);
    } else {
        // New call logic
        setOutboundCallActive(true);
        toast({
          title: "KI-Anruf wird gestartet...",
          description: `Agent ${agent.name} wird mit Ihren Anweisungen vorbereitet.`
        });
        setCallState({ number: showAgentSelector, status: 'active', agentId, notes });
        setShowAgentSelector(null);
    }
  };
  
  const handleAcceptCallWithAI = () => {
    if (callState?.status === 'incoming') {
      setShowAgentSelector(callState.number);
    }
  }

  const handleAcceptCallManually = () => {
    if (callState?.status === 'incoming') {
      setCallState({ number: callState.number, status: 'active' });
    }
  };

  const handleEndCall = () => {
    setOutboundCallActive(false);
    setCallState(null);
    setSelectedCall(null);
  };
  
  const handleForward = () => {
      if (callState) {
          setShowAgentSelector(callState.number);
      }
  }

  const handleScheduleCall = (agentId: string, notes: string, date: Date) => {
    if (showAgentSelector) {
      toast({
        title: "Anruf geplant",
        description: `KI-Anruf an ${showAgentSelector} für ${date.toLocaleString('de-DE')} wurde geplant.`,
      });
      // In a real app this would be sent to a backend service.
      console.log('Scheduling call...', { number: showAgentSelector, agentId, notes, date: date.toISOString() });
      setShowAgentSelector(null);
    }
  };

  return {
    callState,
    showAgentSelector,
    setShowAgentSelector,
    selectedCall,
    setSelectedCall,
    isUiForwarding,
    handleStartCall,
    handleStartCallManually,
    handleAgentSelect,
    handleAcceptCallWithAI,
    handleAcceptCallManually,
    handleEndCall,
    handleScheduleCall,
    handleForward,
  };
};
