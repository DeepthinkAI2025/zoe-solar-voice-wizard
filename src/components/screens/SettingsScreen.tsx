import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import type { aiAgents } from '@/data/mock';
import { VoiceCloneDialog } from '@/components/VoiceCloneDialog';

type AgentWithSettings = (typeof aiAgents)[0] & {
  purpose: string;
  systemInstructions: string;
};

interface SettingsScreenProps {
  autoAnswerEnabled: boolean;
  onAutoAnswerToggle: (enabled: boolean) => void;
  workingHoursStart: number;
  onWorkingHoursStartChange: (hour: number) => void;
  workingHoursEnd: number;
  onWorkingHoursEndChange: (hour: number) => void;
  silentModeEnabled: boolean;
  onSilentModeToggle: (enabled: boolean) => void;
  // New props
  agents: AgentWithSettings[];
  isVmActive: boolean;
  onToggleAgent: (agentId: string, active: boolean) => void;
  globalSystemInstructions: string;
  onGlobalSystemInstructionsChange: (instructions: string) => void;
  onUpdateAgentDetails: (agentId: string, details: Partial<Omit<AgentWithSettings, 'id' | 'icon' | 'active'>>) => void;
}


const SettingsScreen: React.FC<SettingsScreenProps> = ({
  autoAnswerEnabled,
  onAutoAnswerToggle,
  workingHoursStart,
  onWorkingHoursStartChange,
  workingHoursEnd,
  onWorkingHoursEndChange,
  silentModeEnabled,
  onSilentModeToggle,
  agents,
  isVmActive,
  onToggleAgent,
  globalSystemInstructions,
  onGlobalSystemInstructionsChange,
  onUpdateAgentDetails,
}) => {
  const { setTheme } = useTheme();
  const [cloningAgentId, setCloningAgentId] = useState<string | null>(null);

  const handleStartHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= 23) {
      onWorkingHoursStartChange(value);
    }
  };

  const handleEndHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= 23) {
      onWorkingHoursEndChange(value);
    }
  };


  return (
    <div className="p-4 space-y-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold">Einstellungen</h2>

      <div className="space-y-4 p-4 bg-secondary rounded-lg">
        <h3 className="text-lg font-semibold">Darstellung</h3>
        <div className="flex items-center justify-between">
          <Label>Theme</Label>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setTheme('light')} className="hover:bg-accent hover:text-accent-foreground">Hell</Button>
            <Button variant="outline" onClick={() => setTheme('dark')} className="hover:bg-accent hover:text-accent-foreground">Dunkel</Button>
            <Button variant="outline" onClick={() => setTheme('system')} className="hover:bg-accent hover:text-accent-foreground">System</Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 p-4 bg-secondary rounded-lg">
        <h3 className="text-lg font-semibold">Anruf-Automatisierung</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-answer-toggle" className="pr-4">Anrufe während der Arbeitszeit automatisch annehmen</Label>
          <Switch
            id="auto-answer-toggle"
            checked={autoAnswerEnabled}
            onCheckedChange={onAutoAnswerToggle}
          />
        </div>
        
        {autoAnswerEnabled && (
          <div className="space-y-2 pt-4 border-t border-border mt-4">
            <Label>Arbeitszeiten (Anrufe werden nach 6s angenommen)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                max="23"
                value={workingHoursStart}
                onChange={handleStartHourChange}
                className="w-20"
              />
              <span>bis</span>
              <Input
                type="number"
                min="0"
                max="23"
                value={workingHoursEnd}
                onChange={handleEndHourChange}
                className="w-20"
              />
              <span>Uhr</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 p-4 bg-secondary rounded-lg">
        <h3 className="text-lg font-semibold">Stumm-Modus</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="silent-mode-toggle" className="pr-4">Eingehende Anrufe außerhalb der Arbeitszeiten stummschalten</Label>
          <Switch
            id="silent-mode-toggle"
            checked={silentModeEnabled}
            onCheckedChange={onSilentModeToggle}
          />
        </div>
      </div>

      <div className="space-y-4 p-4 bg-secondary rounded-lg">
        <h3 className="text-lg font-semibold">KI-Agenten</h3>
        <div className="space-y-2">
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
            <div key={agent.id} className="p-4 bg-muted rounded-md">
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
                <Button variant="outline" onClick={() => setCloningAgentId(agent.id)}>
                    Stimme klonen
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {cloningAgentId && (
        <VoiceCloneDialog
          agent={agents.find(a => a.id === cloningAgentId)}
          onClose={() => setCloningAgentId(null)}
          onUpload={() => {
            console.log('Upload for', cloningAgentId);
            // Hier würde die Logik für den Datei-Upload ausgelöst
            setCloningAgentId(null);
          }}
          onRecord={() => {
            console.log('Record for', cloningAgentId);
            // Hier würde die Logik für die Audio-Aufnahme ausgelöst
            setCloningAgentId(null);
          }}
        />
      )}
    </div>
  );
};

export default SettingsScreen;
