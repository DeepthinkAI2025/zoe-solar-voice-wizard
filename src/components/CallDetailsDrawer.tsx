
import React, { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from './ui/button';
import { Play, FileText, Bot, Phone, X, Pause } from 'lucide-react';

interface CallDetailsDrawerProps {
  call: {
    name: string;
    number?: string;
    type: string;
    time: string;
    summary: string | null;
    transcript: string[] | null;
    duration?: string;
  } | null;
  onClose: () => void;
  onStartCall: (number: string) => void;
  onStartCallManually: (number: string) => void;
}

const CallDetailsDrawer: React.FC<CallDetailsDrawerProps> = ({ call, onClose, onStartCall, onStartCallManually }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!call) return null;

  const displayName = (call.name === 'Unbekannter Anrufer' || call.name === 'Unbekannt') && call.number && call.number !== 'Unbekannt' ? call.number : call.name;

  const handleCallback = () => {
    if (call?.number) {
      onClose();
      onStartCallManually(call.number);
    }
  };

  const handleAiCallback = () => {
    if (call?.number) {
      onClose();
      onStartCall(call.number);
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying(prev => {
      if (!prev) {
        console.log("Audio playback started.");
      } else {
        console.log("Audio playback paused.");
      }
      return !prev;
    });
  };

  const shouldShowCallbackButtons = call.number && call.number !== 'Unbekannt';

  return (
    <Drawer open={!!call} onOpenChange={(open) => {
      if (!open) {
        setIsPlaying(false);
        onClose();
      }
    }}>
      <DrawerContent>
        <DrawerHeader className="text-left relative">
          <DrawerTitle>{displayName}</DrawerTitle>
          <DrawerDescription>
            {call.type} - {call.time}
          </DrawerDescription>
          <DrawerClose asChild className="absolute right-4 top-4">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
              <span className="sr-only">Schließen</span>
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="p-4 space-y-6 max-h-[60vh] overflow-y-auto">
          {call.summary && (
            <div>
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2"><Bot size={16} /> KI-Zusammenfassung</h3>
              <p className="text-muted-foreground bg-white/5 p-3 rounded-lg text-sm">{call.summary}</p>
            </div>
          )}
          
          <div>
            <h3 className="font-semibold text-white mb-2">Audio</h3>
            <Button
              variant="ghost"
              className="w-full justify-between items-center bg-white/5 hover:bg-white/10 p-3 rounded-lg h-auto"
              onClick={handleTogglePlay}
            >
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm font-normal">Aufnahme abhören</span>
                {call.duration && <span className="text-muted-foreground text-xs">({call.duration})</span>}
              </div>
              {isPlaying ? <Pause className="text-primary" /> : <Play className="text-primary" />}
            </Button>
          </div>

          {call.transcript && (
            <div>
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2"><FileText size={16}/> Gesprächsprotokoll</h3>
              <div className="space-y-3 bg-white/5 p-3 rounded-lg max-h-48 overflow-y-auto">
                {call.transcript.map((line, i) => (
                  <p key={i} className="text-muted-foreground text-sm">{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>
        <DrawerFooter>
          {shouldShowCallbackButtons && (
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Button variant="outline" className="w-full" onClick={handleCallback}>
                <Phone size={16} className="mr-2" />
                Zurückrufen
              </Button>
              <Button variant="outline" className="w-full" onClick={handleAiCallback}>
                <Bot size={16} className="mr-2" />
                KI ruft zurück
              </Button>
            </div>
          )}
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Schließen</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CallDetailsDrawer;
