
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface SettingsScreenProps {
  autoAnswerEnabled: boolean;
  onAutoAnswerToggle: (enabled: boolean) => void;
  workingHoursStart: number;
  onWorkingHoursStartChange: (hour: number) => void;
  workingHoursEnd: number;
  onWorkingHoursEndChange: (hour: number) => void;
  silentModeEnabled: boolean;
  onSilentModeToggle: (enabled: boolean) => void;
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
}) => {
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
    <div className="p-4 space-y-6 text-white h-full overflow-y-auto">
      <h2 className="text-2xl font-bold">Einstellungen</h2>
      
      <div className="space-y-4 p-4 bg-white/5 rounded-lg">
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
          <div className="space-y-2 pt-4 border-t border-white/10 mt-4">
            <Label>Arbeitszeiten (Anrufe werden nach 6s angenommen)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                max="23"
                value={workingHoursStart}
                onChange={handleStartHourChange}
                className="w-20 bg-black/20 border-white/20"
              />
              <span>bis</span>
              <Input
                type="number"
                min="0"
                max="23"
                value={workingHoursEnd}
                onChange={handleEndHourChange}
                className="w-20 bg-black/20 border-white/20"
              />
              <span>Uhr</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 p-4 bg-white/5 rounded-lg">
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
    </div>
  );
};

export default SettingsScreen;
