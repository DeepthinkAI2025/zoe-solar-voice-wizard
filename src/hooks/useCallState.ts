import { useState, useEffect, useCallback } from 'react';

export type TranscriptLine = { speaker: 'agent' | 'caller' | 'system'; text: string; };

export type ActiveCall = {
  number: string;
  contactName?: string;
  agentId?: string;
  status: 'incoming' | 'active';
  isMinimized: boolean;
  startMuted?: boolean;
  transcript?: TranscriptLine[];
};

type CallStateStore = {
    activeCall: ActiveCall | null;
    isForwarding: boolean;
}

let storeState: CallStateStore = {
    activeCall: null,
    isForwarding: false,
};

const listeners = new Set<() => void>();

const store = {
    getState: () => storeState,
    setState: (updater: (prevState: CallStateStore) => CallStateStore) => {
        storeState = updater(storeState);
        listeners.forEach(l => l());
    },
    subscribe: (listener: () => void) => {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
    }
}

export const useCallState = () => {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState());
    });
    return unsubscribe;
  }, []);

  const setActiveCall = useCallback((updater: React.SetStateAction<ActiveCall | null>) => {
    store.setState(prev => ({
        ...prev,
        activeCall: typeof updater === 'function' ? (updater as (prevState: ActiveCall | null) => ActiveCall | null)(prev.activeCall) : updater,
    }));
  }, []);

  const setIsForwarding = useCallback((updater: React.SetStateAction<boolean>) => {
    store.setState(prev => ({
        ...prev,
        isForwarding: typeof updater === 'function' ? (updater as (prevState: boolean) => boolean)(prev.isForwarding) : updater,
    }));
  }, []);

  return {
    activeCall: state.activeCall,
    isForwarding: state.isForwarding,
    setActiveCall,
    setIsForwarding,
  };
};
