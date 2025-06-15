import React from 'react';
import { toast } from "@/components/ui/use-toast";
import type { Task } from '@/types/task';

type SetTaskList = React.Dispatch<React.SetStateAction<Task[]>>;
type SetIsNewTaskDialogOpen = React.Dispatch<React.SetStateAction<boolean>>;
type SetTaskToEdit = React.Dispatch<React.SetStateAction<Task | null>>;
type SetTaskToDelete = React.Dispatch<React.SetStateAction<number | null>>;

export const toggleTask = (setTaskList: SetTaskList, taskList: Readonly<Task[]>, id: number) => {
    const task = taskList.find(t => t.id === id);
    if (!task) return;

    setTaskList(
        currentTasks => currentTasks.map(t =>
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

export const addTask = (
    setTaskList: SetTaskList, 
    setIsNewTaskDialogOpen: SetIsNewTaskDialogOpen, 
    text: string, 
    priority: Task['priority'], 
    appointmentId?: string
) => {
    if (!text.trim()) return;
    const newTask: Task = {
        id: Date.now(),
        text: text.trim(),
        priority: priority,
        completed: false,
        subtasks: [],
        appointmentId,
        createdAt: new Date().toISOString(),
    };
    setTaskList(prevTasks => [newTask, ...prevTasks]);
    setIsNewTaskDialogOpen(false);
    toast({
        title: "Aufgabe hinzugefügt",
        description: `"${newTask.text}" wurde zur Liste hinzugefügt.`,
    });
};

export const updateTask = (
    setTaskList: SetTaskList, 
    setTaskToEdit: SetTaskToEdit, 
    id: number, 
    text: string, 
    priority: Task['priority']
) => {
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

export const deleteTask = (
    setTaskList: SetTaskList, 
    taskList: Readonly<Task[]>, 
    taskToDelete: number, 
    setTaskToDelete: SetTaskToDelete
) => {
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
