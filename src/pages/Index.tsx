
import React, { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import Dialpad from '@/components/Dialpad';
import CallScreen from '@/components/CallScreen';
import AgentSelector from '@/components/AgentSelector';
import ActiveCallView from '@/components/ActiveCallView';
import CallDetailsDrawer from '@/components/CallDetailsDrawer';
import { callHistory, contacts, voicemails, aiAgents as initialAgents } from '@/data/mock';
import { Phone, PhoneMissed, PhoneOutgoing, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

type CallHistoryItem = typeof callHistory[0];

type CallState = null | {
  number: string;
  status: 'incoming' | 'active';
  agentId?: string;
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('dialpad');
  const [callState, setCallState] = useState<CallState>(null);
  const [showAgentSelector, setShowAgentSelector] = useState<string | null>(null);
  const [selectedCall, setSelectedCall] = useState<CallHistoryItem | null>(null);
  const [agents, setAgents] = useState(initialAgents);
  const { toast } = useToast();

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

  const handleStartCallManually = (number: string) => {
    setCallState({ number, status: 'active' });
  };

  const handleAgentSelect = (agentId: string) => {
    if(showAgentSelector) {
        setCallState({ number: showAgentSelector, status: 'active', agentId });
        setShowAgentSelector(null);
    }
  };

  const handleAgentToggle = async (agentId: string, active: boolean) => {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;

    toast({
      title: 'Agent-Status wird aktualisiert...',
      description: `Simuliere API-Aufruf, um ${agent.name} zu ${active ? 'aktivieren' : 'deaktivieren'}.`,
    });

    // Simulate API call to fapro CRM
    console.log(
      `Simulating API call to fapro CRM for agent ${agent.name} (${agentId}). New status: ${
        active ? 'active' : 'inactive'
      }`
    );
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setAgents(prevAgents => 
      prevAgents.map(a => 
        a.id === agentId ? { ...a, active } : a
      )
    );

    toast({
      title: 'Erfolgreich!',
      description: `Agent ${agent.name} wurde ${active ? 'aktiviert' : 'deaktiviert'}.`,
    });
  };
  
  const handleAcceptCallWithAI = () => {
    if (callState?.status === 'incoming') {
      setShowAgentSelector(callState.number);
    }
  }

  const handleAcceptCallManually = () => {
    if (callState?.status === 'incoming') {
      setCallState({ number: callState.number, status: 'active' });
    }
  };

  const handleEndCall = () => {
    setCallState(null);
    setSelectedCall(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return <CallScreen title="Anrufliste">
          {callHistory.map((call, i) => (
             <div key={i} className="flex items-center text-left p-3 rounded-lg bg-white/5 transition-colors hover:bg-white/10" onClick={() => call.summary && setSelectedCall(call)}>
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
                    <Button variant="ghost" size="icon" className="w-10 h-10" onClick={(e) => { e.stopPropagation(); handleStartCallManually(call.number); }}>
                      <Phone size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-10 h-10" onClick={(e) => { e.stopPropagation(); handleStartCall(call.number); }}>
                      <Bot size={18} />
                    </Button>
                  </div>
                )}
             </div>
          ))}
        </CallScreen>;
      case 'contacts':
        return <CallScreen title="Kontakte">
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
                  <Button variant="ghost" size="icon" className="w-10 h-10" onClick={() => handleStartCallManually(contact.number)}>
                    <Phone size={18} />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-10 h-10" onClick={() => handleStartCall(contact.number)}>
                    <Bot size={18} />
                  </Button>
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
            agents={agents}
            onToggleAgent={handleAgentToggle}
            onSelect={handleAgentSelect} 
            onClose={() => setShowAgentSelector(null)} 
            numberToCall={showAgentSelector}
        />
      )}

      {callState && (
        <ActiveCallView 
            {...callState} 
            agents={agents}
            onEndCall={handleEndCall}
            onAcceptCall={handleAcceptCallWithAI}
            onAcceptCallManually={handleAcceptCallManually}
        />
      )}

      <CallDetailsDrawer call={selectedCall} onClose={() => setSelectedCall(null)} />
    </div>
  );
};

export default Index;
