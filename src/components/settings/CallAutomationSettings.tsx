
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface CallAutomationSettingsProps {
  autoAnswerEnabled: boolean;
  onAutoAnswerToggle: (enabled: boolean) => void;
  workingHoursStart: number;
  onWorkingHoursStartChange: (hour: number) => void;
  workingHoursEnd: number;
  onWorkingHoursEndChange: (hour: number) => void;
}

export const CallAutomationSettings: React.FC<CallAutomationSettingsProps> = ({
  autoAnswerEnabled,
  onAutoAnswerToggle,
  workingHoursStart,
  onWorkingHoursStartChange,
  workingHoursEnd,
  onWorkingHoursEndChange,
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
    <div className="space-y-4 p-4 bg-secondary rounded-lg text-left">
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
          <Label>Arbeitszeiten (Anrufe werden nach 3-8s angenommen)</Label>
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
  );
};
