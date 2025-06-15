
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { User, MapPin, ListTodo, CheckSquare, Square, FolderPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Appointment } from '@/hooks/useAppointments';
import type { Task } from '@/types/task';

interface AppointmentCardProps {
  appointment: Appointment;
  appointmentTasks: Task[];
  formatTime: (dateString: string) => string;
  onAddTask: (appointmentId: string) => void;
  onUpdateStatus: (appointmentId: string, status: 'completed' | 'cancelled') => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  appointmentTasks,
  formatTime,
  onAddTask,
  onUpdateStatus
}) => {
  return (
    <Card className="bg-secondary/50 border-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-base font-medium">{appointment.reason}</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{formatTime(appointment.date)} Uhr</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm pt-2">
        <div className="flex items-center text-muted-foreground">
          <User className="mr-2 h-4 w-4 shrink-0" />
          <span>{appointment.customer}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <MapPin className="mr-2 h-4 w-4 shrink-0" />
          <span>{appointment.address}</span>
        </div>

        {appointmentTasks.length > 0 && (
          <div className="pt-3 mt-3 border-t border-background/50">
            <h4 className="flex items-center text-sm font-medium mb-2 text-foreground">
              <ListTodo className="mr-2 h-4 w-4" />
              Zugehörige Aufgaben
            </h4>
            <ul className="space-y-1.5 pl-1">
              {appointmentTasks.map(task => (
                <li key={task.id} className="flex items-center text-muted-foreground">
                  {task.completed ? 
                    <CheckSquare className="mr-2 h-4 w-4 text-primary shrink-0" /> : 
                    <Square className="mr-2 h-4 w-4 shrink-0" />
                  }
                  <span className={cn(task.completed && "line-through")}>{task.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-4 pb-4 pr-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddTask(appointment.id)}
        >
          <FolderPlus className="mr-2 h-4 w-4" />
          Aufgabe
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onUpdateStatus(appointment.id, 'cancelled')}
        >
          Stornieren
        </Button>
        <Button 
          size="sm"
          onClick={() => onUpdateStatus(appointment.id, 'completed')}
        >
          Abschließen
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppointmentCard;
