
import React, { useState, useEffect, useRef } from 'react';
import AiChatAnimation from '@/components/craftsman/AiChatAnimation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, Send, KeyRound } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useToast } from "@/components/ui/use-toast";
import { useAiChat } from '@/hooks/useAiChat';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const AiChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hallo! Ich bin Zoe, deine KI-Assistentin. Du kannst mir eine Nachricht schreiben oder das Mikrofon benutzen, um mit mir zu sprechen.", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');

  const {
      saveApiKey,
      getAiResponse,
      isApiKeySet
  } = useAiChat();

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport,
    error,
  } = useSpeechRecognition();

  useEffect(() => {
    // Live-Transkript im Input-Feld anzeigen
    setInput(transcript);
  }, [transcript]);
  
  useEffect(() => {
    if (error) {
        toast({
            title: 'Fehler bei der Spracherkennung',
            description: `Fehler: ${error}`,
            variant: 'destructive',
        });
    }
  }, [error, toast]);
  
  useEffect(() => {
    if (scrollAreaViewportRef.current) {
        scrollAreaViewportRef.current.scrollTop = scrollAreaViewportRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSaveApiKey = () => {
    saveApiKey(tempApiKey);
    setIsApiKeyModalOpen(false);
    setTempApiKey('');
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isTyping) return;
    if (!isApiKeySet) {
        toast({
            title: "API-Schlüssel fehlt",
            description: "Bitte klicke auf das Schlüssel-Symbol, um deinen API-Schlüssel einzugeben.",
            variant: "destructive"
        })
        setIsApiKeyModalOpen(true);
        return;
    }
    if (isListening) {
      stopListening();
    }

    const newUserMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };
    
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    const aiResponseText = await getAiResponse(newMessages);
      
    if (aiResponseText) {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: 'ai',
      };
      setMessages(prev => [...prev, aiResponse]);
    } else {
        // Handle error case, put back the original message in input and remove optimistic message
        setInput(currentInput);
        setMessages(messages);
        toast({
            title: 'Senden fehlgeschlagen',
            description: 'Die Nachricht konnte nicht verarbeitet werden. Bitte prüfe deinen API-Schlüssel.',
            variant: 'destructive',
        })
    }

    setIsTyping(false);
  };
  
  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      if (!hasRecognitionSupport) {
         toast({
            title: 'Nicht unterstützt',
            description: 'Spracherkennung wird in diesem Browser nicht unterstützt.',
            variant: 'destructive',
        });
        return;
      }
      startListening();
    }
  };

  // Send message when user stops talking
  useEffect(() => {
      if (!isListening && transcript.trim()) {
          handleSendMessage();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow" viewportRef={scrollAreaViewportRef}>
        <div className="p-4 space-y-4 pb-4 min-h-[calc(100%-4rem)] flex flex-col">
          <div className="flex-grow space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
              <AiChatAnimation isListening={isListening} />
          </div>
        </div>
      </ScrollArea>
      
      {isTyping && (
        <div className="flex items-center px-4 pb-2 text-sm text-muted-foreground">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-1"
          >
            <span>Zoe tippt</span>
            <motion.span animate={{y: [0, -2, 0]}} transition={{repeat: Infinity, duration: 0.8, delay: 0}}>.</motion.span>
            <motion.span animate={{y: [0, -2, 0]}} transition={{repeat: Infinity, duration: 0.8, delay: 0.2}}>.</motion.span>
            <motion.span animate={{y: [0, -2, 0]}} transition={{repeat: Infinity, duration: 0.8, delay: 0.4}}>.</motion.span>
          </motion.div>
        </div>
      )}
      
      <div className="flex items-center space-x-2 p-4 border-t">
        <Button 
          onClick={() => setIsApiKeyModalOpen(true)} 
          size="icon" 
          variant="outline" 
          className={cn(!isApiKeySet && "animate-pulse border-destructive hover:border-destructive text-destructive-foreground")}
        >
            <KeyRound className="h-4 w-4" />
        </Button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={isListening ? "Ich höre zu..." : "Mit Zoe sprechen oder tippen..."}
          className="flex-grow"
          disabled={isTyping}
        />
        {hasRecognitionSupport && (
           <Button onClick={handleMicClick} size="icon" variant={isListening ? "destructive" : "outline"} disabled={isTyping}>
              <Mic className="h-4 w-4" />
          </Button>
        )}
        <Button onClick={handleSendMessage} size="icon" disabled={isTyping || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <AlertDialog open={isApiKeyModalOpen} onOpenChange={setIsApiKeyModalOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Perplexity API-Schlüssel</AlertDialogTitle>
                <AlertDialogDescription>
                    Um die KI-Chat-Funktion zu nutzen, gib bitte deinen Perplexity API-Schlüssel ein. Er wird sicher in deinem Browser gespeichert.
                    Wir empfehlen, für eine sichere Verwaltung deiner Schlüssel unsere Supabase-Integration zu nutzen.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <Input 
                placeholder="API-Schlüssel hier einfügen"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                type="password"
            />
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setTempApiKey('')}>Abbrechen</AlertDialogCancel>
                <AlertDialogAction onClick={handleSaveApiKey} disabled={!tempApiKey.trim()}>Speichern</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AiChatScreen;
