import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { ChevronRight, PlusCircle, Trash2, Pencil } from 'lucide-react';
import type { Task } from '@/hooks/useTasks';
import { getPriorityBadgeInfo } from './utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Input } from '../ui/input';

interface TaskItemProps {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit: (task: Task) => void;
    onAddSubtask: (taskId: number, text: string) => void;
    onToggleSubtask: (taskId: number, subtaskId: number) => void;
    onDeleteSubtask: (taskId: number, subtaskId: number) => void;
}

const TaskItem = ({ task, onToggle, onDelete, onEdit, onAddSubtask, onToggleSubtask, onDeleteSubtask }: TaskItemProps) => {
    const badgeInfo = getPriorityBadgeInfo(task.priority);
    const [newSubtaskText, setNewSubtaskText] = useState('');

    const handleAddSubtask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSubtaskText.trim()) {
            onAddSubtask(task.id, newSubtaskText);
            setNewSubtaskText('');
        }
    };

    const subtaskProgress = task.subtasks && task.subtasks.length > 0 
        ? `(${task.subtasks.filter(st => st.completed).length}/${task.subtasks.length})` 
        : '';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
        >
            <Card className={task.completed ? "bg-background/50 border-none" : "bg-secondary/50 border-none"}>
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-grow">
                        <Checkbox
                            id={`task-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={() => onToggle(task.id)}
                            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                        <label
                            htmlFor={`task-${task.id}`}
                            className={`text-sm font-medium leading-none ${task.completed ? 'line-through text-muted-foreground' : ''} cursor-pointer`}
                        >
                            {task.text}
                        </label>
                    </div>
                    <div className="flex items-center gap-1">
                        {!task.completed && (
                            <Badge variant={badgeInfo.variant}>
                                {badgeInfo.label}
                            </Badge>
                        )}
                        {!task.completed && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => onEdit(task)}>
                                <Pencil className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => onDelete(task.id)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>
                </CardContent>

                <Collapsible>
                    <CollapsibleTrigger asChild>
                        <div className="flex items-center text-sm px-4 pb-3 cursor-pointer text-muted-foreground hover:text-foreground w-full">
                            <ChevronRight className="h-4 w-4 mr-1 transition-transform duration-200 [&[data-state=open]]:rotate-90" />
                            Unteraufgaben {subtaskProgress}
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4 space-y-2">
                        {task.subtasks?.map(subtask => (
                            <div key={subtask.id} className="flex items-center space-x-2 pl-6 animate-in fade-in-0 duration-300">
                                <Checkbox 
                                    id={`subtask-${subtask.id}`} 
                                    checked={subtask.completed} 
                                    onCheckedChange={() => onToggleSubtask(task.id, subtask.id)}
                                />
                                <label 
                                    htmlFor={`subtask-${subtask.id}`} 
                                    className={`flex-grow text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''} cursor-pointer`}
                                >
                                    {subtask.text}
                                </label>
                                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => onDeleteSubtask(task.id, subtask.id)}>
                                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                                </Button>
                            </div>
                        ))}
                         {!task.completed && (
                            <form onSubmit={handleAddSubtask} className="flex items-center space-x-2 pl-6 pt-2">
                                <Input 
                                    value={newSubtaskText}
                                    onChange={(e) => setNewSubtaskText(e.target.value)}
                                    placeholder="Neue Unteraufgabe..."
                                    className="h-8"
                                />
                                <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 shrink-0" disabled={!newSubtaskText.trim()}>
                                    <PlusCircle className="h-4 w-4" />
                                </Button>
                            </form>
                        )}
                    </CollapsibleContent>
                </Collapsible>
            </Card>
        </motion.div>
    );
};

export default TaskItem;
