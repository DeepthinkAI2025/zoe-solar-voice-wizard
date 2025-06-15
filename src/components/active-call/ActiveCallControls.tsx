
import React from 'react';
import { PhoneOff, Mic, MicOff, Share, type LucideIcon } from 'lucide-react';
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
    <div className="flex w-full items-center justify-center gap-6">
      <button onClick={onToggleMute} className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-foreground transition-colors">
        {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
      </button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-foreground transition-colors">
            <selectedAudioDevice.icon size={28} />
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

      {!agentId && onForward && (
        <button onClick={onForward} className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-foreground transition-colors">
          <Share size={28} />
        </button>
      )}
      
      <button onClick={onEndCall} className="w-20 h-20 rounded-full bg-red-600/80 hover:bg-red-600 flex items-center justify-center transition-transform hover:scale-105">
        <PhoneOff size={32} className="text-white" />
      </button>
    </div>
  );
};

export default ActiveCallControls;
