import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Phone, PhoneOff, Volume2, VolumeX } from 'lucide-react';

interface IncomingCallControlsProps {
  isRingerMuted: boolean;
  onToggleRingerMute: () => void;
  onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onEndCall: () => void;
  onAcceptCallManually?: () => void;
}

const IncomingCallControls: React.FC<IncomingCallControlsProps> = ({
  isRingerMuted,
  onToggleRingerMute,
  onDragEnd,
  onEndCall,
  onAcceptCallManually,
}) => {
  return (
    <div className="flex-grow flex flex-col">
      <div className="flex justify-end px-6 mb-4">
        <button onClick={onToggleRingerMute} className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors">
            {isRingerMuted ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <span className="text-xs mt-1">{isRingerMuted ? 'Ton an' : 'Stumm'}</span>
        </button>
      </div>
      <motion.div
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.7}
          onDragEnd={onDragEnd}
          className="flex-grow flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing"
          aria-label="Anruf annehmen oder Gesten verwenden"
      >
        <p className="text-sm text-primary animate-pulse">Nach oben wischen, um mit KI anzunehmen</p>
        <div className="flex items-center justify-center gap-x-16 my-8">
            <motion.div
                onTap={onEndCall}
                className="w-20 h-20 rounded-full bg-red-600/80 hover:bg-red-600 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                whileTap={{ scale: 1.1 }}
                aria-label="Anruf ablehnen"
            >
                <PhoneOff size={32} className="text-white" />
            </motion.div>
            <motion.div
                onTap={onAcceptCallManually}
                className="w-20 h-20 rounded-full bg-green-500/80 hover:bg-green-500 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                whileTap={{ scale: 1.1 }}
                aria-label="Anruf annehmen"
            >
                <Phone size={32} className="text-white" />
            </motion.div>
        </div>
        <p className="text-sm text-muted-foreground">Oder zum Ablehnen zur Seite/nach unten wischen</p>
      </motion.div>
    </div>
  );
};

export default IncomingCallControls;
