
import React from 'react';
import { navItems } from '@/data/mock';
import Icon from './Icon';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  className?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, className }) => {
  return (
    <nav className={cn("flex justify-around items-center bg-black/30 backdrop-blur-sm border-t border-white/10 p-2", className)}>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={cn(
            "flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-all duration-300",
            activeTab === item.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon name={item.icon.displayName as keyof typeof icons} size={24} />
          <span className="text-xs mt-1">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
