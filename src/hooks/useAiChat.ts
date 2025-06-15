
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

// Map local message sender to API role
const senderToRole = (sender: 'user' | 'ai'): 'user' | 'assistant' => {
    return sender === 'user' ? 'user' : 'assistant';
};

export const useAiChat = () => {
    const [apiKey, setApiKey] = useState<string>('');
    const { toast } = useToast();

    useEffect(() => {
        const storedApiKey = localStorage.getItem('perplexity_api_key');
        if (storedApiKey) {
            setApiKey(storedApiKey);
        }
    }, []);

    const saveApiKey = (key: string) => {
        if (key.trim()) {
            localStorage.setItem('perplexity_api_key', key);
            setApiKey(key);
            toast({ title: 'API-Schlüssel gespeichert.' });
        }
    };

    const getAiResponse = useCallback(async (messages: Message[]): Promise<string | null> => {
        if (!apiKey) {
            toast({
                title: 'API-Schlüssel fehlt',
                description: 'Bitte hinterlege deinen Perplexity API-Schlüssel.',
                variant: 'destructive',
            });
            return null;
        }

        const systemMessage = {
            role: 'system',
            content: "Du bist Zoe, eine freundliche und hilfsbereite KI-Assistentin für Handwerker der Firma ZOE Solar. Antworte auf Deutsch. Sei präzise und kurz."
        };
        
        const apiMessages = messages.map(msg => ({
            role: senderToRole(msg.sender),
            content: msg.text,
        }));

        try {
            const response = await fetch('https://api.perplexity.ai/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama-3.1-sonar-small-128k-online',
                    messages: [systemMessage, ...apiMessages.slice(-10)], // Send last 10 messages for context
                    temperature: 0.7,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Perplexity API error:', errorData);
                throw new Error(errorData.error?.message || 'Unbekannter API Fehler');
            }

            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error) {
            console.error("Fehler bei der Kommunikation mit der Perplexity API:", error);
            const errorMessage = error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten.";
            toast({
                title: 'API Fehler',
                description: errorMessage,
                variant: 'destructive',
            });
            return null;
        }
    }, [apiKey, toast]);

    return {
        apiKey,
        saveApiKey,
        getAiResponse,
        isApiKeySet: !!apiKey,
    };
};
