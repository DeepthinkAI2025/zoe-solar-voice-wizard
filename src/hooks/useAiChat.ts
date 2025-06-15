import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { manufacturers, Product } from '@/data/products';
import { useTasks } from './useTasks';
import { useAppointments } from './useAppointments';

export type AiProvider = 'gemini' | 'deepseek' | 'openrouter';
export interface ApiKeys {
    gemini: string;
    deepseek: string;
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
    const [apiKeys, setApiKeys] = useState<ApiKeys>({ gemini: '', deepseek: '', openrouter: '' });
    const { toast } = useToast();
    const { taskList, handleAddTask, handleToggle, handleUpdateTask } = useTasks();
    const { appointments, addAppointment, updateAppointmentStatus } = useAppointments();


    useEffect(() => {
        const storedKeys: ApiKeys = {
            gemini: localStorage.getItem('google_ai_api_key') || '',
            deepseek: localStorage.getItem('deepseek_api_key') || '',
            openrouter: localStorage.getItem('openrouter_api_key') || '',
        };
        setApiKeys(storedKeys);
    }, []);

    const saveApiKeys = (keys: Partial<ApiKeys>) => {
        const newKeys = { ...apiKeys, ...keys };
        if (keys.gemini !== undefined) localStorage.setItem('google_ai_api_key', keys.gemini);
        if (keys.deepseek !== undefined) localStorage.setItem('deepseek_api_key', keys.deepseek);
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
        add_task: (args: { text: string; priority: 'high' | 'medium' | 'low'; appointmentId?: string }) => {
            handleAddTask(args.text, args.priority || 'medium', args.appointmentId);
            return JSON.stringify({ success: true, message: `Aufgabe "${args.text}" wurde erstellt.` });
        },
        toggle_task_completion: (args: { taskId: number }) => {
            handleToggle(args.taskId);
            const task = taskList.find(t => t.id === args.taskId);
            return JSON.stringify({ success: true, message: `Aufgabe "${task?.text}" wurde als ${task?.completed ? 'offen' : 'erledigt'} markiert.` });
        },
        update_task: (args: { taskId: number; text?: string; priority?: 'high' | 'medium' | 'low' }) => {
            const task = taskList.find(t => t.id === args.taskId);
            if (!task) return JSON.stringify({ success: false, message: "Aufgabe nicht gefunden."});
            handleUpdateTask(args.taskId, args.text || task.text, args.priority || task.priority);
            return JSON.stringify({ success: true, message: `Aufgabe "${task.text}" wurde aktualisiert.` });
        },
        add_appointment: (args: { date: string; customer: string; address: string; reason: string; }) => {
            addAppointment(args);
            return JSON.stringify({ success: true, message: `Termin für ${args.customer} am ${new Date(args.date).toLocaleString('de-DE')} wurde erstellt.` });
        },
        update_appointment_status: (args: { appointmentId: string; status: 'completed' | 'cancelled' }) => {
            updateAppointmentStatus(args.appointmentId, args.status);
            return JSON.stringify({ success: true, message: `Termin wurde als ${args.status === 'completed' ? 'abgeschlossen' : 'storniert'} markiert.` });
        }
    };

    const getAiResponse = useCallback(async (messages: Message[], provider: AiProvider): Promise<string | null> => {
        const apiKey = 
            provider === 'deepseek' ? apiKeys.deepseek || apiKeys.openrouter : apiKeys[provider]; // deepseek kann auch openrouter key nehmen, fallback
        
        if (!apiKey) {
            toast({
                title: 'API-Schlüssel fehlt',
                description: `Bitte hinterlege deinen ${provider.charAt(0).toUpperCase() + provider.slice(1)} API-Schlüssel.`,
                variant: 'destructive',
            });
            return null;
        }

        const systemPrompt = `Du bist Zoe, eine freundliche und hilfsbereite KI-Assistentin für Handwerker der Firma ZOE Solar. Deine Expertise liegt im Bereich Solartechnik und Photovoltaik. Antworte auf Deutsch. Sei präzise und kurz. Du kannst die Produktdatenbank mit der Funktion 'search_products' durchsuchen. Du kannst auch Aufgaben (Tasks) und Termine (Appointments) verwalten. Benutze dazu die verfügbaren Tools.
        Heutiges Datum: ${new Date().toISOString().split('T')[0]}
        Aktuelle Aufgaben: ${JSON.stringify(taskList.map(t => ({id: t.id, text: t.text, completed: t.completed, priority: t.priority, appointmentId: t.appointmentId})))}
        Aktuelle Termine: ${JSON.stringify(appointments.map(a => ({id: a.id, customer: a.customer, reason: a.reason, date: a.date, status: a.status})))}
        `;

        try {
            let response: Response;
            if (provider === 'gemini') {
                const geminiTools = [{
                    functionDeclarations: [
                        {
                            name: 'search_products',
                            description: 'Durchsuche die Produktdatenbank nach Name, Beschreibung oder Hersteller.',
                            parameters: { type: 'OBJECT', properties: { query: { type: 'STRING', description: 'Der Suchbegriff, z.B. "ecoTEC".' } } },
                        },
                        {
                            name: 'add_task',
                            description: 'Erstellt eine neue Aufgabe.',
                            parameters: { type: 'OBJECT', properties: { text: { type: 'STRING', description: 'Der Text der Aufgabe.' }, priority: { type: 'STRING', description: 'Die Priorität: "high", "medium", oder "low".' }, appointmentId: { type: 'STRING', description: 'Optionale ID des Termins, dem die Aufgabe zugeordnet ist.' } } },
                        },
                        {
                            name: 'toggle_task_completion',
                            description: 'Markiert eine Aufgabe als erledigt oder offen.',
                            parameters: { type: 'OBJECT', properties: { taskId: { type: 'NUMBER', description: 'Die ID der Aufgabe.' } } },
                        },
                        {
                            name: 'update_task',
                            description: 'Aktualisiert Text oder Priorität einer bestehenden Aufgabe.',
                            parameters: { type: 'OBJECT', properties: { taskId: { type: 'NUMBER', description: 'Die ID der Aufgabe.' }, text: { type: 'STRING', description: 'Der neue Text.' }, priority: { type: 'STRING', description: 'Die neue Priorität.' } } },
                        },
                        {
                            name: 'add_appointment',
                            description: 'Erstellt einen neuen Termin.',
                            parameters: { type: 'OBJECT', properties: { date: { type: 'STRING', description: 'Datum und Uhrzeit im ISO 8601 Format, z.B. "2025-06-17T14:00:00".' }, customer: { type: 'STRING', description: 'Name des Kunden.' }, address: { type: 'STRING', description: 'Adresse des Kunden.' }, reason: { type: 'STRING', description: 'Grund des Termins.' } } },
                        },
                        {
                            name: 'update_appointment_status',
                            description: 'Aktualisiert den Status eines Termins.',
                            parameters: { type: 'OBJECT', properties: { appointmentId: { type: 'STRING', description: 'Die ID des Termins.' }, status: { type: 'STRING', description: 'Der neue Status: "completed" oder "cancelled".' } } },
                        }
                    ]
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
                        // @ts-ignore
                        const functionResponse = functionToCall(functionArgs);

                        const newContents = [
                            ...apiMessages,
                            { role: 'model' as const, parts: [part] },
                            { role: 'function' as const, parts: [{ functionResponse: { name: functionName, response: { content: functionResponse } }] }
                        ];

                        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                contents: newContents.slice(-10),
                                systemInstruction: { parts: [{ text: systemPrompt }] },
                                generationConfig: { temperature: 0.7 },
                                tools: geminiTools, // send tools again
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

            } else if (provider === 'deepseek') {
                // DeepSeek via OpenRouter
                let apiMessages = messages.map(msg => ({ role: senderToOpenAiRole(msg.sender), content: msg.text }));
                const url = 'https://openrouter.ai/api/v1/chat/completions';
                const model = 'deepseek/deepseek-r1-0528:free';

                // OpenRouter erfordert "Referer" und "X-Title" optional
                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': window.location.origin,
                        'X-Title': 'ZOE Solar Chat'
                    },
                    body: JSON.stringify({
                        model,
                        messages: [{ role: 'system', content: systemPrompt }, ...apiMessages.slice(-10)],
                        temperature: 0.7,
                    }),
                });

                let data = await response.json();
                if (!response.ok) {
                    console.error('DeepSeek API error:', data);
                    const errorMessage = data.error?.message || 'Unbekannter API Fehler';
                    throw new Error(errorMessage);
                }

                return data.choices?.[0]?.message?.content;

            } else if (provider === 'openrouter') {
                // OpenRouter with a freely selectable model (alt: "mistralai/mistral-7b-instruct" etc.)
                let apiMessages = messages.map(msg => ({ role: senderToOpenAiRole(msg.sender), content: msg.text }));
                const url = 'https://openrouter.ai/api/v1/chat/completions';
                const model = 'mistralai/mistral-7b-instruct';

                const openAiTools = [{
                    type: 'function' as const,
                    function: {
                        name: 'search_products',
                        description: 'Durchsuche die Produktdatenbank nach Name, Beschreibung oder Hersteller.',
                        parameters: { type: 'object', properties: { query: { type: 'string', description: 'Der Suchbegriff, z.B. "ecoTEC".' } } },
                    },
                }, {
                    type: 'function' as const,
                    function: {
                        name: 'add_task',
                        description: 'Erstellt eine neue Aufgabe.',
                        parameters: {
                            type: 'object',
                            properties: {
                                text: { type: 'string', description: 'Der Text der Aufgabe.' },
                                priority: { type: 'string', enum: ['high', 'medium', 'low'], description: 'Die Priorität.' },
                                appointmentId: { type: 'string', description: 'Optionale ID des Termins.' }
                            },
                            required: ["text"],
                        },
                    },
                }, {
                    type: 'function' as const,
                    function: {
                        name: 'toggle_task_completion',
                        description: 'Markiert eine Aufgabe als erledigt oder offen.',
                        parameters: {
                            type: 'object',
                            properties: { taskId: { type: 'number', description: 'Die ID der Aufgabe.' } },
                            required: ["taskId"],
                        },
                    },
                }, {
                    type: 'function' as const,
                    function: {
                        name: 'update_task',
                        description: 'Aktualisiert Text oder Priorität einer bestehenden Aufgabe.',
                        parameters: {
                            type: 'object',
                            properties: {
                                taskId: { type: 'number', description: 'Die ID der Aufgabe.' },
                                text: { type: 'string', description: 'Der neue Text.' },
                                priority: { type: 'string', enum: ['high', 'medium', 'low'], description: 'Die neue Priorität.' }
                            },
                            required: ["taskId"],
                        },
                    },
                }, {
                    type: 'function' as const,
                    function: {
                        name: 'add_appointment',
                        description: 'Erstellt einen neuen Termin.',
                        parameters: {
                            type: 'object',
                            properties: {
                                date: { type: 'string', description: 'Datum/Uhrzeit (ISO 8601), z.B. "2025-06-17T14:00:00".' },
                                customer: { type: 'string', description: 'Name des Kunden.' },
                                address: { type: 'string', description: 'Adresse des Kunden.' },
                                reason: { type: 'string', description: 'Grund des Termins.' }
                            },
                            required: ["date", "customer", "address", "reason"],
                        },
                    },
                }, {
                    type: 'function' as const,
                    function: {
                        name: 'update_appointment_status',
                        description: 'Aktualisiert den Status eines Termins.',
                        parameters: {
                            type: 'object',
                            properties: {
                                appointmentId: { type: 'string', description: 'Die ID des Termins.' },
                                status: { type: 'string', enum: ['completed', 'cancelled'], description: 'Der neue Status.' }
                            },
                            required: ["appointmentId", "status"],
                        },
                    },
                }];

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
                    console.error(`openrouter API error:`, data);
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
                            // @ts-ignore
                            const functionResponse = functionToCall(functionArgs);
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
                        console.error(`openrouter API error (after tool call):`, data);
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
    }, [apiKeys, toast, searchProducts, taskList, appointments, handleAddTask, handleToggle, handleUpdateTask, addAppointment, updateAppointmentStatus]);

    const hasApiKey = (provider: AiProvider) => !!apiKeys[provider] || (provider === 'deepseek' && !!apiKeys.openrouter);

    return {
        apiKeys,
        saveApiKeys,
        getAiResponse,
        hasApiKey,
    };
};
