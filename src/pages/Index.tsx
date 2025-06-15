
import React, { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import Dialpad from '@/components/Dialpad';
import CallScreen from '@/components/CallScreen';
import AgentSelector from '@/components/AgentSelector';
import ActiveCallView from '@/components/ActiveCallView';
import { callHistory, contacts, voicemails } from '@/data/mock';
import { Phone, PhoneMissed, PhoneOutgoing, User } from 'lucide-react';
import { cn } from '@/lib/utils';

type CallState = null | {
  number: string;
  status: 'incoming' | 'active';
  agentId?: string;
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('dialpad');
  const [callState, setCallState] = useState<CallState>(null);
  const [showAgentSelector, setShowAgentSelector] = useState<string | null>(null);

  // Simulate an incoming call for demonstration
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!callState) {
        setCallState({ number: 'Unbekannt', status: 'incoming' });
      }
    }, 8000); // Incoming call after 8 seconds
    return () => clearTimeout(timeout);
  }, [callState]);


  const handleStartCall = (number: string) => {
    setShowAgentSelector(number);
  };

  const handleAgentSelect = (agentId: string) => {
    if(showAgentSelector) {
        setCallState({ number: showAgentSelector, status: 'active', agentId });
        setShowAgentSelector(null);
    }
  };
  
  const handleAcceptCallWithAI = () => {
    if (callState?.status === 'incoming') {
      setShowAgentSelector(callState.number);
    }
  }

  const handleEndCall = () => {
    setCallState(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return <CallScreen title="Anrufliste">
          {callHistory.map((call, i) => (
             <div key={i} className="flex items-center text-left p-3 rounded-lg bg-white/5">
                {call.type === 'Eingehend' && <Phone size={20} className="mr-4 text-green-400"/>}
                {call.type === 'Verpasst' && <PhoneMissed size={20} className="mr-4 text-red-400"/>}
                {call.type.includes('Ausgehend') && <PhoneOutgoing size={20} className="mr-4 text-blue-400"/>}
                <div className="flex-grow">
                    <p className="text-white font-semibold">{call.name}</p>
                    <p className="text-sm text-muted-foreground">{call.type}</p>
                </div>
                <p className="text-sm text-muted-foreground">{call.time}</p>
             </div>
          ))}
        </CallScreen>;
      case 'contacts':
        return <CallScreen title="Kontakte">
           {contacts.map((contact, i) => (
             <div key={i} className="flex items-center text-left p-3 rounded-lg bg-white/5">
                <User size={20} className="mr-4 text-muted-foreground"/>
                <div className="flex-grow">
                    <p className="text-white font-semibold">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.number}</p>
                </div>
             </div>
           ))}
        </CallScreen>;
      case 'voicemail':
        return <CallScreen title="Voicemail">
           {voicemails.map((vm, i) => (
             <div key={i} className="flex items-center text-left p-3 rounded-lg bg-white/5">
                <div className="flex-grow">
                    <p className="text-white font-semibold">{vm.name}</p>
                    <p className="text-sm text-muted-foreground">{vm.duration}</p>
                </div>
                 <p className="text-sm text-muted-foreground">{vm.time}</p>
             </div>
           ))}
        </CallScreen>;
      case 'dialpad':
      default:
        return <Dialpad onCall={handleStartCall} />;
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-black flex flex-col overflow-hidden rounded-3xl border-4 border-white/10 shadow-2xl shadow-primary/20">
      <header className="flex-shrink-0 text-center py-4">
        <h1 className="text-xl font-bold text-white tracking-wider">ZOE <span className="text-primary">Solar</span></h1>
        <p className="text-xs text-muted-foreground">AI Phone</p>
      </header>

      <main className="flex-grow flex flex-col overflow-hidden">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} className="flex-shrink-0" />

      {showAgentSelector && (
        <AgentSelector 
            onSelect={handleAgentSelect} 
            onClose={() => setShowAgentSelector(null)} 
            numberToCall={showAgentSelector}
        />
      )}

      {callState && (
        <ActiveCallView 
            {...callState} 
            onEndCall={handleEndCall}
            onAcceptCall={handleAcceptCallWithAI}
        />
      )}
    </div>
  );
};

export default Index;
