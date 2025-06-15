
import { Phone, Delete, Bot, Calendar } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DialpadProps {
  onCall: (number: string) => void;
  onCallManually: (number: string) => void;
  onSchedule: (number: string) => void;
}

const buttonDetails = [
  { digit: '1', letters: ' ' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
  { digit: '*', letters: '' },
  { digit: '0', letters: '+' },
  { digit: '#', letters: '' },
];

const Dialpad: React.FC<DialpadProps> = ({ onCall, onCallManually, onSchedule }) => {
  const [number, setNumber] = useState('');
  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDisplayClick = () => {
    if (isMobile) {
      inputRef.current?.focus();
    }
  };

  const handlePress = (char: string) => setNumber(prev => prev + char);
  const handleDelete = () => setNumber(prev => prev.slice(0, -1));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^0-9*#+]/g, '');
    setNumber(sanitizedValue);
  };
  
  const handleAICall = () => {
    if (number) onCall(number);
  };
  
  const handleManualCall = () => {
    if (number) onCallManually(number);
  };

  const handleScheduleCall = () => {
    if (number) onSchedule(number);
  };

  const getFontSizeClass = () => {
    const length = number.length;
    if (length > 14) return 'text-xl';
    if (length > 11) return 'text-2xl';
    return 'text-3xl';
  };

  return (
    <div className="flex flex-col h-full justify-between p-6">
      <div className="h-28 flex items-center justify-center relative" onClick={handleDisplayClick}>
        <input
          ref={inputRef}
          type="tel"
          value={number}
          onChange={handleInputChange}
          placeholder="Nummer eingeben"
          className={`w-full bg-transparent text-center tracking-wider text-white focus:outline-none placeholder:text-muted-foreground pr-12 transition-all duration-200 ${getFontSizeClass()} ${isMobile ? 'caret-transparent' : ''}`}
        />
        {number && (
          <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(); }} 
            className="absolute right-0 p-4 text-muted-foreground hover:text-white transition-colors">
            <Delete size={28} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {buttonDetails.map(btn => (
          <button 
            key={btn.digit} 
            onClick={() => handlePress(btn.digit)} 
            className="h-20 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transform active:scale-95 active:bg-white/20"
          >
            <span className="block text-3xl font-light">{btn.digit}</span>
            <span className="block text-xs tracking-widest text-white/50 font-mono h-4">{btn.letters}</span>
          </button>
        ))}
      </div>
      <div className="flex justify-around items-center h-24">
        <div className="flex flex-col items-center gap-2 w-24 text-center">
          <button 
            onClick={handleAICall} 
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95" 
            disabled={!number}>
            <Bot size={24} className="text-white" />
          </button>
          <span className="text-xs text-muted-foreground">KI-Anruf</span>
        </div>
        
        <button 
          onClick={handleManualCall} 
          className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 flex items-center justify-center transition-all hover:scale-105 disabled:bg-muted disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95" 
          disabled={!number}>
          <Phone size={32} className="text-primary-foreground" />
        </button>
        
        <div className="flex flex-col items-center gap-2 w-24 text-center">
          <button 
            onClick={handleScheduleCall} 
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95" 
            disabled={!number}>
            <Calendar size={24} className="text-white" />
          </button>
          <span className="text-xs text-muted-foreground">Planen</span>
        </div>
      </div>
    </div>
  );
};

export default Dialpad;
