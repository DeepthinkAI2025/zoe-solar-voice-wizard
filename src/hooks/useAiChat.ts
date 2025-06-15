import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { manufacturers, Product } from '@/data/products';

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

    const searchProducts = useCallback((query?: string): string => {
        console.log(`Searching for products with query: "${query}"`);
        if (!query || query.trim() === '') {
            const allProducts = manufacturers.flatMap(m => m.products);
            return JSON.stringify(allProducts.slice(0, 5).map(p => ({ name: p.name, description: p.description })));
        }
        const lowercasedQuery = query.toLowerCase();
        const results: Product[] = [];
        for (const manufacturer of manufacturers) {
            for (const product of manufacturer.products) {
                if (
                    product.name.toLowerCase().includes(lowercasedQuery) ||
                    product.description.toLowerCase().includes(lowercasedQuery) ||
                    manufacturer.name.toLowerCase().includes(lowercasedQuery)
                ) {
                    results.push(product);
                }
            }
        }
        
        if (results.length === 0) {
            return JSON.stringify({ info: "Keine Produkte für diese Anfrage gefunden." });
        }
        return JSON.stringify(results.map(p => ({ name: p.name, description: p.description })));
    }, []);

    const availableTools = {
        search_products: searchProducts,
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

        const systemPrompt = "Du bist Zoe, eine freundliche und hilfsbereite KI-Assistentin für Handwerker der Firma ZOE Solar. Deine Expertise liegt im Bereich Solartechnik und Photovoltaik. Antworte auf Deutsch. Sei präzise und kurz. Du kannst die Produktdatenbank mit der Funktion 'search_products' durchsuchen, um Fragen zu Produkten zu beantworten. Gib die Suchergebnisse in einer für den Benutzer lesbaren Form zurück, z.B. als Liste.";

        try {
            let response: Response;
            if (provider === 'gemini') {
                const geminiTools = [{
                    functionDeclarations: [{
                        name: 'search_products',
                        description: 'Durchsuche die Produktdatenbank nach Name, Beschreibung oder Hersteller. Wenn kein Suchbegriff angegeben wird, werden alle Produkte zurückgegeben.',
                        parameters: { type: 'OBJECT', properties: { query: { type: 'STRING', description: 'Der Suchbegriff, z.B. "ecoTEC" oder "Buderus".' } } },
                    }]
                }];
                
                let apiMessages = messages.map(msg => ({ role: senderToGeminiRole(msg.sender), parts: [{ text: msg.text }] }));

                response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: apiMessages.slice(-10),
                        systemInstruction: { parts: [{ text: systemPrompt }] },
                        generationConfig: { temperature: 0.7 },
                        tools: geminiTools,
                    }),
                });

                let data = await response.json();
                if (!response.ok) {
                    console.error('Google Gemini API error:', data);
                    const errorMessage = data.error?.message || 'Unbekannter API Fehler';
                    throw new Error(errorMessage);
                }

                const part = data.candidates?.[0]?.content?.parts?.[0];
                if (part?.functionCall) {
                    const functionCall = part.functionCall;
                    const functionName = functionCall.name as keyof typeof availableTools;
                    const functionToCall = availableTools[functionName];

                    if (functionToCall) {
                        const functionArgs = functionCall.args || {};
                        console.log(`Gemini is calling function "${functionName}" with args:`, functionArgs);
                        const functionResponse = functionToCall(functionArgs.query);
                        
                        const newContents = [
                            ...apiMessages,
                            { role: 'model' as const, parts: [part] },
                            { role: 'function' as const, parts: [{ functionResponse: { name: functionName, response: { content: functionResponse } } }] }
                        ];

                        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                contents: newContents.slice(-10),
                                systemInstruction: { parts: [{ text: systemPrompt }] },
                                generationConfig: { temperature: 0.7 },
                            }),
                        });
                        data = await response.json();
                    }
                }
                
                if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    if (data.promptFeedback?.blockReason) { throw new Error(`Anfrage blockiert: ${data.promptFeedback.blockReason}. Bitte Anfrage anpassen.`); }
                    throw new Error('Keine gültige Antwort von der API erhalten.');
                }
                return data.candidates[0].content.parts[0].text;

            } else { // Groq and OpenRouter (OpenAI-compatible)
                const openAiTools = [{
                    type: 'function' as const,
                    function: {
                        name: 'search_products',
                        description: 'Durchsuche die Produktdatenbank nach Name, Beschreibung oder Hersteller. Wenn kein Suchbegriff angegeben wird, werden alle Produkte zurückgegeben.',
                        parameters: { type: 'object', properties: { query: { type: 'string', description: 'Der Suchbegriff, z.B. "ecoTEC" oder "Buderus".' } } },
                    },
                }];
                
                let apiMessages = messages.map(msg => ({ role: senderToOpenAiRole(msg.sender), content: msg.text }));
                
                let url = '', model = '';
                if (provider === 'grok') {
                    url = 'https://api.groq.com/openai/v1/chat/completions';
                    model = 'llama3-8b-8192';
                } else if (provider === 'openrouter') {
                    url = 'https://openrouter.ai/api/v1/chat/completions';
                    model = 'mistralai/mistral-7b-instruct';
                }
                
                let body = {
                    model,
                    messages: [ { role: 'system', content: systemPrompt }, ...apiMessages.slice(-10) ],
                    temperature: 0.7,
                    tools: openAiTools,
                    tool_choice: "auto" as const,
                };
                
                response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                
                let data = await response.json();

                if (!response.ok) {
                    console.error(`${provider} API error:`, data);
                    const errorMessage = data.error?.message || 'Unbekannter API Fehler';
                    throw new Error(errorMessage);
                }

                const messageFromApi = data.choices?.[0]?.message;
                if (messageFromApi?.tool_calls) {
                    const newApiMessages = [...apiMessages, messageFromApi];

                    for (const toolCall of messageFromApi.tool_calls) {
                        const functionName = toolCall.function.name as keyof typeof availableTools;
                        const functionToCall = availableTools[functionName];
                        if (functionToCall) {
                            const functionArgs = JSON.parse(toolCall.function.arguments);
                            console.log(`OpenAI compatible API is calling function "${functionName}" with args:`, functionArgs);
                            const functionResponse = functionToCall(functionArgs.query);
                            newApiMessages.push({
                                tool_call_id: toolCall.id,
                                role: 'tool',
                                content: functionResponse,
                            } as any);
                        }
                    }

                    body.messages = [ { role: 'system', content: systemPrompt }, ...newApiMessages.slice(-10) ];
                    // @ts-ignore
                    delete body.tools;
                    // @ts-ignore
                    delete body.tool_choice;

                    response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                    });
                    data = await response.json();

                     if (!response.ok) {
                        console.error(`${provider} API error (after tool call):`, data);
                        throw new Error(data.error?.message || 'Unbekannter API Fehler nach Tool-Aufruf');
                    }
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
    }, [apiKeys, toast, searchProducts]);

    const hasApiKey = (provider: AiProvider) => !!apiKeys[provider];

    return {
        apiKeys,
        saveApiKeys,
        getAiResponse,
        hasApiKey,
    };
};
