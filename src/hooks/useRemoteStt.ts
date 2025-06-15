
import { useState, useCallback } from 'react';

interface UseRemoteSttResult {
  isTranscribing: boolean;
  transcript: string;
  error: string | null;
  startTranscription: (audioBlob: Blob) => Promise<void>;
  reset: () => void;
}

/**
 * Hook für STT (Whisper) über eigenen /stt Endpoint (Google Cloud VM)
 *
 * POST /stt
 *   - Body: Audio (audio/wav, audio/webm oder mp3 als Blob)
 *   - Response: { transcript: string }
 */
export function useRemoteStt(): UseRemoteSttResult {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const startTranscription = useCallback(async (audioBlob: Blob) => {
    setIsTranscribing(true);
    setTranscript('');
    setError(null);

    try {
      // Bitte hier eure echte VM-URL eintragen!
      const VM_URL = "https://<YOUR_VM_URL>";
      // UNKOMMENTIEREN sobald Backend bereit!
      /*
      const response = await fetch(`${VM_URL}/stt`, {
        method: 'POST',
        headers: {
          // Kein Content-Type: multipart/form-data, nur raw Blob
        },
        body: audioBlob,
      });
      if (!response.ok) throw new Error('STT-Backend nicht erreichbar.');
      const data = await response.json();
      setTranscript(data.transcript || '');
      */
      // Platzhalter für Demo:
      setTranscript('(Demo) Spracherkennung über /stt-Backend kommt bald.');
    } catch (err) {
      setError('Fehler beim Transkribieren: ' + (err instanceof Error ? err.message : err));
    }
    setIsTranscribing(false);
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setError(null);
    setIsTranscribing(false);
  }, []);

  return { isTranscribing, transcript, error, startTranscription, reset };
}
