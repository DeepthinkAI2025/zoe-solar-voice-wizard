import React, { useState } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, User, X } from 'lucide-react';
import type { Contact } from '@/hooks/useContactManagement';

interface ContactsListDialogProps {
  contacts: Contact[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddContact: () => void;
  onEditContact: (contact: Contact) => void;
}

export const ContactsListDialog: React.FC<ContactsListDialogProps> = ({ 
    contacts,
    open,
    onOpenChange,
    onAddContact,
    onEditContact
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.length > 0 ? contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.number.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];
  
  const handleAdd = () => {
    onAddContact();
    onOpenChange(false);
  }

  const handleEdit = (contact: Contact) => {
    onEditContact(contact);
    onOpenChange(false);
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[80vh] flex flex-col bg-background border-border p-0 gap-0">
        <div className="flex items-center justify-between border-b p-4 flex-shrink-0">
          <Button size="icon" variant="outline" onClick={handleAdd}>
            <Plus size={18} />
          </Button>
          <h2 className="text-lg font-semibold leading-none tracking-tight">Kontakte</h2>
          {/* This is a placeholder to balance the + button, so the title remains centered.
              The actual close button is rendered by DialogContent by default. */}
          <div className="w-10 h-10" />
        </div>
        <div className="p-4 flex-shrink-0">
            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                type="text"
                placeholder="Kontakte durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/20 border-white/20 placeholder:text-muted-foreground pl-10"
                inputMode="search"
                />
            </div>
        </div>
        <div className="flex-grow overflow-y-auto px-4 pb-4 space-y-1">
            {filteredContacts.map(contact => (
                <div key={contact.id} className="text-left p-3 rounded-lg bg-white/5 transition-colors hover:bg-white/10 cursor-pointer flex items-center gap-3" onClick={() => handleEdit(contact)}>
                    <User size={20} className="text-muted-foreground flex-shrink-0" />
                    <div className="flex-grow">
                        <p className="text-white font-semibold">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.number}</p>
                    </div>
                </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
