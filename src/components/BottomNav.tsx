
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
    { id: 'settings', label: 'Einstellungen', icon: 'Settings' },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, className }) => {
  return (
    <nav className={cn(
      "relative flex justify-center items-center p-2 mx-4 mb-4 rounded-[28px] z-10",
      "bg-black/25 backdrop-blur-xl",
      "border border-white/10",
      "shadow-2xl shadow-black/20",
      className
    )}>
      <div className="relative flex justify-around items-center w-full max-w-sm">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-start pt-2.5 pb-1.5 w-[70px] h-[60px] rounded-2xl transition-all duration-300 ease-in-out group",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black/25",
                isActive 
                  ? 'text-white -translate-y-1' 
                  : 'text-muted-foreground/60 hover:text-white hover:-translate-y-1'
              )}
            >
              {/* Active indicator background */}
              {isActive && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/50 to-primary/40 backdrop-blur-sm border border-primary/40 shadow-xl shadow-primary/25 animate-fade-in-zoom" />
              )}
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Icon container */}
              <div className="relative z-10 mb-1">
                <Icon 
                  name={item.icon} 
                  size={isActive ? 22 : 20} 
                  className="transition-all duration-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"
                />
              </div>
              
              {/* Label */}
              <span className={cn(
                "relative z-10 text-xs leading-tight text-center max-w-full",
                "transition-colors duration-300",
                isActive 
                  ? "font-semibold text-white" 
                  : "font-medium text-muted-foreground/80 group-hover:text-white/90"
              )}>
                {item.label}
              </span>
              
              {/* Magic sparkle effect for active item */}
              {isActive && (
                <>
                  <div className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
