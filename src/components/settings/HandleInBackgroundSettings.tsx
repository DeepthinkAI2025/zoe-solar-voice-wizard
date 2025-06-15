
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface HandleInBackgroundSettingsProps {
  handleInBackground: boolean;
  onHandleInBackgroundToggle: (enabled: boolean) => void;
}

export const HandleInBackgroundSettings: React.FC<HandleInBackgroundSettingsProps> = ({
  handleInBackground,
  onHandleInBackgroundToggle,
}) => {
  return (
    <div className="space-y-2 p-4 bg-secondary rounded-lg text-left">
      <h3 className="text-lg font-semibold">Hintergrund-Modus</h3>
      <div className="flex items-center justify-between pt-2">
        <Label htmlFor="handle-in-background-toggle" className="pr-4">
          Anrufe im Hintergrund annehmen
        </Label>
        <Switch
          id="handle-in-background-toggle"
          checked={handleInBackground}
          onCheckedChange={onHandleInBackgroundToggle}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Wenn aktiviert, werden eingehende Anrufe direkt von einem KI-Agenten angenommen, ohne den Anrufbildschirm anzuzeigen.
      </p>
    </div>
  );
};
