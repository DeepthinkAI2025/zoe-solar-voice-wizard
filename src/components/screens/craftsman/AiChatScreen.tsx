
import React, { useState } from 'react';
import AiChatAnimation from '@/components/craftsman/AiChatAnimation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const AiChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hallo! Wie kann ich dir heute helfen? Du kannst mir Befehle geben oder Fragen stellen.", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (input.trim() === '' || isTyping) return;

    const newUserMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: `Ich verarbeite deine Anfrage: "${input}".\n\nDie Anbindung an deine Systeme wird bald verfügbar sein, um Aktionen wie "Markiere Aufgabe X als erledigt" auszuführen.`,
        sender: 'ai',
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  // Show animation only when AI has sent the last message and isn't typing a new one.
  const showAnimation = messages[messages.length - 1]?.sender === 'ai' && !isTyping;

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4 pb-4">
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
      </ScrollArea>
      
      {showAnimation && (
        <div className="flex justify-center items-center h-40 -mt-10 -mb-4">
            <AiChatAnimation />
        </div>
      )}

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
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Mit Zoe sprechen oder tippen..."
          className="flex-grow"
          disabled={isTyping}
        />
        <Button onClick={handleSendMessage} size="icon" disabled={isTyping || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AiChatScreen;
