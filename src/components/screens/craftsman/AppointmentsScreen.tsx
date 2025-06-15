import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Clock, MapPin, User, Plus, ListTodo, CheckSquare, Square, FolderPlus, Bot, Send, Calendar, List } from 'lucide-react';
import { useAppointments, type Appointment } from '@/hooks/useAppointments';
import NewAppointmentDialog from '@/components/appointments/NewAppointmentDialog';
import CalendarView from '@/components/appointments/CalendarView';
import { useTasks } from '@/hooks/useTasks';
import NewTaskForAppointmentDialog from '@/components/appointments/NewTaskForAppointmentDialog';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAiChat } from '@/hooks/useAiChat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

const AiCommandSheet = ({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    const { getAiResponse, hasApiKey } = useAiChat();
    const [messages, setMessages] = useState<{ id: number, text: string, sender: 'user' | 'ai' }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const newMessages = [...messages, { id: Date.now(), text: input, sender: 'user' as const }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const aiResponse = await getAiResponse(newMessages, 'gemini');
        
        setIsLoading(false);

        if (aiResponse) {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResponse, sender: 'ai' as const }]);
        }
    };
    
    return (
         <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>KI-Assistentin</SheetTitle>
                    <SheetDescription>
                        Ich kann Aufgaben und Termine für dich verwalten. Was kann ich für dich tun?
                    </SheetDescription>
                </SheetHeader>
                <div className="flex-grow flex flex-col">
                    <ScrollArea className="flex-grow pr-4 -mr-6" ref={scrollAreaRef}>
                        <div className="space-y-4">
                            {messages.map(message => (
                                <div key={message.id} className={cn("flex items-end gap-2", message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                                    {message.sender === 'ai' && <Avatar className="h-8 w-8"><AvatarFallback>KI</AvatarFallback></Avatar>}
                                    <div className={cn("rounded-lg px-3 py-2 max-w-[80%]", message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-end gap-2 justify-start">
                                    <Avatar className="h-8 w-8"><AvatarFallback>KI</AvatarFallback></Avatar>
                                    <div className="rounded-lg px-3 py-2 bg-muted">
                                        <div className="flex items-center space-x-1">
                                            <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                            <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                            <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <div className="mt-4 flex items-center gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                            placeholder="z.B. Erstelle eine Aufgabe..."
                            disabled={isLoading}
                        />
                        <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                            <Send />
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
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
    const [viewMode, setViewMode<'list' | 'calendar'>>('list');
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

    return (
        <>
            <div className="px-4 py-2 flex-grow overflow-y-auto">
                <div className="flex justify-between items-center gap-2 mb-6">
                    <div className="flex gap-2">
                        <Button 
                            variant={viewMode === 'list' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="mr-2 h-4 w-4" />
                            Liste
                        </Button>
                        <Button 
                            variant={viewMode === 'calendar' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setViewMode('calendar')}
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            Kalender
                        </Button>
                    </div>
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
                    Object.keys(groupedAppointments).length > 0 ? (
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
             <AiCommandSheet isOpen={isAiSheetOpen} onOpenChange={setIsAiSheetOpen} />
        </>
    );
};

export default AppointmentsScreen;
