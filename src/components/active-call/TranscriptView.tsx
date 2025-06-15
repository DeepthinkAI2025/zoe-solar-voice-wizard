
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '@/components/Icon';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import type { aiAgents } from '@/data/mock';
import type { TranscriptLine } from '@/hooks/useCallState';

type Agent = (typeof aiAgents)[0];

interface TranscriptViewProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  agent?: Agent;
  notes?: string;
  transcript: TranscriptLine[];
  newNote: string;
  onNewNoteChange: (value: string) => void;
  onSendNote: () => void;
  callerName: string;
}

const TranscriptView: React.FC<TranscriptViewProps> = ({
  scrollContainerRef,
  agent,
  notes,
  transcript,
  newNote,
  onNewNoteChange,
  onSendNote,
  callerName,
}) => {
  const [showStartNotice, setShowStartNotice] = useState(true);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smoothly scroll to the latest message
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  useEffect(() => {
    if (agent) {
      setShowStartNotice(true);
      const timer = setTimeout(() => {
        setShowStartNotice(false);
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [agent]);

  const getSpeakerName = (speaker: TranscriptLine['speaker']) => {
    if (speaker === 'agent') {
        return agent?.name || 'KI-Assistent';
    }
    if (speaker === 'caller') {
        // Display "Anrufer" as shown in the screenshot
        return 'Anrufer';
    }
    return null;
  }

  return (
    <>
      <div ref={scrollContainerRef} className="flex-grow my-4 overflow-y-auto space-y-4 pr-2 pb-4">
        <AnimatePresence>
          {showStartNotice && agent && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="flex flex-col gap-3 p-3 rounded-lg bg-secondary text-sm"
            >
              <div className="flex items-center gap-3">
                <Icon name={agent.icon} className="text-primary w-5 h-5 flex-shrink-0" />
                <span className="text-secondary-foreground">{agent.name} ist aktiv.</span>
              </div>
              {notes && <p className="text-secondary-foreground/80 pl-8 border-l-2 border-primary/20 ml-2.5">Start-Notiz: "{notes}"</p>}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence initial={false}>
          {transcript.map((line, index) => {
              const speakerName = getSpeakerName(line.speaker);
              const isAgent = line.speaker === 'agent';
              
              if (line.speaker === 'system') {
                return (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="flex justify-center"
                  >
                    <div className="text-xs italic text-muted-foreground bg-secondary/50 rounded-full px-3 py-1">
                      {line.text.replace('[Notiz an KI]:', 'Notiz an KI gesendet')}
                    </div>
                  </motion.div>
                )
              }

              return (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`flex w-full ${isAgent ? 'justify-start' : 'justify-end'}`}
                >
                  <div className="max-w-[80%]">
                    <p className={`text-xs mb-1 ${isAgent ? 'text-left' : 'text-right'} text-muted-foreground`}>{speakerName}</p>
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-md ${
                        isAgent
                          ? 'bg-muted rounded-bl-none'
                          : 'bg-primary text-primary-foreground rounded-br-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{line.text}</p>
                    </div>
                  </div>
                </motion.div>
              );
          })}
        </AnimatePresence>
        <div ref={endOfMessagesRef} />
      </div>

      {agent && (
        <div className="flex-shrink-0 mb-4 flex gap-2 items-start">
          <Textarea 
              value={newNote}
              onChange={(e) => onNewNoteChange(e.target.value)}
              placeholder={`Live-Notiz für ${agent.name}...`}
              className="bg-secondary border-border min-h-[48px] text-base resize-none"
              rows={1}
              inputMode="text"
          />
          <Button onClick={onSendNote} size="icon" className="w-12 h-12 flex-shrink-0" disabled={!newNote.trim()}>
              <Send size={20} />
          </Button>
        </div>
      )}
    </>
  );
};

export default TranscriptView;
