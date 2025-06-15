
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SilentModeSettingsProps {
  silentModeEnabled: boolean;
  onSilentModeToggle: (enabled: boolean) => void;
}

export const SilentModeSettings: React.FC<SilentModeSettingsProps> = ({
  silentModeEnabled,
  onSilentModeToggle,
}) => {
  return (
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
  );
};
