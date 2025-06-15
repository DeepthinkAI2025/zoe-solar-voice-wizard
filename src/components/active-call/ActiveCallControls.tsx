
import React from 'react';
import { PhoneOff, Mic, MicOff, Share, UserCheck, type LucideIcon, VolumeX, Volume2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface AudioDevice {
    id: string;
    name: string;
    icon: LucideIcon;
}

interface ActiveCallControlsProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isSpeakerMuted: boolean;
  onToggleSpeakerMute: () => void;
  agentId?: string;
  onForward?: () => void;
  onIntervene?: () => void;
  audioOutputs: AudioDevice[];
  selectedAudioDevice: AudioDevice;
  onAudioOutputChange: (id: string) => void;
  onEndCall: () => void;
}

const ActiveCallControls: React.FC<ActiveCallControlsProps> = ({
  isMuted,
  onToggleMute,
  isSpeakerMuted,
  onToggleSpeakerMute,
  agentId,
  onForward,
  onIntervene,
  audioOutputs,
  selectedAudioDevice,
  onAudioOutputChange,
  onEndCall,
}) => {
  return (
    <div className="flex w-full items-center justify-center gap-4">
      <button onClick={onToggleMute} className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-foreground transition-colors">
        {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
      </button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-foreground transition-colors">
            {isSpeakerMuted ? <VolumeX size={28} /> : <selectedAudioDevice.icon size={28} />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-popover border-border text-popover-foreground">
          <DropdownMenuItem
            onClick={onToggleSpeakerMute}
            className="flex items-center gap-2 cursor-pointer focus:bg-accent"
          >
            {isSpeakerMuted ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
            <span>{isSpeakerMuted ? 'Ton an' : 'Ton aus'}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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

      {agentId && onIntervene && (
        <button onClick={onIntervene} className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/80 hover:bg-blue-600 text-white transition-colors">
          <UserCheck size={28} />
        </button>
      )}

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
