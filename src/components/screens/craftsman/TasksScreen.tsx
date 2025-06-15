import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from 'framer-motion';

const initialTasks: {id: number, text: string, priority: 'high' | 'medium' | 'low', completed: boolean}[] = [
    { id: 1, text: 'Material für Baustelle "Musterfrau" bestellen', priority: 'high', completed: false },
    { id: 2, text: 'Angebot für "John Doe" erstellen', priority: 'medium', completed: false },
    { id: 3, text: 'Rechnung für "Peter Pan" schreiben', priority: 'low', completed: true },
    { id: 4, text: 'Werkzeug warten', priority: 'medium', completed: false },
];

const getPriorityBadgeInfo = (priority: 'high' | 'medium' | 'low'): { variant: 'destructive' | 'default' | 'secondary' | 'outline', label: string } => {
  switch (priority) {
    case 'high':
      return { variant: 'destructive', label: 'Hoch' };
    case 'medium':
      return { variant: 'default', label: 'Mittel' };
    case 'low':
      return { variant: 'secondary', label: 'Niedrig' };
    default:
      return { variant: 'outline', label: 'Unbekannt' };
  }
};

const TasksScreen = () => {
  const [taskList, setTaskList] = useState(initialTasks);

  const handleToggle = (id: number) => {
    setTaskList(
      taskList.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const openTasks = taskList.filter(t => !t.completed);
  const completedTasks = taskList.filter(t => t.completed);

  return (
    <div className="p-4 flex-grow overflow-y-auto">
        <div className="mb-6">
            <h1 className="text-2xl font-bold">Aufgaben</h1>
            <p className="text-muted-foreground">Ihre persönliche To-Do-Liste.</p>
        </div>

        <div className="space-y-4">
            <div>
                <h2 className="font-semibold text-lg mb-3">Offen</h2>
                <div className="space-y-3">
                     <AnimatePresence>
                        {openTasks.length > 0 ? openTasks.map(task => {
                            const badgeInfo = getPriorityBadgeInfo(task.priority);
                            return (
                                <motion.div
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                >
                                    <Card className="bg-secondary/50 border-none">
                                        <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <Checkbox
                                            id={`task-${task.id}`}
                                            checked={task.completed}
                                            onCheckedChange={() => handleToggle(task.id)}
                                            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                            />
                                            <label
                                            htmlFor={`task-${task.id}`}
                                            className={`text-sm font-medium leading-none`}
                                            >
                                            {task.text}
                                            </label>
                                        </div>
                                        <Badge variant={badgeInfo.variant}>
                                            {badgeInfo.label}
                                        </Badge>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        }) : <p className="text-sm text-muted-foreground pl-2">Super! Keine offenen Aufgaben.</p>}
                    </AnimatePresence>
                </div>
            </div>
            
            {completedTasks.length > 0 && (
                <div className="pt-4">
                    <h2 className="font-semibold text-lg mb-3">Erledigt</h2>
                     <div className="space-y-3">
                         <AnimatePresence>
                            {completedTasks.map(task => (
                                <motion.div
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Card className="bg-background/50 border-none">
                                        <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <Checkbox
                                            id={`task-${task.id}`}
                                            checked={task.completed}
                                            onCheckedChange={() => handleToggle(task.id)}
                                            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                            />
                                            <label
                                            htmlFor={`task-${task.id}`}
                                            className={`text-sm font-medium leading-none line-through text-muted-foreground`}
                                            >
                                            {task.text}
                                            </label>
                                        </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default TasksScreen;
