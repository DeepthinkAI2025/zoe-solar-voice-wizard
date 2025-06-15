
import React from 'react';
import Icon from './Icon';
import { X } from 'lucide-react';
import { Switch } from './ui/switch';
import { cn } from '@/lib/utils';
import type { aiAgents } from '@/data/mock';

type Agent = (typeof aiAgents)[0];

interface AgentSelectorProps {
  onSelect: (agentId: string) => void;
  onClose: () => void;
  numberToCall: string;
  agents: Agent[];
  onToggleAgent: (agentId: string, active: boolean) => void;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({ onSelect, onClose, numberToCall, agents, onToggleAgent }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-2xl p-6 w-[90%] max-w-md animate-slide-up relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-white mb-2">KI-Agent auswählen</h2>
        <p className="text-muted-foreground mb-6">für Anruf an <span className="text-primary">{numberToCall}</span></p>
        <div className="space-y-3">
          {agents.map(agent => (
            <button
              key={agent.id}
              onClick={() => onSelect(agent.id)}
              disabled={!agent.active}
              className={cn(
                "w-full flex items-center p-4 rounded-lg bg-white/5 border border-transparent transition-all text-left",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                agent.active && "hover:bg-white/10 hover:border-primary/50"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4 flex-shrink-0">
                  <Icon name={agent.icon} size={20} className="text-primary" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-white">{agent.name}</p>
                    <Switch
                        checked={agent.active}
                        onCheckedChange={(checked) => onToggleAgent(agent.id, checked)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Agent ${agent.name} ${agent.active ? 'deaktivieren' : 'aktivieren'}`}
                    />
                </div>
                <p className="text-sm text-muted-foreground mt-1 pr-4">{agent.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentSelector;
