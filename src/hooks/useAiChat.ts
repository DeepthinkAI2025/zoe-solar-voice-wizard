
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

// Map local message sender to API role for Gemini
const senderToRole = (sender: 'user' | 'ai'): 'user' | 'model' => {
    return sender === 'user' ? 'user' : 'model';
};

export const useAiChat = () => {
    const [apiKey, setApiKey] = useState<string>('');
    const { toast } = useToast();

    useEffect(() => {
        const storedApiKey = localStorage.getItem('google_ai_api_key');
        if (storedApiKey) {
            setApiKey(storedApiKey);
        }
    }, []);

    const saveApiKey = (key: string) => {
        if (key.trim()) {
            localStorage.setItem('google_ai_api_key', key);
            setApiKey(key);
            toast({ title: 'API-Schlüssel gespeichert.' });
        }
    };

    const getAiResponse = useCallback(async (messages: Message[]): Promise<string | null> => {
        if (!apiKey) {
            toast({
                title: 'API-Schlüssel fehlt',
                description: 'Bitte hinterlege deinen Google AI API-Schlüssel.',
                variant: 'destructive',
            });
            return null;
        }

        // Gemini API requires alternating user/model roles. This ensures it.
        const validMessages = messages.reduce((acc, current) => {
            if (acc.length > 0 && acc[acc.length - 1].sender === current.sender) {
                acc.pop(); // Remove previous message from same sender
            }
            acc.push(current);
            return acc;
        }, [] as Message[]);
        
        const apiMessages = validMessages.map(msg => ({
            role: senderToRole(msg.sender),
            parts: [{ text: msg.text }],
        }));

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: apiMessages.slice(-10), // Send last 10 messages for context
                    systemInstruction: {
                        parts: [{
                            text: "Du bist Zoe, eine freundliche und hilfsbereite KI-Assistentin für Handwerker der Firma ZOE Solar. Deine Expertise liegt im Bereich Solartechnik und Photovoltaik. Antworte auf Deutsch. Sei präzise und kurz."
                        }]
                    },
                    generationConfig: {
                        temperature: 0.7,
                    }
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Google Gemini API error:', data);
                const errorMessage = data.error?.message || 'Unbekannter API Fehler';
                throw new Error(errorMessage);
            }

            if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
                if (data.promptFeedback?.blockReason) {
                    throw new Error(`Anfrage blockiert: ${data.promptFeedback.blockReason}. Bitte Anfrage anpassen.`);
                }
                throw new Error('Keine gültige Antwort von der API erhalten.');
            }

            return data.candidates[0].content.parts[0].text;

        } catch (error) {
            console.error("Fehler bei der Kommunikation mit der Google Gemini API:", error);
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
