
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import type { Appointment } from '@/hooks/useAppointments';

const formSchema = z.object({
  customer: z.string().min(2, { message: 'Name muss mindestens 2 Zeichen lang sein.' }),
  address: z.string().min(5, { message: 'Adresse muss mindestens 5 Zeichen lang sein.' }),
  reason: z.string().min(3, { message: 'Grund muss mindestens 3 Zeichen lang sein.' }),
  date: z.date({ required_error: 'Ein Datum ist erforderlich.' }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Ungültige Uhrzeit (HH:MM).' }),
});

type NewAppointmentDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAppointment: (data: Omit<Appointment, 'id' | 'status'>) => void;
};

const NewAppointmentDialog: React.FC<NewAppointmentDialogProps> = ({ isOpen, onOpenChange, onAddAppointment }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: '',
      address: '',
      reason: '',
      time: '09:00',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const [hours, minutes] = values.time.split(':').map(Number);
    const combinedDateTime = new Date(values.date);
    combinedDateTime.setHours(hours);
    combinedDateTime.setMinutes(minutes);

    onAddAppointment({
      customer: values.customer,
      address: values.address,
      reason: values.reason,
      date: combinedDateTime.toISOString(),
    });
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neuen Termin erstellen</DialogTitle>
          <DialogDescription>
            Füllen Sie die Details aus, um einen neuen Termin anzulegen.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kunde</FormLabel>
                  <FormControl>
                    <Input placeholder="Max Mustermann" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Musterstraße 1, 12345 Musterstadt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grund</FormLabel>
                  <FormControl>
                    <Input placeholder="Heizungswartung" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Datum</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, 'PPP', { locale: de }) : <span>Datum wählen</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={de}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uhrzeit</FormLabel>
                     <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="time" className="pl-10" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Termin speichern</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewAppointmentDialog;
