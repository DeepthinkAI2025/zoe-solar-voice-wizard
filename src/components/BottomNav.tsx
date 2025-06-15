
import React from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  className?: string;
}

const navItems = [
    { id: 'dialpad', label: 'Wähltastatur', icon: 'Phone' },
    { id: 'history', label: 'Anrufliste', icon: 'History' },
    { id: 'contacts', label: 'Kontakte', icon: 'Users' },
    { id: 'settings', label: 'Einstellungen', icon: 'Settings' },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, className }) => {
  return (
    <nav className={cn(
      "relative flex justify-around items-center p-1 mx-auto mb-4 w-full max-w-[350px] rounded-full z-10",
      "bg-black/20 backdrop-blur-xl",
      "border border-white/10",
      "shadow-2xl shadow-black/20",
      className
    )}>
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "relative flex flex-col items-center justify-center w-[78px] h-[56px] rounded-full transition-colors duration-300 ease-in-out group",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
              isActive ? 'text-white' : 'text-muted-foreground/70 hover:text-white'
            )}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <div className="relative z-10 flex flex-col items-center justify-center gap-1.5">
              <Icon 
                name={item.icon} 
                size={22} 
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span className={cn(
                "text-[10px] tracking-wide",
                isActive ? "font-semibold" : "font-medium"
              )}>
                {item.label}
              </span>
            </div>
            
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/60 to-primary/50 border border-primary/50 shadow-lg shadow-primary/20"
                style={{ borderRadius: 9999 }}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
