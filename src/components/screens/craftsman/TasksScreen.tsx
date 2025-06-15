import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from 'framer-motion';
import { Button, buttonVariants } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from 'lucide-react';

const initialTasks: {id: number, text: string, priority: 'high' | 'medium' | 'low', completed: boolean}[] = [
    { id: 1, text: 'Material für Baustelle "Musterfrau" bestellen', priority: 'high', completed: false },
    { id: 2, text: 'Angebot für "John Doe" erstellen', priority: 'medium', completed: false },
    { id: 3, text: 'Rechnung für "Peter Pan" schreiben', priority: 'low', completed: true },
    { id: 4, text: 'Werkzeug warten', priority: 'medium', completed: false },
];

const getPriorityBadgeInfo = (priority: 'high' | 'medium' | 'low'): { variant: 'destructive' | 'default' | 'secondary', label: string } => {
  switch (priority) {
    case 'high':
      return { variant: 'destructive', label: 'Hoch' };
    case 'medium':
      return { variant: 'default', label: 'Mittel' };
    case 'low':
      return { variant: 'secondary', label: 'Niedrig' };
  }
};

const TasksScreen = () => {
  const [taskList, setTaskList] = useState(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setTaskList(
      taskList.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    const newTask = {
        id: Date.now(),
        text: newTaskText.trim(),
        priority: newTaskPriority,
        completed: false,
    };
    setTaskList(prevTasks => [newTask, ...prevTasks]);
    setIsDialogOpen(false);
    setNewTaskText('');
    setNewTaskPriority('medium');
  };
  
  const handleDeleteTask = () => {
    if (taskToDelete === null) return;
    setTaskList(prevTasks => prevTasks.filter(task => task.id !== taskToDelete));
    setTaskToDelete(null);
  };

  const openTasks = taskList.filter(t => !t.completed);
  const completedTasks = taskList.filter(t => t.completed);

  return (
    <>
      <div className="p-4 flex-grow overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">Aufgaben</h1>
                <p className="text-muted-foreground">Ihre persönliche To-Do-Liste.</p>
              </div>
              <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Neue Aufgabe
              </Button>
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
                                        <div className="flex items-center space-x-4 flex-grow">
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
                                        <div className="flex items-center gap-1">
                                            <Badge variant={badgeInfo.variant}>
                                                {badgeInfo.label}
                                            </Badge>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setTaskToDelete(task.id)}>
                                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </div>
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
                                        <div className="flex items-center space-x-4 flex-grow">
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
                                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setTaskToDelete(task.id)}>
                                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                                        </Button>
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Neue Aufgabe erstellen</DialogTitle>
            <DialogDescription>
              Fügen Sie eine neue Aufgabe zu Ihrer Liste hinzu. Klicken Sie auf Speichern, wenn Sie fertig sind.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-text" className="text-right">
                Aufgabe
              </Label>
              <Input
                id="task-text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="col-span-3"
                placeholder="z.B. Material bestellen"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priorität
              </Label>
              <Select value={newTaskPriority} onValueChange={(value) => setNewTaskPriority(value as 'high' | 'medium' | 'low')}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Priorität auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Hoch</SelectItem>
                  <SelectItem value="medium">Mittel</SelectItem>
                  <SelectItem value="low">Niedrig</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleAddTask}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={taskToDelete !== null} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Dadurch wird die Aufgabe dauerhaft gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className={buttonVariants({ variant: "destructive" })}>Löschen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TasksScreen;
