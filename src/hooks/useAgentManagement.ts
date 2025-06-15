
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { aiAgents as initialAgents } from '@/data/mock';

export type AgentWithSettings = (typeof initialAgents)[0] & {
  purpose: string;
  systemInstructions: string;
  voiceCloned?: boolean;
  voiceLabel?: string;
};

export const useAgentManagement = () => {
  const [agents, setAgents] = useState<AgentWithSettings[]>(() => {
    const agentsWithSettings = initialAgents.map(a => {
      let purpose = '';
      let systemInstructions = '';

      switch (a.id) {
        case 'general':
          purpose = 'Zentrale';
          systemInstructions = 'Du bist der primäre Ansprechpartner für allgemeine Anfragen. Leite technische Fragen an Thomas weiter.';
          break;
        case 'tech':
          purpose = 'Techniker';
          systemInstructions = 'Du bist der technische Support für Solaranlagen. Beantworte technische Fragen detailliert und präzise. Sei kurz und informativ.';
          break;
        case 'lead':
          purpose = 'Lead-Qualifizierung';
          systemInstructions = 'Du bist für die Qualifizierung von Neukundenanfragen zuständig. Finde heraus, ob der Anrufer an einer Solaranlage interessiert ist und sammle erste wichtige Informationen wie Name, Adresse und Anliegen.';
          break;
        case 'legal':
          purpose = 'Rechtsfragen';
          systemInstructions = 'Du bist Dr. Ziegler und beantwortest grundlegende rechtliche Fragen im Zusammenhang mit Solaranlagen. Bei komplexen Themen oder spezifischer Rechtsberatung verweise auf einen menschlichen Anwalt.';
          break;
      }

      return {
        ...a,
        purpose,
        systemInstructions,
        active: a.active || false,
        voiceCloned: false,
        voiceLabel: '',
      };
    });

    const firstActiveAgent = agentsWithSettings.find(a => a.active);
    if (firstActiveAgent) {
      return agentsWithSettings.map(a => 
        a.id === firstActiveAgent.id ? { ...a, active: true } : { ...a, active: false }
      );
    }
    
    return agentsWithSettings.map(a => 
        a.id === 'general' ? { ...a, active: true } : { ...a, active: false }
    );
  });
  const [isVmActive, setIsVmActive] = useState(true);
  const [globalSystemInstructions, setGlobalSystemInstructions] = useState(
    'Sei immer freundlich und professionell. Sprich Deutsch. Du bist ein KI-Assistent für die Firma ZOE Solar.'
  );
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
  
  const handleUpdateAgentDetails = (
    agentId: string, 
    details: Partial<Omit<AgentWithSettings, 'id' | 'icon' | 'active'>>
  ) => {
    setAgents(prevAgents =>
      prevAgents.map(a =>
        a.id === agentId ? { ...a, ...details } : a
      )
    );
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
    globalSystemInstructions,
    setGlobalSystemInstructions,
    handleVmToggle,
    handleAgentToggle,
    handleUpdateAgentName,
    handleUpdateAgentDetails,
  };
};
