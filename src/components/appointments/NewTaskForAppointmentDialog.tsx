
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Task } from '@/hooks/useTasks';

const formSchema = z.object({
  text: z.string().min(2, { message: 'Aufgabe muss mindestens 2 Zeichen lang sein.' }),
  priority: z.enum(['low', 'medium', 'high']),
});

type NewTaskForAppointmentDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (text: string, priority: Task['priority'], appointmentId?: string) => void;
  appointmentId: string | null;
};

const NewTaskForAppointmentDialog: React.FC<NewTaskForAppointmentDialogProps> = ({ isOpen, onOpenChange, onAddTask, appointmentId }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      priority: 'medium',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!appointmentId) return;
    onAddTask(values.text, values.priority as Task['priority'], appointmentId);
    form.reset();
    onOpenChange(false);
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neue Aufgabe für Termin</DialogTitle>
          <DialogDescription>
            Fügen Sie eine neue Aufgabe für diesen Termin hinzu.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aufgabe</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Ersatzteile prüfen" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priorität</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Priorität wählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Niedrig</SelectItem>
                      <SelectItem value="medium">Mittel</SelectItem>
                      <SelectItem value="high">Hoch</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Aufgabe hinzufügen</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskForAppointmentDialog;
