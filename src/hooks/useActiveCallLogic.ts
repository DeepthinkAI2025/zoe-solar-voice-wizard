
import { useState, useEffect, useMemo, useRef } from 'react';
import { Mic, MicOff, Phone, Volume2, Bluetooth } from 'lucide-react';

const audioOutputs = [
    { id: 'speaker', name: 'Lautsprecher', icon: Volume2 },
    { id: 'earpiece', name: 'Telefonhörer', icon: Phone },
    { id: 'bluetooth_airpods', name: 'AirPods Pro', icon: Bluetooth },
    { id: 'bluetooth_car', name: 'Auto-HiFi', icon: Bluetooth },
];

interface UseActiveCallLogicProps {
    agentId?: string;
    contactName?: string;
    startMuted?: boolean;
}

export const useActiveCallLogic = ({ agentId, contactName, startMuted }: UseActiveCallLogicProps) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isRingerMuted, setIsRingerMuted] = useState(startMuted ?? false);
    const [audioOutput, setAudioOutput] = useState('speaker');
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const callerName = contactName || 'Anrufer';

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

    return {
        isMuted, setIsMuted,
        isRingerMuted, setIsRingerMuted,
        scrollContainerRef,
        callerName,
        audioOptionsWithMute,
        selectedAudioDevice,
        handleAudioOutputChange,
    };
};
