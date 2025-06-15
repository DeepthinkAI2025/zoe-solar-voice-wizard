
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronsUpDown } from 'lucide-react';

interface AppSwitcherProps {
  onClick: () => void;
  activeApp: 'phone' | 'craftsman';
}

const AppSwitcher: React.FC<AppSwitcherProps> = ({ onClick, activeApp }) => {
  return (
    <motion.div 
      className="absolute top-0 right-4 z-20"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
    >
      <button 
        onClick={onClick}
        className={cn(
          "w-20 h-10 bg-secondary rounded-b-full flex items-end justify-center pb-2 shadow-lg cursor-pointer transition-colors duration-300 hover:bg-primary/20",
          "border-x border-b border-border"
        )}
        aria-label="App wechseln"
      >
        <motion.div
          animate={{ rotate: activeApp === 'craftsman' ? 180 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <ChevronsUpDown className="text-muted-foreground" />
        </motion.div>
      </button>
    </motion.div>
  );
};

export default AppSwitcher;
