
import { useState } from 'react';
import { useSettings } from './useSettings';
import { useAgentManagement } from './useAgentManagement';
import { useCallManagement } from './useCallManagement';

export const usePhoneState = () => {
  const [activeTab, setActiveTab] = useState('dialpad');
  
  const settings = useSettings();
  const agentManagement = useAgentManagement();
  const callManagement = useCallManagement({
    silentModeEnabled: settings.silentModeEnabled,
    workingHoursStart: settings.workingHoursStart,
    workingHoursEnd: settings.workingHoursEnd,
    autoAnswerEnabled: settings.autoAnswerEnabled,
  });

  return {
    activeTab,
    setActiveTab,
    ...settings,
    ...agentManagement,
    ...callManagement,
  };
};
