import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { X, Phone, CalendarClock, Pencil } from 'lucide-react';
import { Switch } from './ui/switch';
import { cn } from '@/lib/utils';
import type { aiAgents } from '@/data/mock';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Input } from './ui/input';
import ScheduleCallDialog from './ScheduleCallDialog';

type Agent = (typeof aiAgents)[0];

interface AgentSelectorProps {
  onSelect: (agentId: string, notes: string) => void;
  onClose: () => void;
  numberToCall: string;
  contactName?: string;
  agents: Agent[];
  onToggleAgent: (agentId: string, active: boolean) => void;
  onUpdateAgentName: (agentId: string, newName: string) => void;
  isVmActive: boolean;
  onToggleVm: (active: boolean) => void;
  onScheduleCall: (agentId: string, notes: string, date: Date) => void;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({ onSelect, onClose, numberToCall, contactName, agents, onToggleAgent, onUpdateAgentName, isVmActive, onToggleVm, onScheduleCall }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  useEffect(() => {
    const activeAgent = agents.find(a => a.active);
    if (activeAgent) {
      setSelectedAgentId(activeAgent.id);
    } else {
      setSelectedAgentId(null);
    }
  }, [agents]);

  const handleSelectAndCall = () => {
    if (selectedAgentId) {
      onSelect(selectedAgentId, notes);
    }
  };

  const handleSchedule = (date: Date) => {
    if (selectedAgentId) {
      onScheduleCall(selectedAgentId, notes, date);
    }
  };

  const handleNameUpdate = () => {
    if (editingAgentId && editingName.trim()) {
      onUpdateAgentName(editingAgentId, editingName.trim());
    }
    setEditingAgentId(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-2xl p-6 w-[90%] max-w-md animate-slide-up relative flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-white mb-2">KI-Agent auswählen</h2>
        <p className="text-muted-foreground mb-6">
          für Anruf an{' '}
          {contactName ? (
            <>
              <span className="text-white font-semibold">{contactName}</span>
              <span className="text-primary ml-1.5">({numberToCall})</span>
            </>
          ) : (
            <span className="text-primary">{numberToCall}</span>
          )}
        </p>
        
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
        
        <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2 flex-grow">
          {agents.map(agent => (
            <div
              key={agent.id}
              onClick={() => agent.active && setSelectedAgentId(agent.id)}
              className={cn(
                "relative flex flex-col p-4 rounded-lg bg-white/5 border transition-all text-left",
                selectedAgentId === agent.id ? 'border-primary' : 'border-transparent',
                !agent.active && "opacity-60 cursor-not-allowed",
                agent.active && "cursor-pointer"
              )}
            >
              <Switch
                  checked={agent.active}
                  onCheckedChange={(checked) => onToggleAgent(agent.id, checked)}
                  onClick={(e) => e.stopPropagation()}
                  disabled={!isVmActive}
                  aria-label={`Agent ${agent.name} ${agent.active ? 'deaktivieren' : 'aktivieren'}`}
                  className="absolute top-4 right-4"
              />
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3 flex-shrink-0">
                  <Icon name={agent.icon} size={20} className="text-primary" />
              </div>
              <div className="flex-grow">
                {editingAgentId === agent.id ? (
                    <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onBlur={handleNameUpdate}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleNameUpdate();
                            if (e.key === 'Escape') setEditingAgentId(null);
                        }}
                        className="bg-white/10 border-primary h-8 text-white w-full"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{agent.name}</p>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditingAgentId(agent.id);
                                setEditingName(agent.name);
                            }}
                            className="text-muted-foreground hover:text-white"
                            aria-label={`Namen von ${agent.name} bearbeiten`}
                            disabled={!agent.active}
                        >
                            <Pencil size={14} />
                        </button>
                    </div>
                )}
                <p className="text-sm text-muted-foreground mt-1">{agent.description}</p>
              </div>
            </div>
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
                disabled={!selectedAgentId}
            />
        </div>

        <div className="mt-6 flex gap-3 flex-shrink-0">
            <Button onClick={handleSelectAndCall} disabled={!selectedAgentId} className="flex-1">
                <Phone />
                Anruf mit KI starten
            </Button>
            <Button variant="outline" onClick={() => setIsScheduling(true)} disabled={!selectedAgentId}>
                <CalendarClock />
                Planen
            </Button>
        </div>

        <ScheduleCallDialog
            isOpen={isScheduling}
            onClose={() => setIsScheduling(false)}
            onSchedule={handleSchedule}
            numberToCall={numberToCall}
        />

      </div>
    </div>
  );
};

export default AgentSelector;
