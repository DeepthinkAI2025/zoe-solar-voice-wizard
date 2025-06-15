
import { useState } from 'react';

export type Task = {
    id: number;
    text: string;
    priority: 'high' | 'medium' | 'low';
    completed: boolean;
};

const initialTasks: Task[] = [
    { id: 1, text: 'Material für Baustelle "Musterfrau" bestellen', priority: 'high', completed: false },
    { id: 2, text: 'Angebot für "John Doe" erstellen', priority: 'medium', completed: false },
    { id: 3, text: 'Rechnung für "Peter Pan" schreiben', priority: 'low', completed: true },
    { id: 4, text: 'Werkzeug warten', priority: 'medium', completed: false },
];

export const useTasks = () => {
    const [taskList, setTaskList] = useState(initialTasks);
    const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

    const handleToggle = (id: number) => {
        setTaskList(
            taskList.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const handleAddTask = (text: string, priority: Task['priority']) => {
        if (!text.trim()) return;
        const newTask: Task = {
            id: Date.now(),
            text: text.trim(),
            priority: priority,
            completed: false,
        };
        setTaskList(prevTasks => [newTask, ...prevTasks]);
        setIsNewTaskDialogOpen(false);
    };

    const confirmDeleteTask = (id: number) => {
        setTaskToDelete(id);
    }
    
    const cancelDeleteTask = () => {
        setTaskToDelete(null);
    }

    const handleDeleteTask = () => {
        if (taskToDelete === null) return;
        setTaskList(prevTasks => prevTasks.filter(task => task.id !== taskToDelete));
        setTaskToDelete(null);
    };
    
    const openTasks = taskList.filter(t => !t.completed);
    const completedTasks = taskList.filter(t => t.completed);

    return {
        openTasks,
        completedTasks,
        isNewTaskDialogOpen,
        setIsNewTaskDialogOpen,
        taskToDelete,
        handleToggle,
        handleAddTask,
        handleDeleteTask,
        confirmDeleteTask,
        cancelDeleteTask,
    };
};
