
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";

export type AiProvider = 'gemini' | 'grok' | 'openrouter';

export interface ApiKeys {
    gemini: string;
    grok: string;
    openrouter: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const senderToGeminiRole = (sender: 'user' | 'ai'): 'user' | 'model' => {
    return sender === 'user' ? 'user' : 'model';
};

const senderToOpenAiRole = (sender: 'user' | 'ai'): 'user' | 'assistant' => {
    return sender === 'user' ? 'user' : 'assistant';
};

export const useAiChat = () => {
    const [apiKeys, setApiKeys] = useState<ApiKeys>({ gemini: '', grok: '', openrouter: '' });
    const { toast } = useToast();

    useEffect(() => {
        const storedKeys: ApiKeys = {
            gemini: localStorage.getItem('google_ai_api_key') || '',
            grok: localStorage.getItem('grok_api_key') || '',
            openrouter: localStorage.getItem('openrouter_api_key') || '',
        };
        setApiKeys(storedKeys);
    }, []);

    const saveApiKeys = (keys: Partial<ApiKeys>) => {
        const newKeys = { ...apiKeys, ...keys };
        if (keys.gemini !== undefined) localStorage.setItem('google_ai_api_key', keys.gemini);
        if (keys.grok !== undefined) localStorage.setItem('grok_api_key', keys.grok);
        if (keys.openrouter !== undefined) localStorage.setItem('openrouter_api_key', keys.openrouter);
        
        setApiKeys(newKeys);
        toast({ title: 'API-Schlüssel gespeichert.' });
    };

    const getAiResponse = useCallback(async (messages: Message[], provider: AiProvider): Promise<string | null> => {
        const apiKey = apiKeys[provider];
        if (!apiKey) {
            toast({
                title: 'API-Schlüssel fehlt',
                description: `Bitte hinterlege deinen ${provider.charAt(0).toUpperCase() + provider.slice(1)} API-Schlüssel.`,
                variant: 'destructive',
            });
            return null;
        }

        const systemPrompt = "Du bist Zoe, eine freundliche und hilfsbereite KI-Assistentin für Handwerker der Firma ZOE Solar. Deine Expertise liegt im Bereich Solartechnik und Photovoltaik. Antworte auf Deutsch. Sei präzise und kurz.";

        try {
            let response: Response;
            if (provider === 'gemini') {
                const apiMessages = messages.map(msg => ({
                    role: senderToGeminiRole(msg.sender),
                    parts: [{ text: msg.text }],
                }));

                response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: apiMessages.slice(-10),
                        systemInstruction: { parts: [{ text: systemPrompt }] },
                        generationConfig: { temperature: 0.7 },
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

            } else { // Groq and OpenRouter (OpenAI-compatible)
                const apiMessages = messages.map(msg => ({
                    role: senderToOpenAiRole(msg.sender),
                    content: msg.text,
                }));

                const body: {model: string, messages: any[], temperature: number, stream?: boolean} = {
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...apiMessages.slice(-10)
                    ],
                    temperature: 0.7,
                };

                let url = '';
                if (provider === 'grok') {
                    // Assuming user means Groq API (groq.com), which is OpenAI-compatible
                    url = 'https://api.groq.com/openai/v1/chat/completions';
                    body.model = 'llama3-8b-8192';
                } else if (provider === 'openrouter') {
                    url = 'https://openrouter.ai/api/v1/chat/completions';
                    body.model = 'mistralai/mistral-7b-instruct'; // A sensible default
                }
                
                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });
                
                const data = await response.json();
                if (!response.ok) {
                    console.error(`${provider} API error:`, data);
                    const errorMessage = data.error?.message || 'Unbekannter API Fehler';
                    throw new Error(errorMessage);
                }
                return data.choices?.[0]?.message?.content;
            }
        } catch (error) {
            console.error(`Fehler bei der Kommunikation mit der ${provider} API:`, error);
            const errorMessage = error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten.";
            toast({
                title: 'API Fehler',
                description: errorMessage,
                variant: 'destructive',
            });
            return null;
        }
    }, [apiKeys, toast]);

    const hasApiKey = (provider: AiProvider) => !!apiKeys[provider];

    return {
        apiKeys,
        saveApiKeys,
        getAiResponse,
        hasApiKey,
    };
};
