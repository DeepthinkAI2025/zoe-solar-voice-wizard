
import { useState, useEffect, useMemo, useRef } from 'react';
import { Mic, MicOff, Phone, Volume2, Bluetooth } from 'lucide-react';
import type { TranscriptLine } from '@/components/ActiveCallView';

const greetings = [
  "Hallo, ZOE Solar, mein Name ist Alex, der KI-Assistent. Wie kann ich Ihnen helfen?",
  "Guten Tag, hier ZOE Solar. Sie sprechen mit Alex, dem KI-Assistenten. Was kann ich für Sie tun?",
  "Willkommen bei ZOE Solar. Mein Name ist Alex, Ihr persönlicher KI-Assistent. Womit kann ich Ihnen dienen?",
];

const mockConversation: { speaker: 'agent' | 'caller'; text: string; }[] = [
  { speaker: 'caller', text: "Guten Tag, hier ist Müller. Ich habe eine Frage zu meiner letzten Rechnung." },
  { speaker: 'agent', text: "Selbstverständlich, Herr Müller. Um Ihnen zu helfen, benötige ich bitte Ihre Kunden- oder Rechnungsnummer." },
  { speaker: 'caller', text: "Moment, die habe ich hier... das ist die 12345." },
  { speaker: 'agent', text: "Vielen Dank. Ich prüfe das für Sie..." },
  { speaker: 'agent', text: "Es scheint ein Problem mit der Abrechnung der sonderleistung zu geben. Ich verbinde Sie mit einem Menschen." },
];

const audioOutputs = [
    { id: 'speaker', name: 'Lautsprecher', icon: Volume2 },
    { id: 'earpiece', name: 'Telefonhörer', icon: Phone },
    { id: 'bluetooth_airpods', name: 'AirPods Pro', icon: Bluetooth },
    { id: 'bluetooth_car', name: 'Auto-HiFi', icon: Bluetooth },
];

interface UseActiveCallLogicProps {
    status: 'incoming' | 'active';
    agentId?: string;
    contactName?: string;
    startMuted?: boolean;
}

export const useActiveCallLogic = ({ status, agentId, contactName, startMuted }: UseActiveCallLogicProps) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isRingerMuted, setIsRingerMuted] = useState(startMuted ?? false);
    const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
    const [newNote, setNewNote] = useState('');
    const [audioOutput, setAudioOutput] = useState('speaker');
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const callerName = contactName || 'Anrufer';

    const fullTranscript: TranscriptLine[] = useMemo(() => {
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        return [{ speaker: 'agent', text: randomGreeting }, ...mockConversation];
    }, []);

    useEffect(() => {
        setIsMuted(!!agentId);
    }, [agentId]);
    
    const audioOptionsWithMute = useMemo(() => [
        ...audioOutputs,
        { id: 'mute-toggle', name: isMuted ? 'Ton an' : 'Stumm', icon: isMuted ? Mic : MicOff }
    ], [isMuted]);
    
    const selectedAudioDevice = useMemo(() => audioOutputs.find(o => o.id === audioOutput) || audioOutputs[0], [audioOutput]);

    const handleAudioOutputChange = (id: string) => {
        if (id === 'mute-toggle') {
            setIsMuted(prev => !prev);
        } else {
            setAudioOutput(id);
        }
    };

    useEffect(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
    }, [transcript]);

    useEffect(() => {
        if (status === 'active') {
            let transcriptIndex = 0;
            if (fullTranscript.length > 0) {
                setTranscript([fullTranscript[0]]);
                transcriptIndex = 1;
            } else {
                setTranscript([]);
            }

            const transcriptTimer = setInterval(() => {
                if (transcriptIndex < fullTranscript.length) {
                    setTranscript(prev => [fullTranscript[transcriptIndex], ...prev]);
                    transcriptIndex++;
                } else {
                    clearInterval(transcriptTimer);
                }
            }, 3500);

            return () => {
                clearInterval(transcriptTimer);
            };
        }
    }, [status, fullTranscript]);

    const handleSendNote = () => {
        if (!newNote.trim()) return;
        setTranscript(prev => [{ speaker: 'system', text: `[Notiz an KI]: ${newNote}` }, ...prev]);
        setNewNote('');
    };

    return {
        isMuted, setIsMuted,
        isRingerMuted, setIsRingerMuted,
        transcript,
        newNote, onNewNoteChange: setNewNote,
        scrollContainerRef,
        callerName,
        handleSendNote,
        audioOptionsWithMute,
        selectedAudioDevice,
        handleAudioOutputChange,
    };
};
