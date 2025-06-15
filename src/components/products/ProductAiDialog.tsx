
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Loader2 } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useAiChat } from '@/hooks/useAiChat';
import { useToast } from "@/components/ui/use-toast";
import { Product } from '@/data/products';

interface ProductAiDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

const ProductAiDialog = ({ isOpen, onOpenChange, product }: ProductAiDialogProps) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
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
    if (isListening) {
        setInput(transcript);
    }
  }, [transcript, isListening]);
  
  React.useEffect(() => {
    // Reset state when dialog opens or product changes
    if (isOpen) {
        setInput('');
        setResponse('');
    }
  }, [isOpen, product]);


  const handleAsk = async () => {
    if (!input.trim()) {
      toast({
        title: "Eingabe erforderlich",
        description: "Bitte stelle eine Frage zum Produkt.",
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
    setResponse('');

    const productInfo = `
Produktname: ${product.name}
Beschreibung: ${product.description}
Video: ${product.videoUrl}
${product.datasheets ? `Verfügbare Datenblätter: ${product.datasheets.join(', ')}` : ''}
${product.manuals ? `Verfügbare Handbücher: ${product.manuals.join(', ')}` : ''}
${product.installationGuides ? `Verfügbare Installationsanleitungen: ${product.installationGuides.join(', ')}` : ''}
`;

    const systemPrompt = `Du bist ein Experte für Heizungstechnik und Installationen. 
Ein Handwerker fragt dich zu folgendem Produkt:

${productInfo}

Beantworte die Frage basierend auf den verfügbaren Informationen. 
Wenn spezifische Details in Datenblättern oder Anleitungen stehen würden, weise darauf hin.
Sei präzise und praxisorientiert. Gib konkrete Schritte wenn nach Installation gefragt wird.`;

    const messages = [
      { id: 1, text: systemPrompt, sender: 'ai' as const },
      { id: 2, text: input, sender: 'user' as const }
    ];

    try {
      const aiResponse = await getAiResponse(messages, 'gemini');
      
      if (aiResponse) {
        setResponse(aiResponse);
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Antwort konnte nicht generiert werden.",
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Produkt-KI für {product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Frage zur Installation, Anschluss oder Technik...&#10;&#10;Beispiel: 'Wie schließe ich das Gerät an den Gasanschluss an?'"
            className="min-h-[80px]"
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
              onClick={handleAsk}
              disabled={isGenerating || !input.trim()}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analysiere...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Fragen
                </>
              )}
            </Button>
          </div>
          
          {isListening && (
            <p className="text-sm text-center text-muted-foreground">
              🎤 Spreche jetzt...
            </p>
          )}

          {isGenerating && !response && (
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg flex items-center justify-center">
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 KI denkt nach...
            </div>
          )}

          {response && (
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
              <h4 className="font-semibold mb-2">KI-Antwort:</h4>
              <p className="text-sm whitespace-pre-wrap">{response}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductAiDialog;
