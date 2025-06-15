
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Task } from '@/hooks/useTasks';

interface NewTaskDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onAddTask: (text: string, priority: Task['priority']) => void;
    onUpdateTask: (id: number, text: string, priority: Task['priority']) => void;
    taskToEdit: Task | null;
}

const NewTaskDialog = ({ isOpen, onOpenChange, onAddTask, onUpdateTask, taskToEdit }: NewTaskDialogProps) => {
    const [taskText, setTaskText] = useState('');
    const [taskPriority, setTaskPriority] = useState<Task['priority']>('medium');

    const isEditing = taskToEdit !== null;

    useEffect(() => {
        if (isEditing) {
            setTaskText(taskToEdit.text);
            setTaskPriority(taskToEdit.priority);
        } else {
            setTaskText('');
            setTaskPriority('medium');
        }
    }, [taskToEdit, isEditing, isOpen]);


    const handleSave = () => {
        if (isEditing) {
            onUpdateTask(taskToEdit.id, taskText, taskPriority);
        } else {
            onAddTask(taskText, taskPriority);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Aufgabe bearbeiten' : 'Neue Aufgabe erstellen'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Ändern Sie die Details der Aufgabe.' : 'Fügen Sie eine neue Aufgabe zu Ihrer Liste hinzu. Klicken Sie auf Speichern, wenn Sie fertig sind.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="task-text" className="text-right">
                            Aufgabe
                        </Label>
                        <Input
                            id="task-text"
                            value={taskText}
                            onChange={(e) => setTaskText(e.target.value)}
                            className="col-span-3"
                            placeholder="z.B. Material bestellen"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="priority" className="text-right">
                            Priorität
                        </Label>
                        <Select value={taskPriority} onValueChange={(value) => setTaskPriority(value as Task['priority'])}>
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
                    <Button type="button" onClick={handleSave} disabled={!taskText.trim()}>{isEditing ? 'Änderungen speichern' : 'Speichern'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NewTaskDialog;
