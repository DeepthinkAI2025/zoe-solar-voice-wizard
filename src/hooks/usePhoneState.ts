import { useState, useCallback } from 'react';
import { useSettings } from './useSettings';
import { useAgentManagement } from './useAgentManagement';
import { useCallManagement } from './useCallManagement';
import { useContactManagement } from './useContactManagement';
import type { CallHistoryItem } from '@/types/call';

export const usePhoneState = () => {
  const [activeTab, setActiveTab] = useState('dialpad');
  const [contactToEditId, setContactToEditId] = useState<string | null>(null);
  const [agentSelectorState, setAgentSelectorState] = useState<{ number: string; context?: string } | null>(null);
  const [selectedCall, setSelectedCall] = useState<CallHistoryItem | null>(null);
  const [agentToFocusInSettings, setAgentToFocusInSettings] = useState<string | null>(null);
  
  const settings = useSettings();
  const agentManagement = useAgentManagement();
  const contactManagement = useContactManagement();
  const callManagement = useCallManagement({
    silentModeEnabled: settings.silentModeEnabled,
    workingHoursStart: settings.workingHoursStart,
    workingHoursEnd: settings.workingHoursEnd,
    autoAnswerEnabled: settings.autoAnswerEnabled,
    agents: agentManagement.agents,
    contacts: contactManagement.contacts,
  });

  const openContactEditor = (contactId: string) => {
    setContactToEditId(contactId);
    setActiveTab('contacts');
  };

  const clearContactToEdit = () => {
    setContactToEditId(null);
  };

  const isCallMinimized = callManagement.activeCall?.isMinimized ?? false;

  const setIsCallMinimized = useCallback((minimized: boolean) => {
    if (minimized) {
      callManagement.minimizeCall();
    } else {
      callManagement.maximizeCall();
    }
  }, [callManagement]);

  const handleStartCall = useCallback((number: string, context?: string) => {
    setAgentSelectorState({ number, context });
  }, []);

  const closeAgentSelector = useCallback(() => {
    setAgentSelectorState(null);
  }, []);

  const handleAgentSelect = useCallback((agentId: string) => {
    if (agentSelectorState) {
        callManagement.startAiCall(agentSelectorState.number, agentId);
        setAgentSelectorState(null);
    }
  }, [agentSelectorState, callManagement]);

  const handleUpdateAgentName = (agentId: string, newName: string) => {
    if (newName === '___EDIT_AGENT_IN_SETTINGS___') {
        setAgentToFocusInSettings(agentId);
        setActiveTab('settings');
        closeAgentSelector();
    } else {
        agentManagement.handleUpdateAgentName(agentId, newName);
    }
  };

  const handleStartCallManually = useCallback((number: string) => {
      callManagement.startManualCall(number);
  }, [callManagement]);
  
  const handleAcceptCallWithAI = useCallback(() => {
    const defaultAgent = agentManagement.agents.find(a => a.isDefault) || agentManagement.agents[0];
    if (defaultAgent) {
        callManagement.acceptCall(defaultAgent.id);
    }
  }, [agentManagement.agents, callManagement]);

  const handleScheduleCall = useCallback(() => {
    // Placeholder
    console.log("Scheduling call...");
  }, []);

  return {
    activeTab,
    setActiveTab,
    contactToEditId,
    openContactEditor,
    clearContactToEdit,
    ...settings,
    ...agentManagement,
    ...contactManagement,
    ...callManagement,
    agentSelectorState,
    closeAgentSelector,
    selectedCall,
    setSelectedCall,
    isCallMinimized,
    setIsCallMinimized,
    handleStartCall,
    handleAgentSelect,
    handleStartCallManually,
    handleAcceptCallWithAI,
    handleScheduleCall,
    handleUpdateAgentName, // Override
    agentToFocusInSettings,
    setAgentToFocusInSettings,
  };
};
