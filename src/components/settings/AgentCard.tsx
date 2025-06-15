import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { AgentWithSettings } from '@/hooks/useAgentManagement';
import { CheckCircle } from 'lucide-react';

interface AgentCardProps {
  agent: AgentWithSettings;
  onUpdateAgentDetails: (agentId: string, details: Partial<Omit<AgentWithSettings, 'id' | 'icon' | 'active'>>) => void;
  onStartVoiceClone: (agentId: string) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onUpdateAgentDetails,
  onStartVoiceClone,
}) => {
  const [isEditingVoiceLabel, setIsEditingVoiceLabel] = useState(false);

  return (
    <>
      <div className="space-y-3">
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
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => onStartVoiceClone(agent.id)}>
              {agent.voiceCloned ? 'Stimme erneut klonen' : 'Stimme klonen'}
          </Button>
          {agent.voiceCloned && !isEditingVoiceLabel && (
              <div
                className="flex items-center gap-1 text-sm text-green-600 font-medium cursor-pointer"
                onClick={() => setIsEditingVoiceLabel(true)}
              >
                  <CheckCircle className="h-4 w-4" />
                  <span>{agent.voiceLabel || 'Stimme geklont'}</span>
              </div>
          )}
        </div>
        {agent.voiceCloned && isEditingVoiceLabel && (
            <div className="mt-3">
                <Label htmlFor={`agent-voice-label-${agent.id}`} className="text-xs text-muted-foreground">
                    Bezeichnung der Stimme
                </Label>
                <Input
                  id={`agent-voice-label-${agent.id}`}
                  placeholder="z.B. Freundliche Frauenstimme"
                  value={agent.voiceLabel || ''}
                  onChange={(e) => onUpdateAgentDetails(agent.id, { voiceLabel: e.target.value })}
                  onBlur={() => setIsEditingVoiceLabel(false)}
                  autoFocus
                  className="text-sm h-9"
                />
            </div>
        )}
      </div>
    </>
  );
};
