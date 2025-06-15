
import React, { useState } from 'react';
import type { aiAgents } from '@/data/mock';
import { VoiceCloneDialog } from '@/components/VoiceCloneDialog';
import { AppearanceSettings } from '../settings/AppearanceSettings';
import { CallAutomationSettings } from '../settings/CallAutomationSettings';
import { SilentModeSettings } from '../settings/SilentModeSettings';
import { AgentSettings } from '../settings/AgentSettings';

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
  agents: AgentWithSettings[];
  isVmActive: boolean;
  onVmToggle: (active: boolean) => void;
  onToggleAgent: (agentId: string, active: boolean) => void;
  globalSystemInstructions: string;
  onGlobalSystemInstructionsChange: (instructions: string) => void;
  onUpdateAgentDetails: (agentId: string, details: Partial<Omit<AgentWithSettings, 'id' | 'icon' | 'active'>>) => void;
}


const SettingsScreen: React.FC<SettingsScreenProps> = (props) => {
  const [cloningAgentId, setCloningAgentId] = useState<string | null>(null);

  return (
    <div className="p-4 space-y-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold">Einstellungen</h2>

      <AppearanceSettings />
      
      <CallAutomationSettings 
        autoAnswerEnabled={props.autoAnswerEnabled}
        onAutoAnswerToggle={props.onAutoAnswerToggle}
        workingHoursStart={props.workingHoursStart}
        onWorkingHoursStartChange={props.onWorkingHoursStartChange}
        workingHoursEnd={props.workingHoursEnd}
        onWorkingHoursEndChange={props.onWorkingHoursEndChange}
      />

      <SilentModeSettings 
        silentModeEnabled={props.silentModeEnabled}
        onSilentModeToggle={props.onSilentModeToggle}
      />

      <AgentSettings
        agents={props.agents}
        isVmActive={props.isVmActive}
        onVmToggle={props.onVmToggle}
        onToggleAgent={props.onToggleAgent}
        globalSystemInstructions={props.globalSystemInstructions}
        onGlobalSystemInstructionsChange={props.onGlobalSystemInstructionsChange}
        onUpdateAgentDetails={props.onUpdateAgentDetails}
        onStartVoiceClone={setCloningAgentId}
      />

      {cloningAgentId && (
        <VoiceCloneDialog
          agent={props.agents.find(a => a.id === cloningAgentId)}
          onClose={() => setCloningAgentId(null)}
          onUpload={() => {
            console.log('Upload for', cloningAgentId);
            setCloningAgentId(null);
          }}
          onRecord={() => {
            console.log('Record for', cloningAgentId);
            setCloningAgentId(null);
          }}
        />
      )}
    </div>
  );
};

export default SettingsScreen;
