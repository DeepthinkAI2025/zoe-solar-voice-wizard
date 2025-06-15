
import React from 'react';
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
    { id: 'voicemail', label: 'Voicemail', icon: 'Voicemail' },
    { id: 'settings', label: 'Einstellungen', icon: 'Settings' },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, className }) => {
  return (
    <nav className={cn(
      "relative flex justify-center items-center p-2 mx-4 mb-4 rounded-3xl",
      "bg-gradient-to-r from-black/20 via-black/30 to-black/20",
      "backdrop-blur-xl border border-white/10",
      "shadow-2xl shadow-primary/5",
      "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-r before:from-primary/10 before:via-transparent before:to-primary/10 before:opacity-50",
      className
    )}>
      <div className="relative flex justify-around items-center w-full max-w-sm">
        {navItems.map((item, index) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500 ease-out group",
                "hover:scale-110 hover:-translate-y-1",
                "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-transparent",
                isActive 
                  ? 'text-white transform scale-110 -translate-y-1' 
                  : 'text-muted-foreground/70 hover:text-white'
              )}
            >
              {/* Active indicator background */}
              {isActive && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/40 to-primary/20 backdrop-blur-sm border border-primary/30 shadow-lg shadow-primary/20 animate-fade-in" />
              )}
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Icon container */}
              <div className="relative z-10 mb-1">
                <Icon 
                  name={item.icon} 
                  size={isActive ? 22 : 20} 
                  className={cn(
                    "transition-all duration-300",
                    isActive && "drop-shadow-sm filter"
                  )}
                />
              </div>
              
              {/* Label */}
              <span className={cn(
                "text-xs font-medium transition-all duration-300 relative z-10 leading-none",
                isActive 
                  ? "text-white/90 font-semibold tracking-wide" 
                  : "text-muted-foreground/60 group-hover:text-white/80"
              )}>
                {item.label}
              </span>
              
              {/* Magic sparkle effect for active item */}
              {isActive && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary/60 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </nav>
  );
};

export default BottomNav;
