
import React, { useState, useEffect } from 'react';
import CallScreen from '@/components/CallScreen';
import { User, Phone, Bot, Search, PhoneMissed, PhoneOutgoing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContactEditor } from '@/components/ContactEditor';
import type { Contact } from '@/hooks/useContactManagement';
import { Badge } from '@/components/ui/badge';
import type { CallHistoryItem } from '@/types/call';
import { contactCategoryLabels } from '@/hooks/useContactManagement';
import { ContactsListDialog } from '@/components/ContactsListDialog';

interface ContactsScreenProps {
  onStartCall: (number: string, context?: string) => void;
  onStartCallManually: (number: string) => void;
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (contact: Contact) => void;
  deleteContact: (contactId: string) => void;
  contactToEditId?: string | null;
  onEditorClose: () => void;
  callHistory: CallHistoryItem[];
  onCallSelect: (call: CallHistoryItem) => void;
  onSelectContact: (number: string) => void;
}

const ContactsScreen: React.FC<ContactsScreenProps> = ({ 
  onStartCall, 
  onStartCallManually,
  contacts,
  addContact,
  updateContact,
  deleteContact,
  contactToEditId,
  onEditorClose,
  callHistory,
  onCallSelect,
  onSelectContact
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isContactsListOpen, setIsContactsListOpen] = useState(false);

  useEffect(() => {
    if (contactToEditId) {
      const contact = contacts.find(c => c.id === contactToEditId);
      if (contact) {
        setEditingContact(contact);
        setIsCreating(false);
      }
    }
  }, [contactToEditId, contacts]);

  const filteredCallHistory = callHistory.filter(call =>
    call.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.number.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleOpenContacts = () => {
    setIsContactsListOpen(true);
  };
  
  const handleAddFromDialog = () => {
    handleOpenCreator();
  };

  const handleEditFromDialog = (contact: Contact) => {
    setEditingContact(contact);
    setIsCreating(false);
  };

  return (
    <>
      <CallScreen title="Anrufliste">
        <div className="flex items-center gap-4 px-4 pb-2">
          <div className="relative flex-grow">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-muted placeholder:text-muted-foreground pl-10"
              inputMode="search"
            />
          </div>
          <Button variant="outline" className="flex-shrink-0" onClick={handleOpenContacts}>
            Kontakte
          </Button>
        </div>
         {filteredCallHistory.map((call, i) => {
           // If call.number is 'Unbekannt', check if call.name can be used as a number.
           const numberToUse = call.number === 'Unbekannt' && call.name !== 'Unbekannt' && call.name !== 'Unbekannter Anrufer' 
             ? call.name 
             : call.number;
           
           const contact = contacts.find(c => c.number === numberToUse);
           const displayName = contact ? contact.name : numberToUse;
           const isKnownContact = !!contact;
           const canCallback = numberToUse !== 'Unbekannt' && numberToUse !== 'Unbekannter Anrufer';

           return (
             <div key={i} className="text-left p-3 rounded-lg bg-transparent transition-colors hover:bg-muted cursor-pointer" onClick={() => onCallSelect(call)}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                    {call.type === 'Eingehend' && <Phone size={20} className="text-green-400"/>}
                    {call.type === 'Verpasst' && <PhoneMissed size={20} className="text-red-400"/>}
                    {call.type.includes('Ausgehend') && <PhoneOutgoing size={20} className="text-blue-400"/>}
                </div>

                <div className="flex-grow">
                    <div className="flex items-center gap-2">
                        <p 
                          className={`font-semibold ${isKnownContact ? 'cursor-pointer hover:underline' : ''} text-foreground`}
                          onClick={(e) => {
                            if (isKnownContact && contact) {
                              e.stopPropagation();
                              onSelectContact(contact.number);
                            }
                          }}
                        >
                          {displayName}
                        </p>
                        {contact?.category && <Badge variant="outline" className="border-primary/50 text-primary/80 capitalize">{contactCategoryLabels[contact.category]}</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{call.time}</p>
                    {call.summary && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{call.summary}</p>
                    )}
                </div>

                  <div className="flex flex-col gap-0 flex-shrink-0 -my-1">
                    <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-primary/20" disabled={!canCallback} onClick={(e) => { e.stopPropagation(); onStartCallManually(numberToUse); }}>
                      <Phone size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-primary/20" disabled={!canCallback} onClick={(e) => { 
                        e.stopPropagation();
                        if (call.type === 'Verpasst') {
                          onStartCall(numberToUse, 'missed-call-callback');
                        } else {
                          onStartCall(numberToUse);
                        }
                    }}>
                      <Bot size={16} />
                    </Button>
                  </div>
              </div>
            </div>
           );
         })}
      </CallScreen>
      <ContactsListDialog
        contacts={contacts}
        open={isContactsListOpen}
        onOpenChange={setIsContactsListOpen}
        onAddContact={handleAddFromDialog}
        onEditContact={handleEditFromDialog}
      />
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
