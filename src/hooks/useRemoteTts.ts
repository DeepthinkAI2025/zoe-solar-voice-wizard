
/**
 * Hook für TTS (Dia) über eigenen /tts Endpoint (Google Cloud VM)
 *
 * POST /tts
 *   - Body: { text, voice }
 *   - Response: Audio (audio/mp3 oder audio/wav als Binary)
 */
export function useRemoteTts() {
  /**
   * Lässt einen Text per POST /tts sprechen.
   * Der Audio-Stream wird nach erfolgreichem Abruf direkt abgespielt.
   */
  const speak = async (text: string, voice = 'default') => {
    try {
      // Bitte hier eure echte VM-URL eintragen!
      const VM_URL = "https://<YOUR_VM_URL>";
      // UNKOMMENTIEREN sobald Backend bereit!
      /*
      const response = await fetch(`${VM_URL}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      });
      if (!response.ok) throw new Error('TTS-Backend nicht erreichbar.');
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' }); // Oder audio/wav, je nach Response
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      */
      // Platzhalter für Demo:
      alert('Text-to-Speech Backend kommt bald. Text: ' + text);
    } catch (err) {
      alert('Fehler bei TTS: ' + (err instanceof Error ? err.message : err));
    }
  };

  return { speak };
}
