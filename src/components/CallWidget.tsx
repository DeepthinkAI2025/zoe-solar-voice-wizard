
import React from 'react';
import { motion } from 'framer-motion';
import { Phone, PhoneOff, Maximize, Mic } from 'lucide-react';
import type { CallState } from '@/types/call';
import type { AgentWithSettings } from '@/hooks/useAgentManagement';

interface CallWidgetProps {
  callState: CallState;
  contactName?: string;
  agent?: AgentWithSettings;
  duration: number;
  onMaximize: () => void;
  onEndCall: () => void;
}

const formatDuration = (d: number) => {
  const minutes = Math.floor(d / 60).toString().padStart(2, '0');
  const seconds = (d % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const CallWidget: React.FC<CallWidgetProps> = ({ callState, contactName, agent, duration, onMaximize, onEndCall }) => {
  if (!callState) return null;
  
  const displayName = contactName || callState.number;

  return (
    <motion.div
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 200, opacity: 0 }}
      drag
      dragConstraints={{ top: -400, left: -150, right: 150, bottom: 0 }}
      dragMomentum={false}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm p-3 bg-black/50 backdrop-blur-xl rounded-2xl shadow-2xl flex items-center justify-between text-white z-50 cursor-grab active:cursor-grabbing border border-white/10"
    >
      <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={onMaximize}>
        {agent ? (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 animate-pulse">
            <Mic size={16} />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <Phone size={16} />
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-sm truncate">{displayName}</span>
          <span className="text-xs text-muted-foreground">
            {callState.status === 'incoming' 
              ? 'Eingehender Anruf' 
              : agent 
                ? `KI: ${agent.name}` 
                : `Anruf ${formatDuration(duration)}`}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 pl-2">
        <button onClick={onMaximize} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0">
          <Maximize size={20} />
        </button>
        <button onClick={onEndCall} className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600/80 hover:bg-red-600 transition-colors flex-shrink-0">
          <PhoneOff size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default CallWidget;
