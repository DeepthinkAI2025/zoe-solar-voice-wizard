
import { useState } from 'react';
import { useSettings } from './useSettings';
import { useAgentManagement } from './useAgentManagement';
import { useCallManagement } from './useCallManagement';
import { useContactManagement } from './useContactManagement';

export const usePhoneState = () => {
  const [activeTab, setActiveTab] = useState('dialpad');
  
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

  return {
    activeTab,
    setActiveTab,
    ...settings,
    ...agentManagement,
    ...contactManagement,
    ...callManagement,
  };
};
