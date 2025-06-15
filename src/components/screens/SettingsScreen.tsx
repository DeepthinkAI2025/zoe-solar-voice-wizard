import React, { useState, useRef, useEffect } from 'react';
import type { AgentWithSettings } from '@/hooks/useAgentManagement';
import { VoiceCloneDialog } from '@/components/VoiceCloneDialog';
import { AppearanceSettings } from '../settings/AppearanceSettings';
import { CallAutomationSettings } from '../settings/CallAutomationSettings';
import { SilentModeSettings } from '../settings/SilentModeSettings';
import { HandleInBackgroundSettings } from '../settings/HandleInBackgroundSettings';
import { AgentSettings } from '../settings/AgentSettings';
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
interface SettingsScreenProps {
  autoAnswerEnabled: boolean;
  onAutoAnswerToggle: (enabled: boolean) => void;
  workingHoursStart: number;
  onWorkingHoursStartChange: (hour: number) => void;
  workingHoursEnd: number;
  onWorkingHoursEndChange: (hour: number) => void;
  silentModeEnabled: boolean;
  onSilentModeToggle: (enabled: boolean) => void;
  handleInBackground: boolean;
  onHandleInBackgroundToggle: (enabled: boolean) => void;
  agents: AgentWithSettings[];
  isVmActive: boolean;
  onVmToggle: (active: boolean) => void;
  onToggleAgent: (agentId: string, active: boolean) => void;
  globalSystemInstructions: string;
  onGlobalSystemInstructionsChange: (instructions: string) => void;
  onUpdateAgentDetails: (agentId: string, details: Partial<Omit<AgentWithSettings, 'id' | 'icon' | 'active'>>) => void;
  agentToFocusInSettings: string | null;
  setAgentToFocusInSettings: (id: string | null) => void;
}
const SettingsScreen: React.FC<SettingsScreenProps> = props => {
  const [cloningAgentId, setCloningAgentId] = useState<string | null>(null);
  const [openAgentIds, setOpenAgentIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    toast
  } = useToast();
  useEffect(() => {
    if (props.agentToFocusInSettings) {
      const agentId = props.agentToFocusInSettings;
      setOpenAgentIds([agentId]);

      // Scroll to the agent card after a short delay to allow the UI to update
      setTimeout(() => {
        const element = document.getElementById(`agent-settings-${agentId}`);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
        // Reset the focus trigger after attempting to scroll
        props.setAgentToFocusInSettings(null);
      }, 300); // This delay should be enough for the accordion animation to complete
    }
  }, [props.agentToFocusInSettings, props.setAgentToFocusInSettings]);
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && cloningAgentId) {
      const agent = props.agents.find(a => a.id === cloningAgentId);
      props.onUpdateAgentDetails(cloningAgentId, {
        voiceCloned: true
      });
      toast({
        title: "Stimme geklont!",
        description: `Für ${agent?.name || 'Agent'} wurde die Stimme via "${file.name}" erfolgreich hinterlegt.`
      });
      console.log('Uploading file:', file.name, 'for agent:', cloningAgentId);
      // In a real app, you'd upload the file here.
      setCloningAgentId(null);
    }
  };
  const handleRecordComplete = (blob: Blob) => {
    if (cloningAgentId) {
      const agent = props.agents.find(a => a.id === cloningAgentId);
      props.onUpdateAgentDetails(cloningAgentId, {
        voiceCloned: true
      });
      toast({
        title: "Stimme geklont!",
        description: `Für ${agent?.name || 'Agent'} wurde die aufgenommene Stimme erfolgreich hinterlegt.`
      });
      console.log('Recording complete for agent:', cloningAgentId, blob);
      // In a real app, you'd upload the blob here.
      setCloningAgentId(null);
    }
  };
  return <div className="p-4 space-y--5 h-full overflow-y-auto py-px">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="audio/*" />

      <AppearanceSettings />
      
      <CallAutomationSettings autoAnswerEnabled={props.autoAnswerEnabled} onAutoAnswerToggle={props.onAutoAnswerToggle} workingHoursStart={props.workingHoursStart} onWorkingHoursStartChange={props.onWorkingHoursStartChange} workingHoursEnd={props.workingHoursEnd} onWorkingHoursEndChange={props.onWorkingHoursEndChange} />
      
      <HandleInBackgroundSettings handleInBackground={props.handleInBackground} onHandleInBackgroundToggle={props.onHandleInBackgroundToggle} />

      <SilentModeSettings silentModeEnabled={props.silentModeEnabled} onSilentModeToggle={props.onSilentModeToggle} />

      <AgentSettings agents={props.agents} isVmActive={props.isVmActive} onVmToggle={props.onVmToggle} onToggleAgent={props.onToggleAgent} globalSystemInstructions={props.globalSystemInstructions} onGlobalSystemInstructionsChange={props.onGlobalSystemInstructionsChange} onUpdateAgentDetails={props.onUpdateAgentDetails} onStartVoiceClone={setCloningAgentId} openAgentIds={openAgentIds} onOpenAgentIdsChange={setOpenAgentIds} />

      {cloningAgentId && <VoiceCloneDialog agent={props.agents.find(a => a.id === cloningAgentId)} onClose={() => setCloningAgentId(null)} onUpload={handleUploadClick} onRecordComplete={handleRecordComplete} />}
    </div>;
};
export default SettingsScreen;