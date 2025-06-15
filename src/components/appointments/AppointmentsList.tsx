
import React from 'react';
import AppointmentCard from './AppointmentCard';
import type { Appointment } from '@/hooks/useAppointments';
import type { Task } from '@/types/task';

interface AppointmentsListProps {
  groupedAppointments: Record<string, Appointment[]>;
  allTasks: Task[];
  formatTime: (dateString: string) => string;
  onAddTask: (appointmentId: string) => void;
  onUpdateStatus: (appointmentId: string, status: 'completed' | 'cancelled') => void;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({
  groupedAppointments,
  allTasks,
  formatTime,
  onAddTask,
  onUpdateStatus
}) => {
  if (Object.keys(groupedAppointments).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
        <p>Keine anstehenden Termine.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedAppointments).map(([date, appointmentsForDay]) => (
        <div key={date}>
          <h2 className="font-semibold mb-3 text-lg">{date}</h2>
          <div className="space-y-4">
            {appointmentsForDay.map((appointment) => {
              const appointmentTasks = allTasks.filter(
                (task) => task.appointmentId === appointment.id
              );
              
              return (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  appointmentTasks={appointmentTasks}
                  formatTime={formatTime}
                  onAddTask={onAddTask}
                  onUpdateStatus={onUpdateStatus}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentsList;
