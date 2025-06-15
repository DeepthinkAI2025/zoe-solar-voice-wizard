
import { useState } from 'react';
import { useSettings } from './useSettings';
import { useAgentManagement } from './useAgentManagement';
import { useCallManagement } from './useCallManagement';
import { useContactManagement } from './useContactManagement';

export const usePhoneState = () => {
  const [activeTab, setActiveTab] = useState('dialpad');
  const [contactToEditId, setContactToEditId] = useState<string | null>(null);
  
  const settings = useSettings();
  const agentManagement = useAgentManagement();
  const contactManagement = useContactManagement();
  const callManagement = useCallManagement({
    silentModeEnabled: settings.silentModeEnabled,
    workingHoursStart: settings.workingHoursStart,
    workingHoursEnd: settings.workingHoursEnd,
    autoAnswerEnabled: settings.autoAnswerEnabled,
    agents: agentManagement.agents,
    globalSystemInstructions: agentManagement.globalSystemInstructions,
  });

  const openContactEditor = (contactId: string) => {
    setContactToEditId(contactId);
    setActiveTab('contacts');
  };

  const clearContactToEdit = () => {
    setContactToEditId(null);
  };

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
  };
};
