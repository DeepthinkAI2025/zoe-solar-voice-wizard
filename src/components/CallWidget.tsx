import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Phone, Mic } from 'lucide-react';
import type { ActiveCall } from '@/hooks/useCallState';
import type { AgentWithSettings } from '@/hooks/useAgentManagement';

interface CallWidgetProps {
  callState: ActiveCall;
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
  const lastMessage = agent && callState.transcript?.[0]?.speaker !== 'system' ? callState.transcript?.[0]?.text : null;

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // End call if dragged down
    if (info.offset.y > 80) {
      onEndCall();
    }
  };

  return (
    <motion.div
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 200, opacity: 0 }}
      drag="y"
      onDragEnd={handleDragEnd}
      dragConstraints={{ top: -400, left: 0, right: 0, bottom: 0 }}
      dragMomentum={false}
      className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[90%] max-w-sm p-3 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl flex items-center z-50 cursor-grab active:cursor-grabbing border dark:border-white/10 dark:bg-black/30 bg-secondary/80"
    >
      <div className="flex items-center gap-3 overflow-hidden cursor-pointer w-full" onClick={onMaximize}>
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
          <span className="font-bold text-sm truncate text-foreground">{displayName}</span>
          <span className="text-xs text-muted-foreground truncate">
            {callState.status === 'incoming' 
              ? 'Eingehender Anruf' 
              : agent 
                ? lastMessage || `KI: ${agent.name}` 
                : `Anruf ${formatDuration(duration)}`}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default CallWidget;
