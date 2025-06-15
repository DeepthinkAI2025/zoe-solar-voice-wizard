import React, { useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { EyeOff } from 'lucide-react';
import type { aiAgents } from '@/data/mock';
import CallHeader from './active-call/CallHeader';
import TranscriptView from './active-call/TranscriptView';
import IncomingCallControls from './active-call/IncomingCallControls';
import ActiveCallControls from './active-call/ActiveCallControls';
import { useActiveCallLogic } from '@/hooks/useActiveCallLogic';
import type { TranscriptLine } from '@/hooks/useCallState';
import { usePhoneState } from '@/hooks/usePhoneState';

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

const ActiveCallView: React.FC<ActiveCallViewProps> = ({ number, contactName, status, agentId, notes, onEndCall, onAcceptCall, onAcceptCallManually, agents, startMuted, onForward, onIntervene, isForwarding, duration, onMinimize }) => {
  const { activeCall, handleSendNote: onSendNote } = usePhoneState();
  const transcript = activeCall?.transcript;
  const agent = agents.find(a => a.id === agentId);
  const [newNote, setNewNote] = useState('');

  const {
    isMuted,
    setIsMuted,
    isSpeakerMuted,
    setIsSpeakerMuted,
    isRingerMuted,
    setIsRingerMuted,
    scrollContainerRef,
    callerName,
    audioOptionsWithMute,
    selectedAudioDevice,
    handleAudioOutputChange,
  } = useActiveCallLogic({ agentId, contactName, startMuted });

  const handleSendNote = () => {
    if (newNote.trim() && onSendNote) {
      onSendNote(newNote);
      setNewNote('');
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [transcript, scrollContainerRef]);

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

  return (
    <motion.div
      drag={status === 'active' ? 'y' : false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.8 }}
      onDragEnd={handleActiveCallDragEnd}
      className="fixed inset-0 bg-gradient-to-br from-background via-card to-background z-40 flex flex-col p-6 animate-slide-up cursor-grab active:cursor-grabbing"
    >
      {isForwarding && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-50 animate-fade-in">
              <p className="text-primary text-lg animate-pulse">Einen Moment, die Weiterleitung wird vorbereitet...</p>
          </div>
      )}
      
      <CallHeader number={number} contactName={contactName} status={status} duration={duration} />

      <button 
            onClick={onMinimize} 
            className="absolute top-7 right-7 text-muted-foreground hover:text-foreground z-50 p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Anruf minimieren"
        >
            <EyeOff size={22} />
        </button>

      {status === 'active' && (
        <TranscriptView
          scrollContainerRef={scrollContainerRef}
          agent={agent}
          notes={notes}
          transcript={transcript || []}
          newNote={newNote}
          onNewNoteChange={setNewNote}
          onSendNote={handleSendNote}
          callerName={callerName}
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
            onAcceptCall={onAcceptCall}
          />
        ) : (
          <ActiveCallControls
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
            isSpeakerMuted={isSpeakerMuted}
            onToggleSpeakerMute={() => setIsSpeakerMuted(!isSpeakerMuted)}
            agentId={agentId}
            onForward={onForward}
            onIntervene={onIntervene}
            audioOutputs={audioOptionsWithMute}
            selectedAudioDevice={selectedAudioDevice}
            onAudioOutputChange={handleAudioOutputChange}
            onEndCall={onEndCall}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ActiveCallView;
