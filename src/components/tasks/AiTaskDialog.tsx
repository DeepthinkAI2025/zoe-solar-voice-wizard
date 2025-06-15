
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Loader2 } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useAiChat } from '@/hooks/useAiChat';
import { useToast } from "@/components/ui/use-toast";

interface AiTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTasksGenerated: (tasks: Array<{ text: string; priority: 'high' | 'medium' | 'low' }>) => void;
}

const AiTaskDialog = ({ isOpen, onOpenChange, onTasksGenerated }: AiTaskDialogProps) => {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { getAiResponse, hasApiKey } = useAiChat();
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport
  } = useSpeechRecognition();

  React.useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast({
        title: "Eingabe erforderlich",
        description: "Bitte beschreibe, welche Aufgaben erstellt werden sollen.",
        variant: "destructive"
      });
      return;
    }

    if (!hasApiKey('gemini')) {
      toast({
        title: "API-Schlüssel fehlt",
        description: "Bitte konfiguriere zuerst einen API-Schlüssel im Chat.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    const systemPrompt = `Du bist ein Assistent für Handwerker. Erstelle aus der Benutzereingabe konkrete Aufgaben.

Regeln:
1. Jede Aufgabe soll konkret und umsetzbar sein
2. Teile komplexe Projekte in Einzelschritte auf
3. Vergib realistische Prioritäten (high/medium/low)
4. Antworte AUSSCHLIESSLICH im folgenden JSON-Format:

{
  "tasks": [
    {"text": "Aufgabentext", "priority": "high"},
    {"text": "Aufgabentext", "priority": "medium"}
  ]
}

Beispiel Input: "wir müssen bad renovieren und xyz material 4 stück besorgen"
Beispiel Output:
{
  "tasks": [
    {"text": "Material xyz - 4 Stück bestellen", "priority": "high"},
    {"text": "Badezimmer ausmessen und Planung erstellen", "priority": "high"},
    {"text": "Alte Fliesen entfernen", "priority": "medium"},
    {"text": "Neue Fliesen verlegen", "priority": "medium"}
  ]
}`;

    const messages = [
      { id: 1, text: systemPrompt, sender: 'ai' as const },
      { id: 2, text: input, sender: 'user' as const }
    ];

    try {
      const response = await getAiResponse(messages, 'gemini');
      
      if (response) {
        try {
          const parsed = JSON.parse(response);
          if (parsed.tasks && Array.isArray(parsed.tasks)) {
            onTasksGenerated(parsed.tasks);
            setInput('');
            onOpenChange(false);
            toast({
              title: "Aufgaben erstellt",
              description: `${parsed.tasks.length} neue Aufgaben wurden hinzugefügt.`
            });
          } else {
            throw new Error('Ungültiges Format');
          }
        } catch (parseError) {
          toast({
            title: "Fehler beim Verarbeiten",
            description: "KI-Antwort konnte nicht verarbeitet werden.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Aufgaben konnten nicht generiert werden.",
        variant: "destructive"
      });
    }

    setIsGenerating(false);
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      if (!hasRecognitionSupport) {
        toast({
          title: 'Nicht unterstützt',
          description: 'Spracherkennung wird in diesem Browser nicht unterstützt.',
          variant: 'destructive'
        });
        return;
      }
      startListening();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>KI-Aufgaben Generator</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Beschreibe dein Projekt oder was erledigt werden muss...&#10;&#10;Beispiel: 'Wir müssen das Bad renovieren und brauchen ABC Material 4 Stück'"
            className="min-h-[100px]"
            disabled={isGenerating}
          />
          
          <div className="flex space-x-2">
            {hasRecognitionSupport && (
              <Button
                onClick={handleMicClick}
                size="icon"
                variant={isListening ? "destructive" : "outline"}
                disabled={isGenerating}
              >
                <Mic className="h-4 w-4" />
              </Button>
            )}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !input.trim()}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generiere...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Aufgaben erstellen
                </>
              )}
            </Button>
          </div>
          
          {isListening && (
            <p className="text-sm text-center text-muted-foreground">
              🎤 Spreche jetzt...
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AiTaskDialog;
