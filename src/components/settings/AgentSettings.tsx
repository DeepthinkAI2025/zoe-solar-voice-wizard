
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { AgentWithSettings } from '@/hooks/useAgentManagement';
import { AgentCard } from './AgentCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

      <div className="pt-4 border-t border-border mt-4">
        <Accordion type="multiple" className="w-full space-y-4">
          {agents.map((agent) => (
            <AccordionItem value={agent.id} key={agent.id} className="bg-muted rounded-md border-b-0">
              <AccordionTrigger className="p-4 hover:no-underline rounded-md [&[data-state=open]]:rounded-b-none">
                <div className="flex items-center justify-between w-full">
                  <span className="text-base font-medium">{agent.name} <span className="text-muted-foreground">({agent.purpose})</span></span>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs text-muted-foreground">{agent.active ? 'Aktiv' : 'Inaktiv'}</span>
                    <Switch
                      id={`agent-toggle-${agent.id}`}
                      checked={agent.active}
                      onCheckedChange={(checked) => onToggleAgent(agent.id, checked)}
                      disabled={!isVmActive}
                    />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0">
                <div className="pt-4 border-t border-border">
                  <AgentCard 
                    agent={agent} 
                    onUpdateAgentDetails={onUpdateAgentDetails}
                    onStartVoiceClone={onStartVoiceClone}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
