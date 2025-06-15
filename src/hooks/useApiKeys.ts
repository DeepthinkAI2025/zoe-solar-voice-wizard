
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

export type AiProvider = 'gemini' | 'deepseek' | 'openrouter';

export interface ApiKeys {
    gemini: string;
    deepseek: string;
    openrouter: string;
}

export const useApiKeys = () => {
    const [apiKeys, setApiKeys] = useState<ApiKeys>({ gemini: '', deepseek: '', openrouter: '' });
    const { toast } = useToast();

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

    const hasApiKey = (provider: AiProvider) => !!apiKeys[provider] || (provider === 'deepseek' && !!apiKeys.openrouter);

    return {
        apiKeys,
        saveApiKeys,
        hasApiKey,
    };
};
