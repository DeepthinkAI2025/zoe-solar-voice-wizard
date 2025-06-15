
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '@/components/Icon';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import type { aiAgents } from '@/data/mock';

type Agent = (typeof aiAgents)[0];

interface TranscriptViewProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  agent?: Agent;
  notes?: string;
  transcript: string[];
  newNote: string;
  onNewNoteChange: (value: string) => void;
  onSendNote: () => void;
}

const TranscriptView: React.FC<TranscriptViewProps> = ({
  scrollContainerRef,
  agent,
  notes,
  transcript,
  newNote,
  onNewNoteChange,
  onSendNote,
}) => {
  const [showStartNotice, setShowStartNotice] = useState(true);

  useEffect(() => {
    if (agent) {
      setShowStartNotice(true);
      const timer = setTimeout(() => {
        setShowStartNotice(false);
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [agent]);

  return (
    <>
      <div ref={scrollContainerRef} className="flex-grow my-8 overflow-y-auto space-y-4 pr-2">
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
        {transcript.map((line, index) => (
          <div key={index} className="text-left p-3 rounded-lg bg-secondary animate-fade-in">
             <p className="text-foreground">{line.startsWith('[Notiz an KI]:') 
                ? <><span className="text-primary font-semibold">Notiz an KI:</span>{line.replace('[Notiz an KI]:', '')}</>
                : line}
             </p>
          </div>
        ))}
      </div>

      {agent && (
        <div className="flex-shrink-0 mb-6 flex gap-2">
          <Textarea 
              value={newNote}
              onChange={(e) => onNewNoteChange(e.target.value)}
              placeholder={`Live-Notiz für ${agent.name} eingeben...`}
              className="bg-secondary border-border min-h-0 h-12"
              rows={1}
          />
          <Button onClick={onSendNote} size="icon" className="w-12 h-12" disabled={!newNote.trim()}>
              <Send />
          </Button>
        </div>
      )}
    </>
  );
};

export default TranscriptView;
