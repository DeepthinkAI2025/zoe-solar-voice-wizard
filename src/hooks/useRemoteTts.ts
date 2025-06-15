
/**
 * Helper-Hook, um künftig TTS über eigenen /tts Endpoint anzusprechen.
 *
 * Verwendet: 
 *   - POST /tts mit Payload { text, voice, ... }
 * Erwartet als Antwort: Audio (z.B. audio/mp3 oder audio/wav)
 */
export function useRemoteTts() {
  // Rückgabewert: Funktion, um TTS anzustoßen und das Ergebnis zu spielen
  // Optionale Erweiterung: state für Ladevorgang/Error
  const speak = async (text: string, voice = 'default') => {
    try {
      // TODO: Backend-API, sobald bereit, aktivieren!
      // const response = await fetch('https://<YOUR_VM_URL>/tts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text, voice }),
      // });
      // if (!response.ok) throw new Error('TTS-Backend nicht erreichbar.');
      // const arrayBuffer = await response.arrayBuffer();
      // const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
      // const url = URL.createObjectURL(blob);
      // const audio = new Audio(url);
      // audio.play();

      // Demo: solange nicht fertig
      alert('Text-to-Speech Backend kommt bald. Text: ' + text);
    } catch (err) {
      alert('Fehler bei TTS: ' + (err instanceof Error ? err.message : err));
    }
  };

  return { speak };
}
