
import { useState, useEffect, useMemo, useCallback } from 'react';
import { initialTasks } from '@/data/tasks';
import type { Task } from '@/types/task';
import * as taskOps from '@/features/tasks/task-operations';
import * as subtaskOps from '@/features/tasks/subtask-operations';

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

    // Task Operations
    const handleToggle = useCallback((id: number) => {
        taskOps.toggleTask(setTaskList, taskList, id);
    }, [taskList]);

    const handleAddTask = useCallback((text: string, priority: Task['priority'], appointmentId?: string) => {
        taskOps.addTask(setTaskList, setIsNewTaskDialogOpen, text, priority, appointmentId);
    }, []);

    const handleUpdateTask = useCallback((id: number, text: string, priority: Task['priority']) => {
        taskOps.updateTask(setTaskList, setTaskToEdit, id, text, priority);
    }, []);

    const handleDeleteTask = useCallback(() => {
        if (taskToDelete === null) return;
        taskOps.deleteTask(setTaskList, taskList, taskToDelete, setTaskToDelete);
    }, [taskList, taskToDelete]);

    // Subtask Operations
    const handleAddSubtask = useCallback((taskId: number, text: string) => {
        subtaskOps.addSubtask(setTaskList, taskId, text);
    }, []);

    const handleToggleSubtask = useCallback((taskId: number, subtaskId: number) => {
        subtaskOps.toggleSubtask(setTaskList, taskId, subtaskId);
    }, []);
    
    const handleDeleteSubtask = useCallback((taskId: number, subtaskId: number) => {
        subtaskOps.deleteSubtask(setTaskList, taskId, subtaskId);
    }, []);

    // Dialog and Editing Controls
    const confirmDeleteTask = useCallback((id: number) => {
        setTaskToDelete(id);
    }, []);
    
    const cancelDeleteTask = useCallback(() => {
        setTaskToDelete(null);
    }, []);

    const startEditingTask = useCallback((task: Task) => {
        setTaskToEdit(task);
    }, []);

    const cancelEditingTask = useCallback(() => {
        setTaskToEdit(null);
    }, []);
    
    const openTasks = useMemo(() => taskList.filter(t => !t.completed), [taskList]);
    const completedTasks = useMemo(() => taskList.filter(t => t.completed), [taskList]);

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
