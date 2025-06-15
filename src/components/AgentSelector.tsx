
import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { X, Phone, CalendarClock } from 'lucide-react';
import { Switch } from './ui/switch';
import { cn } from '@/lib/utils';
import type { aiAgents } from '@/data/mock';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

type Agent = (typeof aiAgents)[0];

interface AgentSelectorProps {
  onSelect: (agentId: string, notes: string) => void;
  onClose: () => void;
  numberToCall: string;
  agents: Agent[];
  onToggleAgent: (agentId: string, active: boolean) => void;
  isVmActive: boolean;
  onToggleVm: (active: boolean) => void;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({ onSelect, onClose, numberToCall, agents, onToggleAgent, isVmActive, onToggleVm }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (selectedAgentId) {
      const selectedAgent = agents.find(a => a.id === selectedAgentId);
      if (!selectedAgent?.active) {
        setSelectedAgentId(null);
      }
    }
  }, [agents, selectedAgentId]);

  const handleSelectAndCall = () => {
    if (selectedAgentId) {
      onSelect(selectedAgentId, notes);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-2xl p-6 w-[90%] max-w-md animate-slide-up relative flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-white mb-2">KI-Agent auswählen</h2>
        <p className="text-muted-foreground mb-6">für Anruf an <span className="text-primary">{numberToCall}</span></p>
        
        <div className="border border-border p-4 rounded-lg mb-6 bg-white/5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-semibold text-white">VoIP VM</p>
                    <p className="text-sm text-muted-foreground mt-1">Globale KI-Verfügbarkeit</p>
                </div>
                <Switch
                    checked={isVmActive}
                    onCheckedChange={onToggleVm}
                    aria-label="VoIP VM global an-/ausschalten"
                />
            </div>
        </div>
        
        <div className="space-y-3 overflow-y-auto pr-2 flex-grow">
          {agents.map(agent => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              disabled={!agent.active}
              className={cn(
                "w-full flex items-center p-4 rounded-lg bg-white/5 border transition-all text-left",
                selectedAgentId === agent.id ? 'border-primary' : 'border-transparent',
                "disabled:opacity-60 disabled:cursor-not-allowed",
                agent.active && "hover:bg-white/10"
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
                        disabled={!isVmActive}
                        aria-label={`Agent ${agent.name} ${agent.active ? 'deaktivieren' : 'aktivieren'}`}
                    />
                </div>
                <p className="text-sm text-muted-foreground mt-1 pr-4">{agent.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex-shrink-0">
            <label htmlFor="notes" className="text-sm font-medium text-white mb-2 block">Gesprächsinformationen (optional)</label>
            <Textarea 
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Was soll der KI-Agent wissen? z.B. Kontext zum Anruf, Kundennummer, etc."
                className="bg-white/5 border-white/10"
                disabled={!isVmActive}
            />
        </div>

        <div className="mt-6 flex gap-3 flex-shrink-0">
            <Button onClick={handleSelectAndCall} disabled={!selectedAgentId} className="flex-1">
                <Phone />
                Anruf mit KI starten
            </Button>
            <Button variant="outline" disabled>
                <CalendarClock />
                Planen
            </Button>
        </div>

      </div>
    </div>
  );
};

export default AgentSelector;
