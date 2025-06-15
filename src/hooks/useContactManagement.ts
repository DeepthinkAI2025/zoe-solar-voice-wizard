
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { contacts as initialContacts } from '@/data/mock';
// No Contact import from mock, as it's defined here now.

export const categories = ["partner", "mitarbeiter", "kunde", "händler", "werbung", "privat", "sonstige"] as const;
export type Category = typeof categories[number];

export const contactCategoryLabels: Record<Category, string> = {
  partner: 'Partner',
  mitarbeiter: 'Mitarbeiter',
  kunde: 'Kunde',
  händler: 'Händler',
  werbung: 'Werbung',
  privat: 'Privat',
  sonstige: 'Sonstige',
};

export type Contact = {
  id: string;
  name:string;
  number: string;
  category: Category;
};

export const useContactManagement = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts.map(c => ({...c, category: c.category || 'kunde' })));
  const { toast } = useToast();

  const addContact = (newContact: Omit<Contact, 'id'>) => {
    const contactWithId = { ...newContact, id: `contact-${Date.now()}` };
    setContacts(prev => [...prev, contactWithId]);
    toast({
      title: 'Kontakt hinzugefügt',
      description: `${newContact.name} wurde erfolgreich zu Ihren Kontakten hinzugefügt.`,
    });
  };

  const updateContact = (updatedContact: Contact) => {
    setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
    toast({
      title: 'Kontakt aktualisiert',
      description: `${updatedContact.name} wurde erfolgreich aktualisiert.`,
    });
  };

  const deleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
    toast({
      title: 'Kontakt gelöscht',
    });
  };

  return {
    contacts,
    addContact,
    updateContact,
    deleteContact
  };
};

