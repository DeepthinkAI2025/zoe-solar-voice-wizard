
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import TaskItem from './TaskItem';
import type { Task } from '@/hooks/useTasks';

interface TaskListProps {
    tasks: Task[];
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit: (task: Task) => void;
    emptyMessage: string;
    onAddSubtask: (taskId: number, text: string) => void;
    onToggleSubtask: (taskId: number, subtaskId: number) => void;
    onDeleteSubtask: (taskId: number, subtaskId: number) => void;
}

const TaskList = ({ tasks, onToggle, onDelete, onEdit, emptyMessage, onAddSubtask, onToggleSubtask, onDeleteSubtask }: TaskListProps) => {
    return (
        <div className="space-y-3">
            <AnimatePresence>
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={onToggle}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            onAddSubtask={onAddSubtask}
                            onToggleSubtask={onToggleSubtask}
                            onDeleteSubtask={onDeleteSubtask}
                        />
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground pl-2">{emptyMessage}</p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TaskList;
