
import { useCallback } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const senderToGeminiRole = (sender: 'user' | 'ai'): 'user' | 'model' => {
    return sender === 'user' ? 'user' : 'model';
};

export const useGeminiProvider = () => {
    const callGeminiApi = useCallback(async (
        messages: Message[], 
        apiKey: string, 
        systemPrompt: string, 
        availableTools: any
    ): Promise<string> => {
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
                    parameters: { 
                        type: 'OBJECT', 
                        properties: { 
                            text: { type: 'STRING', description: 'Der Text der Aufgabe.' }, 
                            priority: { type: 'STRING', description: 'Die Priorität: "high", "medium", oder "low".' }, 
                            appointmentId: { type: 'STRING', description: 'Optionale ID des Termins, dem die Aufgabe zugeordnet ist.' } 
                        } 
                    },
                },
                {
                    name: 'toggle_task_completion',
                    description: 'Markiert eine Aufgabe als erledigt oder offen.',
                    parameters: { type: 'OBJECT', properties: { taskId: { type: 'NUMBER', description: 'Die ID der Aufgabe.' } } },
                },
                {
                    name: 'update_task',
                    description: 'Aktualisiert Text oder Priorität einer bestehenden Aufgabe.',
                    parameters: { 
                        type: 'OBJECT', 
                        properties: { 
                            taskId: { type: 'NUMBER', description: 'Die ID der Aufgabe.' }, 
                            text: { type: 'STRING', description: 'Der neue Text.' }, 
                            priority: { type: 'STRING', description: 'Die neue Priorität.' } 
                        } 
                    },
                },
                {
                    name: 'add_appointment',
                    description: 'Erstellt einen neuen Termin.',
                    parameters: { 
                        type: 'OBJECT', 
                        properties: { 
                            date: { type: 'STRING', description: 'Datum und Uhrzeit im ISO 8601 Format, z.B. "2025-06-17T14:00:00".' }, 
                            customer: { type: 'STRING', description: 'Name des Kunden.' }, 
                            address: { type: 'STRING', description: 'Adresse des Kunden.' }, 
                            reason: { type: 'STRING', description: 'Grund des Termins.' } 
                        } 
                    },
                },
                {
                    name: 'update_appointment_status',
                    description: 'Aktualisiert den Status eines Termins.',
                    parameters: { 
                        type: 'OBJECT', 
                        properties: { 
                            appointmentId: { type: 'STRING', description: 'Die ID des Termins.' },
                            status: { type: 'STRING', description: 'Der neue Status: "completed" oder "cancelled".' } 
                        } 
                    }
                }
            ]
        }];
        
        let apiMessages = messages.map(msg => ({ role: senderToGeminiRole(msg.sender), parts: [{ text: msg.text }] }));

        let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
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
                    { role: 'function' as const, parts: [{ functionResponse: { name: functionName, response: { content: functionResponse } } }] }
                ];

                response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: newContents.slice(-10),
                        systemInstruction: { parts: [{ text: systemPrompt }] },
                        generationConfig: { temperature: 0.7 },
                        tools: geminiTools,
                    }),
                });
                data = await response.json();
            }
        }
        
        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            if (data.promptFeedback?.blockReason) { 
                throw new Error(`Anfrage blockiert: ${data.promptFeedback.blockReason}. Bitte Anfrage anpassen.`); 
            }
            throw new Error('Keine gültige Antwort von der API erhalten.');
        }
        return data.candidates[0].content.parts[0].text;
    }, []);

    return { callGeminiApi };
};
