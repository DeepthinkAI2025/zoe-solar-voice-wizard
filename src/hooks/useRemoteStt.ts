
import { useState, useCallback } from 'react';

interface UseRemoteSttResult {
  isTranscribing: boolean;
  transcript: string;
  error: string | null;
  startTranscription: (audioBlob: Blob) => Promise<void>;
  reset: () => void;
}

/**
 * Hook, um künftig /stt (Whisper) Backend-API auf eigener VM für Spracherkennung anzusprechen.
 */
export function useRemoteStt(): UseRemoteSttResult {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const startTranscription = useCallback(async (audioBlob: Blob) => {
    setIsTranscribing(true);
    setTranscript('');
    setError(null);

    // TODO: Backend-API, sobald bereit, aktivieren!
    try {
      // const response = await fetch('https://<YOUR_VM_URL>/stt', {
      //   method: 'POST',
      //   body: audioBlob,
      // });
      // if (!response.ok) throw new Error('STT-Backend nicht erreichbar.');
      // const data = await response.json();
      // setTranscript(data.transcript || '');
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
