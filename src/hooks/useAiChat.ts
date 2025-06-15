
import { useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useApiKeys, type AiProvider } from './useApiKeys';
import { useAiTools } from './useAiTools';
import { useGeminiProvider } from './useGeminiProvider';
import { useOpenRouterProvider } from './useOpenRouterProvider';

export type { AiProvider } from './useApiKeys';
export type { ApiKeys } from './useApiKeys';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

export const useAiChat = () => {
    const { toast } = useToast();
    const { apiKeys, saveApiKeys, hasApiKey } = useApiKeys();
    const { availableTools, getSystemPrompt } = useAiTools();
    const { callGeminiApi } = useGeminiProvider();
    const { callDeepSeekApi, callOpenRouterApi } = useOpenRouterProvider();

    const getAiResponse = useCallback(async (messages: Message[], provider: AiProvider): Promise<string | null> => {
        const apiKey = 
            provider === 'deepseek' ? apiKeys.deepseek || apiKeys.openrouter : apiKeys[provider];
        
        if (!apiKey) {
            toast({
                title: 'API-Schlüssel fehlt',
                description: `Bitte hinterlege deinen ${provider.charAt(0).toUpperCase() + provider.slice(1)} API-Schlüssel.`,
                variant: 'destructive',
            });
            return null;
        }

        const systemPrompt = getSystemPrompt();

        try {
            if (provider === 'gemini') {
                return await callGeminiApi(messages, apiKey, systemPrompt, availableTools);
            } else if (provider === 'deepseek') {
                return await callDeepSeekApi(messages, apiKey, systemPrompt);
            } else if (provider === 'openrouter') {
                return await callOpenRouterApi(messages, apiKey, systemPrompt, availableTools);
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
    }, [apiKeys, toast, availableTools, getSystemPrompt, callGeminiApi, callDeepSeekApi, callOpenRouterApi]);

    return {
        apiKeys,
        saveApiKeys,
        getAiResponse,
        hasApiKey,
    };
};
