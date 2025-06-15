import React, { useState, useEffect, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Phone, Volume2, Bluetooth, Eye, EyeOff } from 'lucide-react';
import type { aiAgents } from '@/data/mock';
import CallHeader from './active-call/CallHeader';
import TranscriptView from './active-call/TranscriptView';
import IncomingCallControls from './active-call/IncomingCallControls';
import ActiveCallControls from './active-call/ActiveCallControls';

type Agent = (typeof aiAgents)[0];

interface ActiveCallViewProps {
  number: string;
  contactName?: string;
  status: 'incoming' | 'active';
  agentId?: string;
  notes?: string;
  onEndCall: () => void;
  onAcceptCall?: () => void;
  onAcceptCallManually?: () => void;
  agents: Agent[];
  startMuted?: boolean;
  onForward?: () => void;
  onIntervene?: () => void;
  isForwarding?: boolean;
  duration: number;
  onMinimize?: () => void;
}

const mockTranscript = [
  "Hallo, ZOE Solar, mein Name ist Alex, der KI-Assistent. Wie kann ich Ihnen helfen?",
  "Guten Tag, hier ist Müller. Ich habe eine Frage zu meiner letzten Rechnung.",
  "Selbstverständlich, Herr Müller. Um Ihnen zu helfen, benötige ich bitte Ihre Kunden- oder Rechnungsnummer.",
  "Moment, die habe ich hier... das ist die 12345.",
  "Vielen Dank. Ich prüfe das für Sie...",
  "Es scheint ein Problem mit der Abrechnung der sonderleistung zu geben. Ich verbinde Sie mit einem Menschen.",
];

const ActiveCallView: React.FC<ActiveCallViewProps> = ({ number, contactName, status, agentId, notes, onEndCall, onAcceptCall, onAcceptCallManually, agents, startMuted, onForward, onIntervene, isForwarding, duration, onMinimize }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isRingerMuted, setIsRingerMuted] = useState(startMuted ?? false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const [audioOutput, setAudioOutput] = useState('speaker');
  const [isTranscriptVisible, setIsTranscriptVisible] = useState(true);
  const agent = agents.find(a => a.id === agentId);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const audioOutputs = [
    { id: 'speaker', name: 'Lautsprecher', icon: Volume2 },
    { id: 'earpiece', name: 'Telefonhörer', icon: Phone },
    { id: 'bluetooth_airpods', name: 'AirPods Pro', icon: Bluetooth },
    { id: 'bluetooth_car', name: 'Auto-HiFi', icon: Bluetooth },
  ];
  const selectedAudioDevice = audioOutputs.find(o => o.id === audioOutput) || audioOutputs[0];

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [transcript]);

  useEffect(() => {
    if (status === 'active') {
      const transcriptTimer = setInterval(() => {
        setTranscript(prev => {
          if (prev.length < mockTranscript.length) {
            return [mockTranscript[prev.length], ...prev];
          }
          return prev;
        });
      }, 3500);

      return () => {
        clearInterval(transcriptTimer);
      };
    }
  }, [status]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset } = info;
    const SWIPE_THRESHOLD = 80;

    // Swipe up to accept with AI
    if (offset.y < -SWIPE_THRESHOLD) {
      onAcceptCall?.();
      return;
    }
    
    // Swipe down, left, or right to reject call
    if (offset.y > SWIPE_THRESHOLD || Math.abs(offset.x) > SWIPE_THRESHOLD) {
      onEndCall();
      return;
    }
  };
  
  const handleActiveCallDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (status !== 'active') return;
    const { offset } = info;
    const SWIPE_THRESHOLD = 80;

    if (offset.y > SWIPE_THRESHOLD) {
      onMinimize?.();
    }
  };

  const handleSendNote = () => {
    if (!newNote.trim()) return;
    console.log("Sending new note to AI:", newNote);
    // Add to transcript for visual feedback
    setTranscript(prev => [`[Notiz an KI]: ${newNote}`, ...prev]);
    setNewNote('');
  };

  return (
    <motion.div
      drag={status === 'active' ? 'y' : false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.8 }}
      onDragEnd={handleActiveCallDragEnd}
      className="fixed inset-0 bg-background z-40 flex flex-col p-6 animate-slide-up cursor-grab active:cursor-grabbing"
    >
      {isForwarding && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-50 animate-fade-in">
              <p className="text-primary text-lg animate-pulse">Einen Moment, die Weiterleitung wird vorbereitet...</p>
          </div>
      )}
      
      <CallHeader number={number} contactName={contactName} status={status} duration={duration} />

      <button 
            onClick={() => setIsTranscriptVisible(!isTranscriptVisible)} 
            className="absolute top-7 right-7 text-muted-foreground hover:text-foreground z-50 p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label={isTranscriptVisible ? "Transkript ausblenden" : "Transkript einblenden"}
        >
            {isTranscriptVisible ? <EyeOff size={22} /> : <Eye size={22} />}
        </button>

      {status === 'active' && isTranscriptVisible && (
        <TranscriptView
          scrollContainerRef={scrollContainerRef}
          agent={agent}
          notes={notes}
          transcript={transcript}
          newNote={newNote}
          onNewNoteChange={setNewNote}
          onSendNote={handleSendNote}
        />
      )}
      
      <div className="flex-shrink-0 flex-grow flex flex-col justify-end pb-6">
        {status === 'incoming' ? (
          <IncomingCallControls
            isRingerMuted={isRingerMuted}
            onToggleRingerMute={() => setIsRingerMuted(!isRingerMuted)}
            onDragEnd={handleDragEnd}
            onEndCall={onEndCall}
            onAcceptCallManually={onAcceptCallManually}
          />
        ) : (
          <ActiveCallControls
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
            agentId={agentId}
            onForward={onForward}
            onIntervene={onIntervene}
            audioOutputs={audioOutputs}
            selectedAudioDevice={selectedAudioDevice}
            onAudioOutputChange={setAudioOutput}
            onEndCall={onEndCall}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ActiveCallView;
