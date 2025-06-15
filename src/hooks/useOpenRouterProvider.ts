
import { useCallback } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const senderToOpenAiRole = (sender: 'user' | 'ai'): 'user' | 'assistant' => {
    return sender === 'user' ? 'user' : 'assistant';
};

export const useOpenRouterProvider = () => {
    const callDeepSeekApi = useCallback(async (
        messages: Message[], 
        apiKey: string, 
        systemPrompt: string
    ): Promise<string> => {
        let apiMessages = messages.map(msg => ({ role: senderToOpenAiRole(msg.sender), content: msg.text }));
        const url = 'https://openrouter.ai/api/v1/chat/completions';
        const model = 'deepseek/deepseek-r1-0528:free';

        const response = await fetch(url, {
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
    }, []);

    const callOpenRouterApi = useCallback(async (
        messages: Message[], 
        apiKey: string, 
        systemPrompt: string, 
        availableTools: any
    ): Promise<string> => {
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
        
        let response = await fetch(url, {
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
    }, []);

    return { callDeepSeekApi, callOpenRouterApi };
};
