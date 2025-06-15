
import React from 'react';
import CallScreen from '@/components/CallScreen';
import { contacts } from '@/data/mock';
import { User, Phone, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContactsScreenProps {
  onStartCall: (number: string) => void;
  onStartCallManually: (number: string) => void;
}

const ContactsScreen: React.FC<ContactsScreenProps> = ({ onStartCall, onStartCallManually }) => {
  return (
    <CallScreen title="Kontakte">
       {contacts.map((contact, i) => (
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
