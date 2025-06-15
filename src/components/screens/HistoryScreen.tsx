
import React from 'react';
import CallScreen from '@/components/CallScreen';
import { callHistory } from '@/data/mock';
import { Phone, PhoneMissed, PhoneOutgoing, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CallHistoryItem = typeof callHistory[0];

interface HistoryScreenProps {
  onCallSelect: (call: CallHistoryItem) => void;
  onStartCall: (number: string) => void;
  onStartCallManually: (number: string) => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ onCallSelect, onStartCall, onStartCallManually }) => {
  return (
    <CallScreen title="Anrufliste">
      {callHistory.map((call, i) => (
         <div key={i} className="flex items-center text-left p-3 rounded-lg bg-white/5 transition-colors hover:bg-white/10" onClick={() => call.summary && onCallSelect(call)}>
            <div className="flex-grow flex items-center" style={{ cursor: call.summary ? 'pointer' : 'default' }}>
                {call.type === 'Eingehend' && <Phone size={20} className="mr-4 text-green-400 flex-shrink-0"/>}
                {call.type === 'Verpasst' && <PhoneMissed size={20} className="mr-4 text-red-400 flex-shrink-0"/>}
                {call.type.includes('Ausgehend') && <PhoneOutgoing size={20} className="mr-4 text-blue-400 flex-shrink-0"/>}
                <div className="flex-grow">
                    <p className="text-white font-semibold">{call.name}</p>
                    <p className="text-sm text-muted-foreground">{call.time}</p>
                </div>
            </div>
            {call.number !== 'Unbekannt' && (
              <div className="flex gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" className="w-10 h-10" onClick={(e) => { e.stopPropagation(); onStartCallManually(call.number); }}>
                  <Phone size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="w-10 h-10" onClick={(e) => { e.stopPropagation(); onStartCall(call.number); }}>
                  <Bot size={18} />
                </Button>
              </div>
            )}
         </div>
      ))}
    </CallScreen>
  );
};

export default HistoryScreen;
