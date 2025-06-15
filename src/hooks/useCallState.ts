
import { useState } from 'react';

export type ActiveCall = {
  number: string;
  contactName?: string;
  agentId?: string;
  status: 'incoming' | 'active';
  isMinimized: boolean;
  startMuted?: boolean;
};

export const useCallState = () => {
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [isForwarding, setIsForwarding] = useState(false);

  return {
    activeCall,
    setActiveCall,
    isForwarding,
    setIsForwarding,
  };
};
