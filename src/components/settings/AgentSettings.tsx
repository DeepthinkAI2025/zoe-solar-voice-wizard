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
  openAgentIds: string[];
  onOpenAgentIdsChange: (ids: string[]) => void;
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
  openAgentIds,
  onOpenAgentIdsChange,
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
        <Accordion 
            type="multiple" 
            className="w-full space-y-4"
            value={openAgentIds}
            onValueChange={onOpenAgentIdsChange}
        >
          {agents.map((agent) => (
            <AccordionItem value={agent.id} key={agent.id} id={`agent-settings-${agent.id}`} className={cn(
              "border-none rounded-lg transition-all duration-300",
              agent.active && "ring-2 ring-primary/30"
            )}>
              <AccordionTrigger className="p-4 hover:no-underline bg-muted rounded-lg data-[state=open]:rounded-b-none">
                <div className="flex items-center justify-between flex-1">
                  <div className="flex items-center gap-4 text-left">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-foreground">{agent.name}</div>
                      <div className="text-sm text-muted-foreground">{agent.purpose}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2 pl-2 text-center h-11" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleAgent(agent.id, !agent.active)}
                      disabled={!isVmActive}
                      className={cn(
                        "w-4 h-4 rounded-full transition-all",
                        agent.active ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-muted-foreground/50",
                        !isVmActive && "cursor-not-allowed opacity-50"
                      )}
                      aria-label={agent.active ? 'Agent deaktivieren' : 'Agent aktivieren'}
                    />
                    <span className="text-xs text-muted-foreground w-12">{agent.active ? 'Aktiv' : 'Inaktiv'}</span>
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
```

```typescript
import React, { useState, useRef, useEffect } from 'react';
import type { AgentWithSettings } from '@/hooks/useAgentManagement';
import { VoiceCloneDialog } from '@/components/VoiceCloneDialog';
import { AppearanceSettings } from '../settings/AppearanceSettings';
import { CallAutomationSettings } from '../settings/CallAutomationSettings';
import { SilentModeSettings } from '../settings/SilentModeSettings';
import { AgentSettings } from '../settings/AgentSettings';
import { useToast } from "@/components/ui/use-toast";

// Removed local AgentWithSettings type

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
  agentToFocusInSettings: string | null;
  setAgentToFocusInSettings: (id: string | null) => void;
}


const SettingsScreen: React.FC<SettingsScreenProps> = (props) => {
  const [cloningAgentId, setCloningAgentId] = useState<string | null>(null);
  const [openAgentIds, setOpenAgentIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (props.agentToFocusInSettings) {
      const agentId = props.agentToFocusInSettings;
      setOpenAgentIds([agentId]);

      // Scroll to the agent card after a short delay to allow the UI to update
      setTimeout(() => {
        const element = document.getElementById(`agent-settings-${agentId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      props.onUpdateAgentDetails(cloningAgentId, { voiceCloned: true });
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
      props.onUpdateAgentDetails(cloningAgentId, { voiceCloned: true });
       toast({
          title: "Stimme geklont!",
          description: `Für ${agent?.name || 'Agent'} wurde die aufgenommene Stimme erfolgreich hinterlegt.`
      });
      console.log('Recording complete for agent:', cloningAgentId, blob);
      // In a real app, you'd upload the blob here.
      setCloningAgentId(null);
    }
  };

  return (
    <div className="p-4 space-y-6 h-full overflow-y-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="audio/*"
      />
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
        openAgentIds={openAgentIds}
        onOpenAgentIdsChange={setOpenAgentIds}
      />

      {cloningAgentId && (
        <VoiceCloneDialog
          agent={props.agents.find(a => a.id === cloningAgentId)}
          onClose={() => setCloningAgentId(null)}
          onUpload={handleUploadClick}
          onRecordComplete={handleRecordComplete}
        />
      )}
    </div>
  );
};

export default SettingsScreen;
