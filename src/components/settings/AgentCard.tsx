
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { aiAgents } from '@/data/mock';

type AgentWithSettings = (typeof aiAgents)[0] & {
  purpose: string;
  systemInstructions: string;
};

interface AgentCardProps {
  agent: AgentWithSettings;
  isVmActive: boolean;
  onToggleAgent: (agentId: string, active: boolean) => void;
  onUpdateAgentDetails: (agentId: string, details: Partial<Omit<AgentWithSettings, 'id' | 'icon' | 'active'>>) => void;
  onStartVoiceClone: (agentId: string) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  isVmActive,
  onToggleAgent,
  onUpdateAgentDetails,
  onStartVoiceClone,
}) => {
  return (
    <div className="p-4 bg-muted rounded-md">
      <div className="flex items-center justify-between mb-4">
        <Label className="text-base font-medium">{agent.name} <span className="text-muted-foreground">({agent.purpose})</span></Label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{agent.active ? 'Aktiv' : 'Inaktiv'}</span>
          <Switch
            checked={agent.active}
            onCheckedChange={(checked) => onToggleAgent(agent.id, checked)}
            disabled={!isVmActive}
          />
        </div>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
            <div>
                <Label htmlFor={`agent-name-${agent.id}`} className="text-xs text-muted-foreground">Name (für KI)</Label>
                <Input
                  id={`agent-name-${agent.id}`}
                  value={agent.name}
                  onChange={(e) => onUpdateAgentDetails(agent.id, { name: e.target.value })}
                   className="text-sm h-9"
                />
            </div>
            <div>
                <Label htmlFor={`agent-purpose-${agent.id}`} className="text-xs text-muted-foreground">Zweck (intern)</Label>
                <Input
                  id={`agent-purpose-${agent.id}`}
                  value={agent.purpose}
                  onChange={(e) => onUpdateAgentDetails(agent.id, { purpose: e.target.value })}
                   className="text-sm h-9"
                />
            </div>
        </div>
        <div>
          <Label htmlFor={`agent-instructions-${agent.id}`} className="text-xs text-muted-foreground">Spezifische Anweisungen</Label>
          <Textarea
            id={`agent-instructions-${agent.id}`}
            placeholder={`Spezifische Anweisungen für ${agent.name}...`}
            value={agent.systemInstructions}
            onChange={(e) => onUpdateAgentDetails(agent.id, { systemInstructions: e.target.value })}
            className="text-sm"
            rows={3}
          />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <Button variant="outline" onClick={() => onStartVoiceClone(agent.id)}>
            Stimme klonen
        </Button>
      </div>
    </div>
  );
};
