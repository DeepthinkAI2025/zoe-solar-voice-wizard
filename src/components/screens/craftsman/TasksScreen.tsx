
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Bot } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import TaskList from '@/components/tasks/TaskList';
import NewTaskDialog from '@/components/tasks/NewTaskDialog';
import DeleteTaskDialog from '@/components/tasks/DeleteTaskDialog';
import AiTaskDialog from '@/components/tasks/AiTaskDialog';
import { useAppointments } from '@/hooks/useAppointments';

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

    const [isAiDialogOpen, setIsAiDialogOpen] = React.useState(false);

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
                    <Button onClick={() => setIsAiDialogOpen(true)} variant="outline">
                        <Bot className="mr-2 h-4 w-4" />
                        KI-Aufgaben
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

            <AiTaskDialog
                isOpen={isAiDialogOpen}
                onOpenChange={setIsAiDialogOpen}
                onTasksGenerated={handleTasksGenerated}
            />
        </>
    );
};

export default TasksScreen;
