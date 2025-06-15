
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { aiAgents as initialAgents, callHistory } from '@/data/mock';

export type CallHistoryItem = (typeof callHistory)[0];

export type CallState = null | {
  number: string;
  status: 'incoming' | 'active';
  agentId?: string;
  notes?: string;
  startMuted?: boolean;
};

export const usePhoneState = () => {
  const [activeTab, setActiveTab] = useState('dialpad');
  const [callState, setCallState] = useState<CallState>(null);
  const [showAgentSelector, setShowAgentSelector] = useState<string | null>(null);
  const [selectedCall, setSelectedCall] = useState<CallHistoryItem | null>(null);
  const [agents, setAgents] = useState(() => {
    // Ensure only one agent is active initially from the mock data, if multiple are marked active.
    const firstActiveAgent = initialAgents.find(a => a.active);
    if (firstActiveAgent) {
      return initialAgents.map(a => 
        a.id === firstActiveAgent.id ? { ...a, active: true } : { ...a, active: false }
      );
    }
    // If no agent is marked active in mock data, activate the 'general' one as a fallback.
    return initialAgents.map(a => 
        a.id === 'general' ? { ...a, active: true } : { ...a, active: false }
    );
  });
  const [isVmActive, setIsVmActive] = useState(true);
  const { toast } = useToast();

  // Simulate an incoming call for demonstration & set muted state based on time
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!callState) {
        const hour = new Date().getHours();
        const isOffHours = hour >= 17 || hour < 7;
        
        setCallState({ 
            number: '0176 1234 5678',
            status: 'incoming', 
            startMuted: isOffHours 
        });
      }
    }, 8000); // Incoming call after 8 seconds
    return () => clearTimeout(timeout);
  }, [callState]);

  // Handle auto-answer during working hours
  useEffect(() => {
    if (callState?.status !== 'incoming') {
      return;
    }

    const hour = new Date().getHours();
    const isWorkingHours = hour >= 7 && hour < 17;

    if (!isWorkingHours) {
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
  }, [callState?.status, callState?.number, toast]);


  const handleStartCall = (number: string) => {
    setShowAgentSelector(number);
  };

  const handleStartCallManually = (number: string) => {
    setCallState({ number, status: 'active' });
  };

  const handleAgentSelect = (agentId: string, notes: string) => {
    if(showAgentSelector) {
        toast({
          title: "KI-Anruf wird gestartet...",
          description: `Agent wird mit Ihren Notizen vorbereitet.`
        });
        setCallState({ number: showAgentSelector, status: 'active', agentId, notes });
        setShowAgentSelector(null);
    }
  };

  const handleVmToggle = async (active: boolean) => {
    toast({
      title: `VoIP VM wird ${active ? 'aktiviert' : 'deaktiviert'}...`,
      description: 'Simuliere globalen Status-Wechsel.',
    });

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsVmActive(active);

    if (active) {
      // When activating VM, ensure exactly one agent is active.
      // Activate 'general' and deactivate others.
      const generalAgentExists = agents.some(a => a.id === 'general');
      const agentToActivate = generalAgentExists ? 'general' : agents[0]?.id;

      if(agentToActivate) {
        setAgents(prev => 
          prev.map(a => 
            a.id === agentToActivate ? { ...a, active: true } : { ...a, active: false }
          )
        );
        const activeAgent = agents.find(a => a.id === agentToActivate);
        const agentName = activeAgent ? activeAgent.name : "KI-Zentrale";
        toast({
          title: 'Erfolgreich!',
          description: `VoIP VM wurde aktiviert. Agent ${agentName} ist jetzt aktiv.`,
        });
      }
      
    } else {
      // When deactivating VM, deactivate all agents.
      setAgents(prev => 
        prev.map(a => ({ ...a, active: false }))
      );
      toast({
        title: 'Erfolgreich!',
        description: 'VoIP VM wurde deaktiviert. Alle KI-Agenten sind offline.',
      });
    }
  };

  const handleAgentToggle = async (agentId: string, active: boolean) => {
    const activeAgentsCount = agents.filter(a => a.active).length;

    if (!active && isVmActive && activeAgentsCount <= 1) {
      toast({
        title: 'Aktion nicht möglich',
        description: 'Es muss mindestens ein KI-Agent aktiv sein, solange die VM aktiviert ist.',
        variant: 'destructive',
      });
      return;
    }

    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;

    toast({
      title: 'Agent-Status wird aktualisiert...',
      description: `Simuliere API-Aufruf, um ${agent.name} zu ${active ? 'aktivieren' : 'deaktivieren'}.`,
    });
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (active) {
      // When activating an agent, set it as the only active one.
      setAgents(prevAgents => 
        prevAgents.map(a => 
          a.id === agentId ? { ...a, active: true } : { ...a, active: false }
        )
      );
    } else {
      setAgents(prevAgents => 
        prevAgents.map(a => 
          a.id === agentId ? { ...a, active: false } : a
        )
      );
    }

    toast({
      title: 'Erfolgreich!',
      description: `Agent ${agent.name} wurde ${active ? 'aktiviert' : 'deaktiviert'}.`,
    });
  };
  
  const handleUpdateAgentName = (agentId: string, newName: string) => {
    setAgents(prevAgents =>
      prevAgents.map(a =>
        a.id === agentId ? { ...a, name: newName } : a
      )
    );
    toast({
        title: "Agent umbenannt",
        description: `Der Agent wurde erfolgreich in "${newName}" umbenannt.`
    })
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
    setCallState(null);
    setSelectedCall(null);
  };

  return {
    activeTab, setActiveTab,
    callState,
    showAgentSelector, setShowAgentSelector,
    selectedCall, setSelectedCall,
    agents,
    isVmActive,
    handleStartCall,
    handleStartCallManually,
    handleAgentSelect,
    handleVmToggle,
    handleAgentToggle,
    handleUpdateAgentName,
    handleAcceptCallWithAI,
    handleAcceptCallManually,
    handleEndCall,
  };
}
