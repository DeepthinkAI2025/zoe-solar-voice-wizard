
import React from 'react';
import { aiAgents } from '@/data/mock';
import Icon from './Icon';
import { X } from 'lucide-react';

interface AgentSelectorProps {
  onSelect: (agentId: string) => void;
  onClose: () => void;
  numberToCall: string;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({ onSelect, onClose, numberToCall }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-2xl p-6 w-[90%] max-w-md animate-slide-up relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-white mb-2">KI-Agent auswählen</h2>
        <p className="text-muted-foreground mb-6">für Anruf an <span className="text-primary">{numberToCall}</span></p>
        <div className="space-y-3">
          {aiAgents.map(agent => (
            <button
              key={agent.id}
              onClick={() => onSelect(agent.id)}
              className="w-full flex items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-primary/50 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <Icon name={agent.icon} size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-white">{agent.name}</p>
                <p className="text-sm text-muted-foreground">{agent.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentSelector;
