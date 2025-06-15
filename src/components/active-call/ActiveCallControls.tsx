
import React from 'react';
import { PhoneOff, Mic, MicOff, Share, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AudioDevice {
    id: string;
    name: string;
    icon: LucideIcon;
}

interface ActiveCallControlsProps {
  isMuted: boolean;
  onToggleMute: () => void;
  agentId?: string;
  onForward?: () => void;
  audioOutputs: AudioDevice[];
  selectedAudioDevice: AudioDevice;
  onAudioOutputChange: (id: string) => void;
  onEndCall: () => void;
}

const ActiveCallControls: React.FC<ActiveCallControlsProps> = ({
  isMuted,
  onToggleMute,
  agentId,
  onForward,
  audioOutputs,
  selectedAudioDevice,
  onAudioOutputChange,
  onEndCall,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className={cn(
        "grid gap-x-6 mb-8",
        !agentId && onForward ? "grid-cols-3" : "grid-cols-2"
      )}>
        <button onClick={onToggleMute} className="flex flex-col items-center justify-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
          <div className="w-16 h-16 rounded-full bg-secondary hover:bg-accent flex items-center justify-center">
            {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
          </div>
          <span className="text-xs">{isMuted ? 'Ton an' : 'Stumm'}</span>
        </button>
        
        {!agentId && onForward && (
          <button onClick={onForward} className="flex flex-col items-center justify-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
            <div className="w-16 h-16 rounded-full bg-secondary hover:bg-accent flex items-center justify-center">
              <Share size={28} />
            </div>
            <span className="text-xs">Weiterleiten</span>
          </button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex flex-col items-center justify-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
              <div className="w-16 h-16 rounded-full bg-secondary hover:bg-accent flex items-center justify-center">
                <selectedAudioDevice.icon size={28} />
              </div>
              <span className="text-xs">{selectedAudioDevice.name}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover border-border text-popover-foreground">
            {audioOutputs.map((output) => (
              <DropdownMenuItem
                key={output.id}
                onClick={() => onAudioOutputChange(output.id)}
                className="flex items-center gap-2 cursor-pointer focus:bg-accent"
              >
                <output.icon className="w-4 h-4 mr-2" />
                <span>{output.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <button onClick={onEndCall} className="w-20 h-20 rounded-full bg-red-600/80 hover:bg-red-600 flex items-center justify-center transition-transform hover:scale-105">
        <PhoneOff size={32} className="text-white" />
      </button>
    </div>
  );
};

export default ActiveCallControls;
