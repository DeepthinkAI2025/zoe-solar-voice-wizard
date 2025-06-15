
import { Phone, Delete, Bot, Calendar } from 'lucide-react';
import React, { useState } from 'react';

interface DialpadProps {
  onCall: (number: string) => void;
  onCallManually: (number: string) => void;
  onSchedule: (number: string) => void;
}

const buttons = [
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
  '*', '0', '#'
];

const Dialpad: React.FC<DialpadProps> = ({ onCall, onCallManually, onSchedule }) => {
  const [number, setNumber] = useState('');

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

  return (
    <div className="flex flex-col h-full justify-between p-4">
      <div className="h-24 flex items-center justify-center relative">
        <input
          type="tel"
          value={number}
          onChange={handleInputChange}
          placeholder="Nummer eingeben"
          className="w-full bg-transparent text-center text-4xl tracking-widest text-white/90 focus:outline-none placeholder:text-muted-foreground pr-12"
        />
        {number && (
          <button onClick={handleDelete} className="absolute right-0 p-4 text-muted-foreground hover:text-white transition-colors">
            <Delete size={28} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {buttons.map(btn => (
          <button key={btn} onClick={() => handlePress(btn)} className="h-20 rounded-full bg-white/5 hover:bg-white/10 text-3xl text-white transition-colors duration-200">
            {btn}
          </button>
        ))}
      </div>
      <div className="flex justify-around items-center h-24">
        <div className="flex flex-col items-center gap-1 w-24 text-center">
          <button onClick={handleAICall} className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-50" disabled={!number}>
            <Bot size={24} className="text-white" />
          </button>
          <span className="text-xs text-muted-foreground">KI-Anruf</span>
        </div>
        
        <button onClick={handleManualCall} className="w-20 h-20 rounded-full bg-primary/80 hover:bg-primary shadow-lg shadow-primary/30 flex items-center justify-center transition-transform hover:scale-105 disabled:bg-gray-600 disabled:shadow-none" disabled={!number}>
          <Phone size={32} className="text-primary-foreground" />
        </button>
        
        <div className="flex flex-col items-center gap-1 w-24 text-center">
          <button onClick={handleScheduleCall} className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-50" disabled={!number}>
            <Calendar size={24} className="text-white" />
          </button>
          <span className="text-xs text-muted-foreground">Planen</span>
        </div>
      </div>
    </div>
  );
};

export default Dialpad;
