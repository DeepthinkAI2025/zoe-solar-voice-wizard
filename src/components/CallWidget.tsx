import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Phone, Mic } from 'lucide-react';
import type { ActiveCall } from '@/hooks/useCallState';
import type { AgentWithSettings } from '@/hooks/useAgentManagement';
import { useIsMobile } from '../hooks/use-mobile';
import { cn } from '@/lib/utils';
interface CallWidgetProps {
  callState: ActiveCall;
  contactName?: string;
  agent?: AgentWithSettings;
  duration: number;
  onMaximize: () => void;
  onEndCall: () => void;
  dragConstraints?: React.RefObject<HTMLElement>;
}
const formatDuration = (d: number) => {
  const minutes = Math.floor(d / 60).toString().padStart(2, '0');
  const seconds = (d % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};
const CallWidget: React.FC<CallWidgetProps> = ({
  callState,
  contactName,
  agent,
  duration,
  onMaximize,
  onEndCall,
  dragConstraints
}) => {
  const isMobile = useIsMobile();
  if (!callState) return null;
  const displayName = contactName || callState.number;
  const lastMessage = agent && callState.transcript?.length && callState.transcript[0].speaker !== 'system' ? callState.transcript[0].text : null;
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // End call if dragged up
    if (info.offset.y < -80) {
      onEndCall();
    }
  };
  return <motion.div initial={{
    y: -200,
    opacity: 0
  }} animate={{
    y: 0,
    opacity: 1
  }} exit={{
    y: -200,
    opacity: 0
  }} drag onDragEnd={handleDragEnd} dragConstraints={dragConstraints} dragMomentum={false} className="">
      <div className={cn("flex gap-3 cursor-pointer w-full", isMobile ? "flex-col items-center text-center min-h-[72px] justify-center" : "items-center")} onClick={onMaximize}>
        {agent ? <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 animate-pulse">
            <Mic size={16} />
          </div> : <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <Phone size={16} />
          </div>}
        <div className={cn("flex flex-col min-w-0", isMobile && "items-center")}>
          <span className="font-bold text-sm truncate text-foreground w-full">{displayName}</span>
          <span className="text-xs text-muted-foreground w-full whitespace-normal break-words">
            {callState.status === 'incoming' ? 'Eingehender Anruf' : agent ? lastMessage || `KI: ${agent.name}` : `Anruf ${formatDuration(duration)}`}
          </span>
        </div>
      </div>
    </motion.div>;
};
export default CallWidget;