import React, { useState, useRef, useCallback } from 'react';
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
import type { AgentWithSettings } from '@/hooks/useAgentManagement';

interface VoiceCloneDialogProps {
  agent: AgentWithSettings | undefined;
  onClose: () => void;
  onUpload: () => void;
  onRecordComplete: (blob: Blob) => void;
}

export const VoiceCloneDialog: React.FC<VoiceCloneDialogProps> = ({
  agent,
  onClose,
  onUpload,
  onRecordComplete,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopRecordingAndCleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const handleRecordClick = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Audioaufnahme wird von Ihrem Browser nicht unterstützt.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        onRecordComplete(audioBlob);
        stopRecordingAndCleanup();
      };

      recorder.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Mikrofonzugriff verweigert. Bitte überprüfen Sie Ihre Browsereinstellungen.");
    }
  };

  const handleStopRecordingClick = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleClose = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.onstop = null; // Don't save on cancel
      mediaRecorderRef.current.stop();
    }
    stopRecordingAndCleanup();
    onClose();
  }, [onClose, stopRecordingAndCleanup]);

  if (!agent) return null;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        {isRecording ? (
          <>
            <DialogHeader>
              <DialogTitle>Aufnahme für {agent.name}</DialogTitle>
              <DialogDescription>Sprechen Sie jetzt. Klicken Sie auf "Stopp", wenn Sie fertig sind.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center gap-4 py-4">
                <Mic className="h-16 w-16 text-red-500 animate-pulse" />
                <p>Aufnahme läuft...</p>
            </div>
            <DialogFooter>
                <Button onClick={handleStopRecordingClick} variant="destructive">Aufnahme beenden</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Stimme für {agent.name} klonen</DialogTitle>
              <DialogDescription>
                Wähle eine Option, um eine neue Stimme für diesen Agenten zu erstellen. Die neue Stimme wird die bisherige ersetzen.
              </DialogDescription>
            </DialogHeader>
            {error && <p className="text-sm text-destructive py-2">{error}</p>}
            <div className="grid gap-4 py-4">
              <Button variant="outline" onClick={onUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Audio hochladen
              </Button>
              <Button variant="outline" onClick={handleRecordClick}>
                <Mic className="mr-2 h-4 w-4" />
                Audio aufnehmen
              </Button>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="ghost">Abbrechen</Button>
                </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
