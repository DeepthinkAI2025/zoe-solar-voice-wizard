import { Phone, Delete, Bot, Calendar } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

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
    if (length > 18) return 'text-xl';
    if (length > 14) return 'text-2xl';
    if (length > 10) return 'text-3xl';
    return 'text-4xl';
  };

  const dialpadVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const keyVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="flex flex-col h-full justify-between p-4 sm:p-6">
      <div className="h-28 flex items-center justify-center relative" onClick={handleDisplayClick}>
        <input
          ref={inputRef}
          type="tel"
          inputMode="tel"
          value={number}
          onChange={handleInputChange}
          placeholder="Nummer eingeben"
          className={`w-full bg-transparent text-center tracking-wider text-foreground focus:outline-none placeholder:text-muted-foreground pr-12 transition-all duration-200 ${getFontSizeClass()} placeholder:text-2xl`}
        />
        {number && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={(e) => { e.stopPropagation(); handleDelete(); }} 
            className="absolute right-0 p-4 text-muted-foreground hover:text-foreground transition-colors">
            <Delete size={28} />
          </motion.button>
        )}
      </div>
      <motion.div 
        className="grid grid-cols-3 gap-4"
        variants={dialpadVariants}
        initial="hidden"
        animate="visible"
      >
        {buttonDetails.map(btn => (
          <motion.button 
            key={btn.digit} 
            onClick={() => handlePress(btn.digit)} 
            className="w-16 h-16 rounded-full bg-muted/50 hover:bg-muted/70 text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 flex flex-col items-center justify-center justify-self-center"
            variants={keyVariants}
            whileTap={{ scale: 0.95, backgroundColor: 'hsl(var(--muted))' }}
          >
            <span className="block text-3xl font-light tracking-wide">{btn.digit}</span>
            <span className="block text-[10px] tracking-widest text-muted-foreground font-mono h-3">{btn.letters}</span>
          </motion.button>
        ))}
      </motion.div>
      <div className="flex justify-around items-center h-24">
        <div className="flex flex-col items-center gap-2 w-24 text-center">
          <motion.button 
            onClick={handleAICall} 
            className="w-16 h-16 rounded-full bg-muted/50 hover:bg-muted/70 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={!number}
            whileTap={{ scale: 0.95 }}
          >
            <Bot size={24} className="text-foreground" />
          </motion.button>
          <span className="text-xs text-muted-foreground">KI-Anruf</span>
        </div>
        
        <motion.button 
          onClick={handleManualCall} 
          className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_20px_theme(colors.primary/50%)] flex items-center justify-center transition-all hover:scale-105 disabled:bg-muted disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={!number}
          whileTap={{ scale: 0.95 }}
        >
          <Phone size={32} className="text-primary-foreground" />
        </motion.button>
        
        <div className="flex flex-col items-center gap-2 w-24 text-center">
          <motion.button 
            onClick={handleScheduleCall} 
            className="w-16 h-16 rounded-full bg-muted/50 hover:bg-muted/70 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={!number}
            whileTap={{ scale: 0.95 }}
          >
            <Calendar size={24} className="text-foreground" />
          </motion.button>
          <span className="text-xs text-muted-foreground">Planen</span>
        </div>
      </div>
    </div>
  );
};

export default Dialpad;
