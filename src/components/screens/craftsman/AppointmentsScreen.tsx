
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Clock, MapPin, User, Plus, ListTodo, CheckSquare, Square, FolderPlus } from 'lucide-react';
import { useAppointments, type Appointment } from '@/hooks/useAppointments';
import NewAppointmentDialog from '@/components/appointments/NewAppointmentDialog';
import { useTasks } from '@/hooks/useTasks';
import NewTaskForAppointmentDialog from '@/components/appointments/NewTaskForAppointmentDialog';
import { cn } from '@/lib/utils';

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

    const upcomingAppointments = appointments
      .filter(a => a.status === 'upcoming' && new Date(a.date) >= new Date('2025-06-15')) // Show only future or today's appointments
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const groupedAppointments = upcomingAppointments.reduce((acc, appointment) => {
        const date = formatDate(appointment.date);
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(appointment);
        return acc;
    }, {} as Record<string, Appointment[]>);

    return (
        <>
            <div className="p-4 flex-grow overflow-y-auto">
                <div className="flex justify-end items-center gap-2 mb-6">
                    <Button onClick={() => setIsNewAppointmentDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Neuer Termin
                    </Button>
                </div>
                
                {Object.keys(groupedAppointments).length > 0 ? (
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
                                        <Card key={appointment.id} className="bg-secondary/50 border-none">
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
                                                                    {task.completed ? <CheckSquare className="mr-2 h-4 w-4 text-primary shrink-0" /> : <Square className="mr-2 h-4 w-4 shrink-0" />}
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
                                                    onClick={() => setAppointmentIdForNewTask(appointment.id)}
                                                >
                                                    <FolderPlus className="mr-2 h-4 w-4" />
                                                    Aufgabe
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                                >
                                                    Stornieren
                                                </Button>
                                                <Button 
                                                    size="sm"
                                                    onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                                >
                                                    Abschließen
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    )})}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                        <p>Keine anstehenden Termine.</p>
                    </div>
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
        </>
    );
};

export default AppointmentsScreen;
