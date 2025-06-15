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
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

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
            <AccordionItem value={agent.id} key={agent.id} className={cn(
              "border-none rounded-lg transition-all duration-300",
              agent.active && "ring-2 ring-primary/30"
            )}>
              <AccordionTrigger className="p-4 hover:no-underline bg-muted rounded-lg data-[state=open]:rounded-b-none">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4 text-left">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-foreground">{agent.name}</div>
                      <div className="text-sm text-muted-foreground">{agent.purpose}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1 pl-2 text-center" onClick={(e) => e.stopPropagation()}>
                    <Switch
                      id={`agent-toggle-${agent.id}`}
                      checked={agent.active}
                      onCheckedChange={(checked) => onToggleAgent(agent.id, checked)}
                      disabled={!isVmActive}
                    />
                    <span className="text-xs text-muted-foreground mt-1 w-12">{agent.active ? 'Aktiv' : 'Inaktiv'}</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0 bg-muted rounded-b-lg">
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
