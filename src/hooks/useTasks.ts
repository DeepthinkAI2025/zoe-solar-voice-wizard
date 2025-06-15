
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

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
    const [taskList, setTaskList] = useState<Task[]>(() => {
        try {
            const savedTasks = localStorage.getItem('tasks');
            return savedTasks ? JSON.parse(savedTasks) : initialTasks;
        } catch (error) {
            console.error("Konnte Aufgaben nicht aus dem Local Storage laden:", error);
            return initialTasks;
        }
    });
    
    useEffect(() => {
        try {
            localStorage.setItem('tasks', JSON.stringify(taskList));
        } catch (error) {
            console.error("Konnte Aufgaben nicht im Local Storage speichern:", error);
        }
    }, [taskList]);

    const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

    const handleToggle = (id: number) => {
        const task = taskList.find(t => t.id === id);
        if (!task) return;

        setTaskList(
            taskList.map(t =>
                t.id === id ? { ...t, completed: !t.completed } : t
            )
        );

        if (task.completed) {
            toast({
                title: "Aufgabe wieder geöffnet",
                description: `"${task.text}" ist jetzt wieder offen.`,
            });
        } else {
            toast({
                title: "Aufgabe erledigt!",
                description: `"${task.text}" wurde als erledigt markiert.`,
            });
        }
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
        toast({
            title: "Aufgabe hinzugefügt",
            description: `"${newTask.text}" wurde zur Liste hinzugefügt.`,
        });
    };

    const confirmDeleteTask = (id: number) => {
        setTaskToDelete(id);
    }
    
    const cancelDeleteTask = () => {
        setTaskToDelete(null);
    }

    const handleDeleteTask = () => {
        if (taskToDelete === null) return;
        const task = taskList.find(t => t.id === taskToDelete);

        setTaskList(prevTasks => prevTasks.filter(task => task.id !== taskToDelete));
        setTaskToDelete(null);

        if (task) {
            toast({
                title: "Aufgabe gelöscht",
                description: `"${task.text}" wurde entfernt.`,
                variant: "destructive"
            });
        }
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
