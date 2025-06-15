
import React from 'react';
import CallScreen from '@/components/CallScreen';
import { voicemails } from '@/data/mock';
import type { CallHistoryItem } from '@/types/call';

interface VoicemailScreenProps {
  onVoicemailSelect: (call: CallHistoryItem) => void;
}

const VoicemailScreen: React.FC<VoicemailScreenProps> = ({ onVoicemailSelect }) => {
  const handleSelect = (vm: (typeof voicemails)[0]) => {
    onVoicemailSelect({
      ...vm,
      type: 'Voicemail',
      summary: 'Die Wiedergabe der Voicemail ist noch nicht verfügbar.',
      transcript: null,
    });
  };
  
  return (
    <CallScreen title="Voicemail">
       {voicemails.map((vm, i) => (
         <div 
          key={i} 
          className="flex items-center text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
          onClick={() => handleSelect(vm)}
         >
            <div className="flex-grow">
                <p className="text-white font-semibold">{vm.name}</p>
                <p className="text-sm text-muted-foreground">{vm.duration}</p>
            </div>
             <p className="text-sm text-muted-foreground">{vm.time}</p>
         </div>
       ))}
    </CallScreen>
  );
};

export default VoicemailScreen;
