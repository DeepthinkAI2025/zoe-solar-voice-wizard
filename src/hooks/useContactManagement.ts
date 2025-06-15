
import { useState } from 'react';
import { contacts as initialContactsData } from '@/data/mock';
import { toast } from "sonner"

export interface Contact {
  id: string;
  name: string;
  number: string;
}

const initialContacts: Contact[] = initialContactsData.map((c, i) => ({
  name: c.name,
  number: c.number,
  id: `mock-contact-${i}`,
}));

export const useContactManagement = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);

  const addContact = (contact: Omit<Contact, 'id'>) => {
    const newContact = { ...contact, id: `contact-${Date.now()}` };
    setContacts(prev => [...prev, newContact].sort((a, b) => a.name.localeCompare(b.name)));
    toast.success("Kontakt hinzugefügt");
  };

  const updateContact = (updatedContact: Contact) => {
    setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c).sort((a, b) => a.name.localeCompare(b.name)));
    toast.success("Kontakt aktualisiert");
  };

  const deleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
    toast.success("Kontakt gelöscht");
  };

  return { contacts, addContact, updateContact, deleteContact };
};
