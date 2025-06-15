
import React from 'react';
import CallScreen from '@/components/CallScreen';
import { voicemails } from '@/data/mock';

const VoicemailScreen: React.FC = () => {
  return (
    <CallScreen title="Voicemail">
       {voicemails.map((vm, i) => (
         <div key={i} className="flex items-center text-left p-3 rounded-lg bg-white/5">
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
