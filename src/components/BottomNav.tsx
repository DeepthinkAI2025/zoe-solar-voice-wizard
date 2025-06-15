
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
              "relative group flex-1 flex items-center justify-center h-16 transition-colors duration-300 rounded-2xl",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <div className="relative z-10 flex flex-col items-center justify-center gap-1">
              <Icon 
                name={item.icon} 
                size={22} 
                className={cn(
                  "transition-colors",
                  isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span className={cn(
                "text-[11px] tracking-wide",
                isActive ? "font-semibold text-white" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {item.label}
              </span>
            </div>
            
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 rounded-2xl bg-white/10"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
