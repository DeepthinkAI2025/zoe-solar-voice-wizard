
import React, { useState } from 'react';
import CallScreen from '@/components/CallScreen';
import { contacts } from '@/data/mock';
import { User, Phone, Bot, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ContactsScreenProps {
  onStartCall: (number: string) => void;
  onStartCallManually: (number: string) => void;
}

const ContactsScreen: React.FC<ContactsScreenProps> = ({ onStartCall, onStartCallManually }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CallScreen title="Kontakte">
      <div className="px-4 pb-2">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/20 border-white/20 placeholder:text-muted-foreground pl-10"
          />
        </div>
      </div>
       {filteredContacts.map((contact, i) => (
         <div key={i} className="flex items-center text-left p-3 rounded-lg bg-white/5">
            <div className="flex-grow flex items-center">
                <User size={20} className="mr-4 text-muted-foreground flex-shrink-0"/>
                <div className="flex-grow">
                    <p className="text-white font-semibold">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.number}</p>
                </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button variant="ghost" size="icon" className="w-10 h-10" onClick={() => onStartCallManually(contact.number)}>
                <Phone size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="w-10 h-10" onClick={() => onStartCall(contact.number)}>
                <Bot size={18} />
              </Button>
            </div>
         </div>
       ))}
    </CallScreen>
  );
};

export default ContactsScreen;
