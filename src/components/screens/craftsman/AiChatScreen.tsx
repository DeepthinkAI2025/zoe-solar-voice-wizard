import React, { useState, useEffect, useRef } from 'react';
import ModernAiAnimation from '@/components/craftsman/ModernAiAnimation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, Send, KeyRound } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useToast } from "@/components/ui/use-toast";
import { useAiChat, AiProvider, ApiKeys } from '@/hooks/useAiChat';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import { useRemoteStt } from '@/hooks/useRemoteStt';
import { useRemoteTts } from '@/hooks/useRemoteTts';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const AiChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    text: "Hallo! Ich bin Zoe, deine KI-Assistentin. Du kannst mir eine Nachricht schreiben oder das Mikrofon benutzen, um mit mir zu sprechen.",
    sender: 'ai'
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const {
    toast
  } = useToast();
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [provider, setProvider] = useState<AiProvider>('gemini');
  const [tempApiKeys, setTempApiKeys] = useState<ApiKeys>({
    gemini: '',
    deepseek: '',
    openrouter: ''
  });
  const {
    apiKeys,
    saveApiKeys,
    getAiResponse,
    hasApiKey
  } = useAiChat();
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport,
    error
  } = useSpeechRecognition();

  useEffect(() => {
    setInput(transcript);
  }, [transcript]);
  useEffect(() => {
    if (error) {
      toast({
        title: 'Fehler bei der Spracherkennung',
        description: `Fehler: ${error}`,
        variant: 'destructive'
      });
    }
  }, [error, toast]);
  useEffect(() => {
    if (scrollAreaViewportRef.current) {
      scrollAreaViewportRef.current.scrollTop = scrollAreaViewportRef.current.scrollHeight;
    }
  }, [messages, isTyping]);
  useEffect(() => {
    if (isApiKeyModalOpen) {
      setTempApiKeys(apiKeys);
    }
  }, [isApiKeyModalOpen, apiKeys]);

  const handleSaveApiKeys = () => {
    saveApiKeys(tempApiKeys);
    setIsApiKeyModalOpen(false);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isTyping) return;
    if (!hasApiKey(provider)) {
      toast({
        title: "API-Schlüssel fehlt",
        description: `Bitte klicke auf das Schlüssel-Symbol, um deinen ${provider.charAt(0).toUpperCase() + provider.slice(1)} API-Schlüssel einzugeben.`,
        variant: "destructive"
      });
      setIsApiKeyModalOpen(true);
      return;
    }
    if (isListening) {
      stopListening();
    }
    const newUserMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user'
    };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    const currentInput = input;
    setInput('');
    setIsTyping(true);
    const aiResponseText = await getAiResponse(newMessages, provider);
    if (aiResponseText) {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiResponse]);
    } else {
      setInput(currentInput);
      setMessages(messages);
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
          variant: 'destructive'
        });
        return;
      }
      startListening();
    }
  };

  const { speak } = useRemoteTts();

  useEffect(() => {
    if (!isListening && transcript.trim()) {
      handleSendMessage();
    }
  }, [isListening]);

  return <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow" viewportRef={scrollAreaViewportRef}>
        <div className="p-4 space-y-4 pb-4 min-h-[calc(100%-4rem)] flex flex-col">
          <div className="flex-grow space-y-4">
            <AnimatePresence>
              {messages.map(message => <motion.div key={message.id} layout initial={{
              opacity: 0,
              y: 20,
              scale: 0.95
            }} animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }} exit={{
              opacity: 0,
              y: -10,
              scale: 0.95
            }} transition={{
              duration: 0.3
            }} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="">
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                </motion.div>)}
            </AnimatePresence>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
              <ModernAiAnimation isListening={isListening} />
          </div>
        </div>
      </ScrollArea>
      
      {isTyping && <div className="flex items-center px-4 pb-2 text-sm text-muted-foreground">
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} className="flex items-center space-x-1">
            <span>Zoe tippt</span>
            <motion.span animate={{
          y: [0, -2, 0]
        }} transition={{
          repeat: Infinity,
          duration: 0.8,
          delay: 0
        }}>.</motion.span>
            <motion.span animate={{
          y: [0, -2, 0]
        }} transition={{
          repeat: Infinity,
          duration: 0.8,
          delay: 0.2
        }}>.</motion.span>
            <motion.span animate={{
          y: [0, -2, 0]
        }} transition={{
          repeat: Infinity,
          duration: 0.8,
          delay: 0.4
        }}>.</motion.span>
          </motion.div>
        </div>}
      
      <div className="flex items-center space-x-2 p-4 border-t">
        <Button onClick={() => setIsApiKeyModalOpen(true)} size="icon" variant="outline" className={cn(!hasApiKey(provider) && "animate-pulse border-destructive hover:border-destructive text-destructive-foreground")}>
            <KeyRound className="h-4 w-4" />
        </Button>
        <Select value={provider} onValueChange={value => setProvider(value as AiProvider)}>
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Anbieter" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
                <SelectItem value="openrouter">OpenRouter</SelectItem>
            </SelectContent>
        </Select>
        <Input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder={isListening ? "Ich höre zu..." : "Mit Zoe sprechen oder tippen..."} className="flex-grow" disabled={isTyping} />
        {hasRecognitionSupport && <Button onClick={handleMicClick} size="icon" variant={isListening ? "destructive" : "outline"} disabled={isTyping}>
              <Mic className="h-4 w-4" />
          </Button>}
        <Button onClick={handleSendMessage} size="icon" disabled={isTyping || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <AlertDialog open={isApiKeyModalOpen} onOpenChange={setIsApiKeyModalOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>API-Schlüssel verwalten</AlertDialogTitle>
                <AlertDialogDescription>
                    Gib hier deine API-Schlüssel für die verschiedenen KI-Anbieter ein. Sie werden sicher in deinem Browser gespeichert.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="gemini-key">Google Gemini</Label>
                    <Input id="gemini-key" placeholder="API-Schlüssel hier einfügen" value={tempApiKeys.gemini} onChange={e => setTempApiKeys(k => ({
              ...k,
              gemini: e.target.value
            }))} type="password" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="deepseek-key">DeepSeek (OpenRouter)</Label>
                    <Input id="deepseek-key" placeholder="API-Schlüssel hier einfügen" value={tempApiKeys.deepseek} onChange={e => setTempApiKeys(k => ({
              ...k,
              deepseek: e.target.value
            }))} type="password" />
                    <div className="text-xs text-muted-foreground">Alternativ funktioniert auch der OpenRouter Schlüssel.</div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="openrouter-key">OpenRouter</Label>
                    <Input id="openrouter-key" placeholder="API-Schlüssel hier einfügen" value={tempApiKeys.openrouter} onChange={e => setTempApiKeys(k => ({
              ...k,
              openrouter: e.target.value
            }))} type="password" />
                </div>
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction onClick={handleSaveApiKeys}>Speichern</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};

export default AiChatScreen;
