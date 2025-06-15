import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

export type Subtask = {
    id: number;
    text: string;
    completed: boolean;
};

export type Task = {
    id: number;
    text: string;
    priority: 'high' | 'medium' | 'low';
    completed: boolean;
    subtasks?: Subtask[];
};

const initialTasks: Task[] = [
    { id: 1, text: 'Material für Baustelle "Musterfrau" bestellen', priority: 'high', completed: false, subtasks: [
        { id: 101, text: 'Holzbalken 10x10cm', completed: false },
        { id: 102, text: 'Schrauben 5x50mm', completed: true },
    ] },
    { id: 2, text: 'Angebot für "John Doe" erstellen', priority: 'medium', completed: false, subtasks: [] },
    { id: 3, text: 'Rechnung für "Peter Pan" schreiben', priority: 'low', completed: true, subtasks: [] },
    { id: 4, text: 'Werkzeug warten', priority: 'medium', completed: false, subtasks: [] },
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
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

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
            subtasks: [],
        };
        setTaskList(prevTasks => [newTask, ...prevTasks]);
        setIsNewTaskDialogOpen(false);
        toast({
            title: "Aufgabe hinzugefügt",
            description: `"${newTask.text}" wurde zur Liste hinzugefügt.`,
        });
    };

    const handleUpdateTask = (id: number, text: string, priority: Task['priority']) => {
        if (!text.trim()) return;
        setTaskList(prevTasks =>
            prevTasks.map(task =>
                task.id === id ? { ...task, text: text.trim(), priority } : task
            )
        );
        setTaskToEdit(null);
        toast({
            title: "Aufgabe aktualisiert",
            description: `"${text}" wurde erfolgreich geändert.`,
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

    const handleAddSubtask = (taskId: number, text: string) => {
        if (!text.trim()) return;
        const newSubtask: Subtask = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
        };
        setTaskList(prevTasks => prevTasks.map(task => 
            task.id === taskId 
            ? { ...task, subtasks: [...(task.subtasks || []), newSubtask] } 
            : task
        ));
        toast({
            title: "Unteraufgabe hinzugefügt",
            description: `"${newSubtask.text}" wurde hinzugefügt.`,
        });
    };

    const handleToggleSubtask = (taskId: number, subtaskId: number) => {
        let subtaskText = '';
        let subtaskCompleted = false;

        const newTaskList = taskList.map(task => {
            if (task.id === taskId) {
                const newSubtasks = task.subtasks?.map(st => {
                    if (st.id === subtaskId) {
                        subtaskText = st.text;
                        subtaskCompleted = !st.completed;
                        return { ...st, completed: !st.completed };
                    }
                    return st;
                });
                return { ...task, subtasks: newSubtasks };
            }
            return task;
        });
        setTaskList(newTaskList);

        if (subtaskText) {
            toast({
                title: `Unteraufgabe ${subtaskCompleted ? 'erledigt' : 'wieder geöffnet'}`,
                description: `"${subtaskText}" wurde aktualisiert.`,
            });
        }
    };

    const handleDeleteSubtask = (taskId: number, subtaskId: number) => {
        let subtaskText = '';
        setTaskList(prevTasks => prevTasks.map(task => {
            if (task.id === taskId) {
                const subtaskToDelete = task.subtasks?.find(st => st.id === subtaskId);
                if (subtaskToDelete) {
                    subtaskText = subtaskToDelete.text;
                }
                return { ...task, subtasks: task.subtasks?.filter(st => st.id !== subtaskId) };
            }
            return task;
        }));

        if (subtaskText) {
            toast({
                title: "Unteraufgabe gelöscht",
                description: `"${subtaskText}" wurde entfernt.`,
                variant: "destructive"
            });
        }
    };

    const startEditingTask = (task: Task) => {
        setTaskToEdit(task);
    };

    const cancelEditingTask = () => {
        setTaskToEdit(null);
    };
    
    const openTasks = taskList.filter(t => !t.completed);
    const completedTasks = taskList.filter(t => t.completed);

    return {
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
    };
};
