
import React from 'react';
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
import { Play, FileText, Bot } from 'lucide-react';

interface CallDetailsDrawerProps {
  call: {
    name: string;
    type: string;
    time: string;
    summary: string | null;
    transcript: string[] | null;
  } | null;
  onClose: () => void;
}

const CallDetailsDrawer: React.FC<CallDetailsDrawerProps> = ({ call, onClose }) => {
  if (!call) return null;

  return (
    <Drawer open={!!call} onClose={onClose} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{call.name}</DrawerTitle>
          <DrawerDescription>
            {call.type} - {call.time}
          </DrawerDescription>
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
            <div className="bg-white/5 p-3 rounded-lg flex items-center justify-between">
              <p className="text-muted-foreground text-sm">Aufnahme abhören</p>
              <Button size="icon" variant="ghost">
                <Play className="text-primary" />
              </Button>
            </div>
          </div>

          {call.transcript && (
            <div>
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2"><FileText size={16}/> Gesprächsprotokoll</h3>
              <div className="space-y-3 bg-white/5 p-3 rounded-lg">
                {call.transcript.map((line, i) => (
                  <p key={i} className="text-muted-foreground text-sm">{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Schließen</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CallDetailsDrawer;
