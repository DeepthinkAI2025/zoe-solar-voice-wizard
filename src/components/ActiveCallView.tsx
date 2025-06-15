
import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, Bot, VolumeX } from 'lucide-react';
import Icon from './Icon';
import type { aiAgents } from '@/data/mock';

type Agent = (typeof aiAgents)[0];

interface ActiveCallViewProps {
  number: string;
  status: 'incoming' | 'active';
  agentId?: string;
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

const ActiveCallView: React.FC<ActiveCallViewProps> = ({ number, status, agentId, onEndCall, onAcceptCall, onAcceptCallManually, agents }) => {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
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

      {/* Transcript */}
      <div className="flex-grow my-8 overflow-y-auto space-y-4 pr-2">
        {agent && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 text-sm">
            <Icon name={agent.icon} className="text-primary w-5 h-5 flex-shrink-0" />
            <span className="text-muted-foreground">{agent.name} ist aktiv.</span>
          </div>
        )}
        {transcript.map((line, index) => (
          <div key={index} className="text-left p-3 rounded-lg bg-white/5 animate-fade-in">
             <p className="text-white">{line}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex-shrink-0">
        {status === 'incoming' ? (
          <div>
            <div className="flex justify-end px-6 mb-4">
              <button className="flex flex-col items-center text-muted-foreground hover:text-white transition-colors">
                  <VolumeX size={20} />
                  <span className="text-xs mt-1">Stumm</span>
              </button>
            </div>
            <div className="flex justify-around items-center px-8">
              <div className="flex flex-col items-center gap-2">
                <button onClick={onEndCall} className="w-20 h-20 rounded-full bg-red-600/80 hover:bg-red-600 flex items-center justify-center transition-transform hover:scale-105">
                  <PhoneOff size={32} className="text-white" />
                </button>
                <span className="text-white text-sm">Ablehnen</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <button onClick={onAcceptCallManually} className="w-20 h-20 rounded-full bg-green-500/80 hover:bg-green-500 flex items-center justify-center transition-transform hover:scale-105">
                  <Phone size={32} className="text-white" />
                </button>
                <span className="text-white text-sm">Annehmen</span>
              </div>
            </div>
            <div className="text-center mt-8">
              <button onClick={onAcceptCall} className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                <Bot size={20} />
                <span>Mit KI-Agent antworten</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-around items-center">
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
