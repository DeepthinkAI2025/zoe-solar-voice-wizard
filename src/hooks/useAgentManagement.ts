
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { aiAgents as initialAgents } from '@/data/mock';

export const useAgentManagement = () => {
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
  
  return {
    agents,
    isVmActive,
    handleVmToggle,
    handleAgentToggle,
    handleUpdateAgentName,
  };
};
