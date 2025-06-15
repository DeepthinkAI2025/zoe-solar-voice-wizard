
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import TaskList from '@/components/tasks/TaskList';
import NewTaskDialog from '@/components/tasks/NewTaskDialog';
import DeleteTaskDialog from '@/components/tasks/DeleteTaskDialog';

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

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            setIsNewTaskDialogOpen(false);
            cancelEditingTask();
        }
    };

    return (
        <>
            <div className="p-4 flex-grow overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Aufgaben</h1>
                        <p className="text-muted-foreground">Ihre persönliche To-Do-Liste.</p>
                    </div>
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
        </>
    );
};

export default TasksScreen;
