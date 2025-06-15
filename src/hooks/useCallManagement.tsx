
import { useEffect, useCallback } from 'react';
import type { AgentWithSettings } from './useAgentManagement';
import type { Contact } from './useContactManagement';
import { useCallState } from './useCallState';
import { useCallTimer } from './useCallTimer';

interface CallManagementProps {
  autoAnswerEnabled: boolean;
  agents: AgentWithSettings[];
  contacts: Contact[];
  silentModeEnabled: boolean;
  workingHoursStart: number;
  workingHoursEnd: number;
}

export const useCallManagement = ({
  autoAnswerEnabled,
  contacts,
  agents,
  silentModeEnabled,
  workingHoursStart,
  workingHoursEnd,
}: CallManagementProps) => {
  const { activeCall, setActiveCall, isForwarding, setIsForwarding } = useCallState();
  const { duration, startTimer, stopTimer } = useCallTimer();

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
    if (silentModeEnabled) {
      const currentHour = new Date().getHours();
      if (currentHour < workingHoursStart || currentHour >= workingHoursEnd) {
        console.log("Silent mode on: Call ignored outside of working hours.");
        return;
      }
    }

    const contact = contacts.find(c => c.number === number);
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
            startTimer();
            return { ...currentCall, status: 'active', agentId: defaultAgent.id };
          }
          return currentCall;
        });
      }, 2000);
    }
  }, [contacts, autoAnswerEnabled, agents, setActiveCall, startTimer, silentModeEnabled, workingHoursStart, workingHoursEnd]);

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
  };
};
