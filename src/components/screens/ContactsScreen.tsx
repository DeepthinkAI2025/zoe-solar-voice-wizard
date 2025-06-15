
import React, { useState, useEffect } from 'react';
import CallScreen from '@/components/CallScreen';
import { User, Phone, Bot, Search, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContactEditor } from '@/components/ContactEditor';
import type { Contact } from '@/hooks/useContactManagement';
import { Badge } from '@/components/ui/badge';

interface ContactsScreenProps {
  onStartCall: (number: string) => void;
  onStartCallManually: (number: string) => void;
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (contact: Contact) => void;
  deleteContact: (contactId: string) => void;
  contactToEditId?: string | null;
  onEditorClose: () => void;
}

const ContactsScreen: React.FC<ContactsScreenProps> = ({ 
  onStartCall, 
  onStartCallManually,
  contacts,
  addContact,
  updateContact,
  deleteContact,
  contactToEditId,
  onEditorClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (contactToEditId) {
      const contact = contacts.find(c => c.id === contactToEditId);
      if (contact) {
        setEditingContact(contact);
        setIsCreating(false);
      }
    }
  }, [contactToEditId, contacts]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveContact = (contactData: Contact | Omit<Contact, 'id'>) => {
    if ('id' in contactData) {
      updateContact(contactData);
    } else {
      addContact(contactData);
    }
    handleCloseEditor();
  };

  const handleDeleteContact = (contactId: string) => {
    deleteContact(contactId);
    handleCloseEditor();
  };

  const handleCloseEditor = () => {
    setEditingContact(null);
    setIsCreating(false);
    onEditorClose();
  }

  const handleOpenCreator = () => {
    setEditingContact(null);
    setIsCreating(true);
  }

  const handleOpenEditor = (contact: Contact) => {
    setIsCreating(false);
    setEditingContact(contact);
  }

  return (
    <>
      <CallScreen title="Kontakte">
        <div className="flex items-center gap-4 px-4 pb-2">
          <div className="relative flex-grow">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/20 border-white/20 placeholder:text-muted-foreground pl-10"
              inputMode="search"
            />
          </div>
          <Button size="icon" className="flex-shrink-0" onClick={handleOpenCreator}>
            <PlusCircle size={20} />
          </Button>
        </div>
         {filteredContacts.map((contact) => (
           <div key={contact.id} className="flex items-center text-left p-3 rounded-lg hover:bg-white/10 cursor-pointer" onClick={() => handleOpenEditor(contact)}>
              <div className="flex-grow flex items-center">
                  <User size={20} className="mr-4 text-muted-foreground flex-shrink-0"/>
                  <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold">{contact.name}</p>
                        {contact.category && <Badge variant="outline" className="border-primary text-primary capitalize">{contact.category}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{contact.number}</p>
                  </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" className="w-10 h-10" onClick={(e) => { e.stopPropagation(); onStartCallManually(contact.number); }}>
                  <Phone size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="w-10 h-10" onClick={(e) => { e.stopPropagation(); onStartCall(contact.number); }}>
                  <Bot size={18} />
                </Button>
              </div>
           </div>
         ))}
      </CallScreen>
      {(isCreating || !!editingContact) && (
        <ContactEditor 
          contact={editingContact ?? undefined}
          onSave={handleSaveContact}
          onClose={handleCloseEditor}
          onDelete={handleDeleteContact}
        />
      )}
    </>
  );
};

export default ContactsScreen;
