
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ScheduleCallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: Date) => void;
  numberToCall: string;
}

const generateTimeSlots = () => {
  const slots = [];
  for (let h = 8; h < 20; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      slots.push(`${hour}:${minute}`);
    }
  }
  return slots;
};

const ScheduleCallDialog: React.FC<ScheduleCallDialogProps> = ({ isOpen, onClose, onSchedule, numberToCall }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>('09:00');
  const timeSlots = generateTimeSlots();

  const handleSchedule = () => {
    if (date) {
      const [hours, minutes] = time.split(':').map(Number);
      const scheduledDate = new Date(date);
      scheduledDate.setHours(hours, minutes, 0, 0);
      onSchedule(scheduledDate);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Anruf planen</DialogTitle>
          <DialogDescription>
            Wählen Sie Datum und Uhrzeit für den Anruf an {numberToCall}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row gap-4 py-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border bg-background"
            disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() - 1))}
          />
          <div className="flex flex-col justify-center space-y-4">
             <label className="text-sm font-medium">Uhrzeit</label>
             <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Uhrzeit" />
                </SelectTrigger>
                <SelectContent>
                    {timeSlots.map(slot => (
                        <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                </SelectContent>
             </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Abbrechen</Button>
          <Button onClick={handleSchedule} disabled={!date}>Planen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleCallDialog;
