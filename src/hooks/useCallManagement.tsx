
import { useState, useEffect, useCallback, useRef } from 'react';
import { aiAgents, contacts as mockContacts } from '@/data/mock';

type Agent = (typeof aiAgents)[0];
type Contact = (typeof mockContacts)[0];

interface CallManagementProps {
  silentModeEnabled: boolean;
  workingHoursStart: string;
  workingHoursEnd: string;
  autoAnswerEnabled: boolean;
  agents: Agent[];
  globalSystemInstructions: string;
  contacts: Contact[];
}

export const useCallManagement = ({
  autoAnswerEnabled,
  contacts,
  agents,
}: CallManagementProps) => {
  const [activeCall, setActiveCall] = useState<{ number: string; contactName?: string; agentId?: string; status: 'incoming' | 'active'; isMinimized: boolean } | null>(null);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isForwarding, setIsForwarding] = useState(false);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDuration(0);
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const endCall = useCallback(() => {
    setActiveCall(null);
    stopTimer();
    setIsForwarding(false);
  }, []);

  const acceptCall = useCallback((agentId: string) => {
    if (!activeCall) return;
    setActiveCall(prev => prev ? { ...prev, status: 'active', agentId } : null);
    startTimer();
  }, [activeCall]);

  const acceptCallManually = useCallback(() => {
    if (!activeCall) return;
    setActiveCall(prev => prev ? { ...prev, status: 'active', agentId: undefined } : null);
    startTimer();
  }, [activeCall]);

  const startIncomingCall = useCallback((number: string) => {
    const contact = contacts.find(c => c.phone === number);
    const incomingCall = {
      number,
      contactName: contact?.name,
      status: 'incoming' as const,
      isMinimized: false
    };
    setActiveCall(incomingCall);

    if (autoAnswerEnabled) {
      const defaultAgent = agents.find(a => a.isDefault) || agents[0];
      if (!defaultAgent) return;
      
      setTimeout(() => {
        setActiveCall(currentCall => {
          if (currentCall && currentCall.number === number && currentCall.status === 'incoming') {
            acceptCall(defaultAgent.id);
            return { ...currentCall, status: 'active', agentId: defaultAgent.id };
          }
          return currentCall;
        });
      }, 2000);
    }
  }, [contacts, autoAnswerEnabled, agents, acceptCall]);

  const minimizeCall = useCallback(() => {
    if (activeCall) {
      setActiveCall(prev => prev ? { ...prev, isMinimized: true } : null);
    }
  }, [activeCall]);

  const maximizeCall = useCallback(() => {
    if (activeCall) {
      setActiveCall(prev => prev ? { ...prev, isMinimized: false } : null);
    }
  }, [activeCall]);

  const forwardCall = useCallback(() => {
    if (!activeCall || activeCall.status !== 'active') return;
    setIsForwarding(true);
    // Simulate forwarding delay
    setTimeout(() => {
        console.log("Call forwarded!");
        endCall(); // End call after forwarding
    }, 2500);
  }, [activeCall, endCall]);

  const interveneInCall = useCallback(() => {
    console.log("Human is intervening in the call...");
    if(activeCall) {
        setActiveCall(prev => prev ? { ...prev, agentId: undefined } : null);
    }
  }, [activeCall]);

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
    forwardCall,
    interveneInCall,
  };
};
