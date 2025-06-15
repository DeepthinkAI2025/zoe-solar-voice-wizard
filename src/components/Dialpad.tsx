
import { Phone, Delete } from 'lucide-react';
import React, { useState } from 'react';

interface DialpadProps {
  onCall: (number: string) => void;
}

const buttons = [
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
  '*', '0', '#'
];

const Dialpad: React.FC<DialpadProps> = ({ onCall }) => {
  const [number, setNumber] = useState('');

  const handlePress = (char: string) => setNumber(prev => prev + char);
  const handleDelete = () => setNumber(prev => prev.slice(0, -1));
  const handleCall = () => {
    if (number) onCall(number);
  };

  return (
    <div className="flex flex-col h-full justify-between p-4">
      <div className="h-24 flex items-center justify-center text-4xl tracking-widest text-white/90">
        {number || <span className="text-muted-foreground">Nummer eingeben</span>}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {buttons.map(btn => (
          <button key={btn} onClick={() => handlePress(btn)} className="h-20 rounded-full bg-white/5 hover:bg-white/10 text-3xl text-white transition-colors duration-200">
            {btn}
          </button>
        ))}
      </div>
      <div className="flex justify-around items-center h-24">
        <div className="w-20" />
        <button onClick={handleCall} className="w-20 h-20 rounded-full bg-primary/80 hover:bg-primary shadow-lg shadow-primary/30 flex items-center justify-center transition-transform hover:scale-105 disabled:bg-gray-600 disabled:shadow-none" disabled={!number}>
          <Phone size={32} className="text-primary-foreground" />
        </button>
        <button onClick={handleDelete} className="w-20 h-20 flex items-center justify-center text-muted-foreground hover:text-white transition-colors" disabled={!number}>
          <Delete size={28} />
        </button>
      </div>
    </div>
  );
};

export default Dialpad;
