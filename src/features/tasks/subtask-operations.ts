
import React from 'react';
import { toast } from "@/components/ui/use-toast";
import type { Task, Subtask } from '@/types/task';

type SetTaskList = React.Dispatch<React.SetStateAction<Task[]>>;

export const addSubtask = (setTaskList: SetTaskList, taskId: number, text: string) => {
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

export const toggleSubtask = (setTaskList: SetTaskList, taskId: number, subtaskId: number) => {
    let subtaskText = '';
    let subtaskCompleted = false;

    setTaskList(prevTasks => {
        return prevTasks.map(task => {
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
    });
    
    if (subtaskText) {
        toast({
            title: `Unteraufgabe ${subtaskCompleted ? 'erledigt' : 'wieder geöffnet'}`,
            description: `"${subtaskText}" wurde aktualisiert.`,
        });
    }
};

export const deleteSubtask = (setTaskList: SetTaskList, taskId: number, subtaskId: number) => {
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
