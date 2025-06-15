
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
    <div className="space-y-2 p-4 bg-secondary rounded-lg text-left">
      <h3 className="text-lg font-semibold">Stumm-Modus</h3>
      <div className="flex items-center justify-between pt-2">
        <Label htmlFor="silent-mode-toggle" className="pr-4">Stummschaltung aktivieren</Label>
        <Switch
          id="silent-mode-toggle"
          checked={silentModeEnabled}
          onCheckedChange={onSilentModeToggle}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Eingehende Anrufe außerhalb der Arbeitszeiten werden stummgeschaltet.
      </p>
    </div>
  );
};
