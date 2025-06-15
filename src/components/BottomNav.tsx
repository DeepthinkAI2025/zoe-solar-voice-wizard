
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
      "relative flex justify-around items-center p-2 mx-auto mb-4 w-full max-w-sm rounded-3xl z-10",
      "bg-black/30 backdrop-blur-xl",
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
              "relative flex flex-col items-center justify-center flex-1 h-14 rounded-2xl transition-colors duration-300 ease-in-out group",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
              isActive ? 'text-white' : 'text-muted-foreground/80 hover:text-white'
            )}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <div className="relative z-10 flex flex-col items-center justify-center gap-1">
              <Icon 
                name={item.icon} 
                size={22} 
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span className={cn(
                "text-[11px] tracking-wide",
                isActive ? "font-semibold" : "font-normal"
              )}>
                {item.label}
              </span>
            </div>
            
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 rounded-2xl bg-white/15"
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
