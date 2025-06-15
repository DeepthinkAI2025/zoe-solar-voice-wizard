
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Mic } from 'lucide-react';
import type { aiAgents } from '@/data/mock';

type AgentWithSettings = (typeof aiAgents)[0] & {
  purpose: string;
  systemInstructions: string;
};

interface VoiceCloneDialogProps {
  agent: AgentWithSettings | undefined;
  onClose: () => void;
  onUpload: () => void;
  onRecord: () => void;
}

export const VoiceCloneDialog: React.FC<VoiceCloneDialogProps> = ({
  agent,
  onClose,
  onUpload,
  onRecord,
}) => {
  if (!agent) return null;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stimme für {agent.name} klonen</DialogTitle>
          <DialogDescription>
            Wähle eine Option, um eine neue Stimme für diesen Agenten zu erstellen. Die neue Stimme wird die bisherige ersetzen.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button variant="outline" onClick={onUpload}>
            <Upload className="mr-2 h-4 w-4" />
            Audio hochladen
          </Button>
          <Button variant="outline" onClick={onRecord}>
            <Mic className="mr-2 h-4 w-4" />
            Audio aufnehmen
          </Button>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button variant="ghost">Abbrechen</Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
