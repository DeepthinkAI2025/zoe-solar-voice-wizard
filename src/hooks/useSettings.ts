
import { useState } from 'react';

export const useSettings = () => {
  const [autoAnswerEnabled, setAutoAnswerEnabled] = useState(true);
  const [workingHoursStart, setWorkingHoursStart] = useState(7);
  const [workingHoursEnd, setWorkingHoursEnd] = useState(17);
  const [silentModeEnabled, setSilentModeEnabled] = useState(true);

  const handleAutoAnswerToggle = (enabled: boolean) => setAutoAnswerEnabled(enabled);
  const handleWorkingHoursStartChange = (hour: number) => setWorkingHoursStart(hour);
  const handleWorkingHoursEndChange = (hour: number) => setWorkingHoursEnd(hour);
  const handleSilentModeToggle = (enabled: boolean) => setSilentModeEnabled(enabled);

  return {
    autoAnswerEnabled,
    workingHoursStart,
    workingHoursEnd,
    silentModeEnabled,
    handleAutoAnswerToggle,
    handleWorkingHoursStartChange,
    handleWorkingHoursEndChange,
    handleSilentModeToggle,
  };
};
