
import React, { useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Phone, PhoneOff, Mic, MicOff, Volume2, Bot, VolumeX, Send } from 'lucide-react';
import Icon from './Icon';
import type { aiAgents } from '@/data/mock';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

type Agent = (typeof aiAgents)[0];

interface ActiveCallViewProps {
  number: string;
  status: 'incoming' | 'active';
  agentId?: string;
  notes?: string;
  onEndCall: () => void;
  onAcceptCall?: () => void;
  onAcceptCallManually?: () => void;
  agents: Agent[];
}

const mockTranscript = [
  "Hallo, ZOE Solar, mein Name ist Alex, der KI-Assistent. Wie kann ich Ihnen helfen?",
  "Guten Tag, hier ist Müller. Ich habe eine Frage zu meiner letzten Rechnung.",
  "Selbstverständlich, Herr Müller. Um Ihnen zu helfen, benötige ich bitte Ihre Kunden- oder Rechnungsnummer.",
  "Moment, die habe ich hier... das ist die 12345.",
  "Vielen Dank. Ich prüfe das für Sie...",
  "Es scheint ein Problem mit der Abrechnung der sonderleistung zu geben. Ich verbinde Sie mit einem Menschen.",
];

const ActiveCallView: React.FC<ActiveCallViewProps> = ({ number, status, agentId, notes, onEndCall, onAcceptCall, onAcceptCallManually, agents }) => {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const agent = agents.find(a => a.id === agentId);

  useEffect(() => {
    if (status === 'active') {
      const timer = setInterval(() => setDuration(d => d + 1), 1000);
      const transcriptTimer = setInterval(() => {
        setTranscript(prev => {
          if (prev.length < mockTranscript.length) {
            return [...prev, mockTranscript[prev.length]];
          }
          return prev;
        });
      }, 3500);

      return () => {
        clearInterval(timer);
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
    
    // Swipe down, left, or right to reject
    if (offset.y > SWIPE_THRESHOLD || Math.abs(offset.x) > SWIPE_THRESHOLD) {
      onEndCall();
      return;
    }
  };

  const handleSendNote = () => {
    if (!newNote.trim()) return;
    console.log("Sending new note to AI:", newNote);
    // Add to transcript for visual feedback
    setTranscript(prev => [...prev, `[Notiz an KI]: ${newNote}`]);
    setNewNote('');
  };

  const formatDuration = (sec: number) => {
    const minutes = Math.floor(sec / 60).toString().padStart(2, '0');
    const seconds = (sec % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="fixed inset-0 bg-background z-40 flex flex-col p-6 animate-slide-up">
      {/* Header */}
      <div className="text-center pt-8">
        <h2 className="text-3xl font-bold text-white">{number}</h2>
        <p className="text-primary mt-2">{status === 'incoming' ? 'Eingehender Anruf' : formatDuration(duration)}</p>
      </div>

      {/* Transcript & Notes for active call */}
      {status === 'active' && (
        <>
          <div className="flex-grow my-8 overflow-y-auto space-y-4 pr-2">
            {agent && (
              <div className="flex flex-col gap-3 p-3 rounded-lg bg-white/5 text-sm">
                <div className="flex items-center gap-3">
                  <Icon name={agent.icon} className="text-primary w-5 h-5 flex-shrink-0" />
                  <span className="text-muted-foreground">{agent.name} ist aktiv.</span>
                </div>
                {notes && <p className="text-white/80 pl-8 border-l-2 border-primary/20 ml-2.5">Start-Notiz: "{notes}"</p>}
              </div>
            )}
            {transcript.map((line, index) => (
              <div key={index} className="text-left p-3 rounded-lg bg-white/5 animate-fade-in">
                 <p className="text-white">{line.startsWith('[Notiz an KI]:') 
                    ? <><span className="text-primary font-semibold">Notiz an KI:</span>{line.replace('[Notiz an KI]:', '')}</>
                    : line}
                 </p>
              </div>
            ))}
          </div>

          {agentId && (
              <div className="flex-shrink-0 mb-6 flex gap-2">
                <Textarea 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder={`Live-Notiz für ${agent?.name} eingeben...`}
                    className="bg-white/5 border-white/10 min-h-0 h-12"
                    rows={1}
                />
                <Button onClick={handleSendNote} size="icon" className="w-12 h-12" disabled={!newNote.trim()}>
                    <Send />
                </Button>
              </div>
          )}
        </>
      )}
      
      {/* Controls */}
      <div className="flex-shrink-0 flex-grow flex flex-col">
        {status === 'incoming' ? (
          <div className="flex-grow flex flex-col">
            <div className="flex justify-end px-6 mb-4">
              <button className="flex flex-col items-center text-muted-foreground hover:text-white transition-colors">
                  <VolumeX size={20} />
                  <span className="text-xs mt-1">Stumm</span>
              </button>
            </div>
            <motion.div
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
                className="flex-grow flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing"
                aria-label="Anruf annehmen oder Gesten verwenden"
            >
              <p className="text-sm text-primary animate-pulse">Nach oben wischen, um mit KI anzunehmen</p>
              <motion.div
                  onTap={onAcceptCallManually}
                  className="w-20 h-20 my-8 rounded-full bg-green-500/80 hover:bg-green-500 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                  whileTap={{ scale: 1.1 }}
                  aria-label="Anruf annehmen"
              >
                  <Phone size={32} className="text-white" />
              </motion.div>
              <p className="text-sm text-muted-foreground">Zum Ablehnen zur Seite oder nach unten wischen</p>
            </motion.div>
          </div>
        ) : (
          <div className="flex justify-around items-center pt-4">
            <button onClick={() => setIsMuted(!isMuted)} className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
              {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
            </button>
            <button onClick={onEndCall} className="w-20 h-20 rounded-full bg-red-600/80 hover:bg-red-600 flex items-center justify-center transition-transform hover:scale-105">
              <PhoneOff size={32} className="text-white" />
            </button>
            <button className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
              <Volume2 size={28} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveCallView;
