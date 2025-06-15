
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { Task } from '@/hooks/useTasks';
import { getPriorityBadgeInfo } from './utils';

interface TaskItemProps {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
    const badgeInfo = getPriorityBadgeInfo(task.priority);

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
                            className={`text-sm font-medium leading-none ${task.completed ? 'line-through text-muted-foreground' : ''}`}
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
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => onDelete(task.id)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default TaskItem;
