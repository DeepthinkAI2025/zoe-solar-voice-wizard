
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { aiAgents } from '@/data/mock';
import { AgentCard } from './AgentCard';

type AgentWithSettings = (typeof aiAgents)[0] & {
  purpose: string;
  systemInstructions: string;
};

interface AgentSettingsProps {
  agents: AgentWithSettings[];
  isVmActive: boolean;
  onVmToggle: (active: boolean) => void;
  onToggleAgent: (agentId: string, active: boolean) => void;
  globalSystemInstructions: string;
  onGlobalSystemInstructionsChange: (instructions: string) => void;
  onUpdateAgentDetails: (agentId: string, details: Partial<Omit<AgentWithSettings, 'id' | 'icon' | 'active'>>) => void;
  onStartVoiceClone: (agentId: string) => void;
}

export const AgentSettings: React.FC<AgentSettingsProps> = ({
  agents,
  isVmActive,
  onVmToggle,
  onToggleAgent,
  globalSystemInstructions,
  onGlobalSystemInstructionsChange,
  onUpdateAgentDetails,
  onStartVoiceClone,
}) => {
  return (
    <div className="space-y-4 p-4 bg-secondary rounded-lg">
      <h3 className="text-lg font-semibold">KI-Agenten</h3>

      <div className="flex items-center justify-between pt-2">
        <Label htmlFor="vm-global-toggle" className="pr-4 text-left">VoIP VM global aktivieren</Label>
        <Switch
          id="vm-global-toggle"
          checked={isVmActive}
          onCheckedChange={onVmToggle}
        />
      </div>
      <p className="text-xs text-muted-foreground -mt-2 text-left">
        {isVmActive 
          ? "Anrufe werden von KI-Agenten bearbeitet. Es muss immer ein Agent aktiv sein."
          : "Alle KI-Agenten sind deaktiviert. Anrufe werden nicht automatisch angenommen."}
      </p>

      <div className="space-y-2 pt-4 border-t border-border mt-4">
        <Label htmlFor="global-instructions">Globale System-Anweisung</Label>
        <Textarea
          id="global-instructions"
          placeholder="z.B. Sei immer freundlich und professionell."
          value={globalSystemInstructions}
          onChange={(e) => onGlobalSystemInstructionsChange(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Diese Anweisung gilt für alle Agenten.</p>
      </div>

      <div className="space-y-4 pt-4 border-t border-border mt-4">
        {agents.map((agent) => (
          <AgentCard 
            key={agent.id} 
            agent={agent} 
            isVmActive={isVmActive}
            onToggleAgent={onToggleAgent}
            onUpdateAgentDetails={onUpdateAgentDetails}
            onStartVoiceClone={onStartVoiceClone}
          />
        ))}
      </div>
    </div>
  );
};
