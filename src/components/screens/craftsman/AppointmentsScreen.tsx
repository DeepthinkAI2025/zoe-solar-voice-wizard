
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Bot } from 'lucide-react';
import { useAppointments, type Appointment } from '@/hooks/useAppointments';
import NewAppointmentDialog from '@/components/appointments/NewAppointmentDialog';
import CalendarView from '@/components/appointments/CalendarView';
import { useTasks } from '@/hooks/useTasks';
import NewTaskForAppointmentDialog from '@/components/appointments/NewTaskForAppointmentDialog';
import AiCommandSheet from '@/components/appointments/AiCommandSheet';
import AppointmentViewModeToggle from '@/components/appointments/AppointmentViewModeToggle';
import AppointmentsList from '@/components/appointments/AppointmentsList';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
};

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const AppointmentsScreen = () => {
    const { 
        appointments, 
        addAppointment, 
        updateAppointmentStatus,
        isNewAppointmentDialogOpen, 
        setIsNewAppointmentDialogOpen 
    } = useAppointments();
    const { openTasks, completedTasks, handleAddTask } = useTasks();
    const allTasks = [...openTasks, ...completedTasks];

    const [appointmentIdForNewTask, setAppointmentIdForNewTask] = useState<string | null>(null);
    const [isAiSheetOpen, setIsAiSheetOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const upcomingAppointments = appointments
      .filter(a => a.status === 'upcoming' && new Date(a.date) >= new Date('2025-06-15'))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const groupedAppointments = upcomingAppointments.reduce((acc, appointment) => {
        const date = formatDate(appointment.date);
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(appointment);
        return acc;
    }, {} as Record<string, Appointment[]>);

    const handleAppointmentClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
    };

    const handleAddTaskForAppointment = (appointmentId: string) => {
        setAppointmentIdForNewTask(appointmentId);
    };

    return (
        <>
            <div className="px-4 py-2 flex-grow overflow-y-auto">
                <div className="flex justify-between items-center gap-2 mb-6">
                    <AppointmentViewModeToggle 
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                    />
                    <div className="flex gap-2">
                        <Button onClick={() => setIsAiSheetOpen(true)} variant="outline">
                            <Bot className="mr-2 h-4 w-4" />
                            KI-Assistentin
                        </Button>
                        <Button onClick={() => setIsNewAppointmentDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Neuer Termin
                        </Button>
                    </div>
                </div>
                
                {viewMode === 'calendar' ? (
                    <CalendarView 
                        appointments={upcomingAppointments} 
                        onAppointmentClick={handleAppointmentClick}
                    />
                ) : (
                    <AppointmentsList
                        groupedAppointments={groupedAppointments}
                        allTasks={allTasks}
                        formatTime={formatTime}
                        onAddTask={handleAddTaskForAppointment}
                        onUpdateStatus={updateAppointmentStatus}
                    />
                )}
            </div>

            <NewAppointmentDialog
                isOpen={isNewAppointmentDialogOpen}
                onOpenChange={setIsNewAppointmentDialogOpen}
                onAddAppointment={addAppointment}
            />
            <NewTaskForAppointmentDialog
                isOpen={!!appointmentIdForNewTask}
                onOpenChange={(open) => !open && setAppointmentIdForNewTask(null)}
                onAddTask={handleAddTask}
                appointmentId={appointmentIdForNewTask}
            />
            <AiCommandSheet isOpen={isAiSheetOpen} onOpenChange={setIsAiSheetOpen} />
        </>
    );
};

export default AppointmentsScreen;
