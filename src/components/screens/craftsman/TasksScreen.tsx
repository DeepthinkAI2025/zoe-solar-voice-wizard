import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Bot, Send } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import TaskList from '@/components/tasks/TaskList';
import NewTaskDialog from '@/components/tasks/NewTaskDialog';
import DeleteTaskDialog from '@/components/tasks/DeleteTaskDialog';
import AiTaskDialog from '@/components/tasks/AiTaskDialog';
import { useAppointments } from '@/hooks/useAppointments';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAiChat } from '@/hooks/useAiChat';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';


const AiCommandSheet = ({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    const { getAiResponse } = useAiChat();
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
                <div className="flex-grow flex flex-col min-h-0">
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

const TasksScreen = () => {
    const {
        openTasks,
        completedTasks,
        isNewTaskDialogOpen,
        setIsNewTaskDialogOpen,
        taskToDelete,
        taskToEdit,
        handleToggle,
        handleAddTask,
        handleUpdateTask,
        handleDeleteTask,
        confirmDeleteTask,
        cancelDeleteTask,
        startEditingTask,
        cancelEditingTask,
        handleAddSubtask,
        handleToggleSubtask,
        handleDeleteSubtask,
    } = useTasks();
    const { appointments } = useAppointments();

    const [isAiSheetOpen, setIsAiSheetOpen] = React.useState(false);

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            setIsNewTaskDialogOpen(false);
            cancelEditingTask();
        }
    };

    const handleTasksGenerated = (tasks: Array<{ text: string; priority: 'high' | 'medium' | 'low' }>) => {
        tasks.forEach(task => {
            handleAddTask(task.text, task.priority);
        });
    };

    return (
        <>
            <div className="p-4 flex-grow overflow-y-auto">
                <div className="flex justify-end items-center gap-2 mb-6">
                    <Button onClick={() => setIsAiSheetOpen(true)} variant="outline">
                        <Bot className="mr-2 h-4 w-4" />
                        KI-Assistentin
                    </Button>
                    <Button onClick={() => setIsNewTaskDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Neue Aufgabe
                    </Button>
                </div>

                <div className="space-y-4">
                    <div>
                        <h2 className="font-semibold text-lg mb-3">Offen</h2>
                        <TaskList
                            tasks={openTasks}
                            onToggle={handleToggle}
                            onDelete={confirmDeleteTask}
                            onEdit={startEditingTask}
                            emptyMessage="Super! Keine offenen Aufgaben."
                            onAddSubtask={handleAddSubtask}
                            onToggleSubtask={handleToggleSubtask}
                            onDeleteSubtask={handleDeleteSubtask}
                            appointments={appointments}
                        />
                    </div>
                    
                    {completedTasks.length > 0 && (
                        <div className="pt-4">
                            <h2 className="font-semibold text-lg mb-3">Erledigt</h2>
                            <TaskList
                                tasks={completedTasks}
                                onToggle={handleToggle}
                                onDelete={confirmDeleteTask}
                                onEdit={startEditingTask}
                                emptyMessage=""
                                onAddSubtask={handleAddSubtask}
                                onToggleSubtask={handleToggleSubtask}
                                onDeleteSubtask={handleDeleteSubtask}
                                appointments={appointments}
                            />
                        </div>
                    )}
                </div>
            </div>
            
            <NewTaskDialog 
                isOpen={isNewTaskDialogOpen || !!taskToEdit}
                onOpenChange={handleDialogClose}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                taskToEdit={taskToEdit}
            />

            <DeleteTaskDialog
                isOpen={taskToDelete !== null}
                onCancel={cancelDeleteTask}
                onConfirm={handleDeleteTask}
            />

            {/* The old AiTaskDialog is no longer opened by the button, but we leave it here to avoid breaking imports. */}
            <AiTaskDialog
                isOpen={false}
                onOpenChange={() => {}}
                onTasksGenerated={handleTasksGenerated}
            />
            <AiCommandSheet isOpen={isAiSheetOpen} onOpenChange={setIsAiSheetOpen} />
        </>
    );
};

export default TasksScreen;
