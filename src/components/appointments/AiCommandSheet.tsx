
import React, { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { useAiChat } from '@/hooks/useAiChat';
import { cn } from '@/lib/utils';

interface AiCommandSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AiCommandSheet: React.FC<AiCommandSheetProps> = ({ isOpen, onOpenChange }) => {
  const { getAiResponse } = useAiChat();
  const [messages, setMessages] = useState<{ id: number, text: string, sender: 'user' | 'ai' }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { id: Date.now(), text: input, sender: 'user' as const }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const aiResponse = await getAiResponse(newMessages, 'gemini');
    
    setIsLoading(false);

    if (aiResponse) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResponse, sender: 'ai' as const }]);
    }
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>KI-Assistentin</SheetTitle>
          <SheetDescription>
            Ich kann Aufgaben und Termine für dich verwalten. Was kann ich für dich tun?
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow flex flex-col">
          <ScrollArea className="flex-grow pr-4 -mr-6" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map(message => (
                <div key={message.id} className={cn("flex items-end gap-2", message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                  {message.sender === 'ai' && <Avatar className="h-8 w-8"><AvatarFallback>KI</AvatarFallback></Avatar>}
                  <div className={cn("rounded-lg px-3 py-2 max-w-[80%]", message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-end gap-2 justify-start">
                  <Avatar className="h-8 w-8"><AvatarFallback>KI</AvatarFallback></Avatar>
                  <div className="rounded-lg px-3 py-2 bg-muted">
                    <div className="flex items-center space-x-1">
                      <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="mt-4 flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder="z.B. Erstelle eine Aufgabe..."
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AiCommandSheet;
