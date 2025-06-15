import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { contactCategories, type Contact } from '@/hooks/useContactManagement';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name muss mindestens 2 Zeichen lang sein.' }),
  number: z.string().min(5, { message: 'Nummer muss mindestens 5 Zeichen lang sein.' }),
  category: z.enum(contactCategories).optional(),
});

interface ContactEditorProps {
  contact: Contact | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (contact: Contact | Omit<Contact, 'id'>) => void;
  onDelete?: (contactId: string) => void;
}

export const ContactEditor: React.FC<ContactEditorProps> = ({ contact, isOpen, onOpenChange, onSave, onDelete }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      number: '',
      category: undefined,
    },
  });

  useEffect(() => {
    if (contact) {
      form.reset({
        name: contact.name,
        number: contact.number,
        category: contact.category,
      });
    } else {
      form.reset({
        name: '',
        number: '',
        category: undefined,
      });
    }
  }, [contact, form, isOpen]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (contact) {
      onSave({ ...contact, ...values });
    } else {
      onSave(values);
    }
    onOpenChange(false);
  };
  
  const handleDelete = () => {
    if (contact && onDelete) {
        onDelete(contact.id);
        onOpenChange(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{contact ? 'Kontakt bearbeiten' : 'Neuer Kontakt'}</DialogTitle>
          <DialogDescription>
            {contact ? 'Bearbeiten Sie die Kontaktdetails.' : 'Fügen Sie einen neuen Kontakt hinzu.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Max Mustermann" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefonnummer</FormLabel>
                  <FormControl>
                    <Input placeholder="+49 123 456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategorie</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategorie auswählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contactCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4 sm:justify-between">
              <div>
                {contact && onDelete && (
                   <Button type="button" variant="destructive" onClick={handleDelete}>Löschen</Button>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Abbrechen</Button>
                <Button type="submit">Speichern</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
