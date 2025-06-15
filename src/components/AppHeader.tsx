
import React from 'react';
import type { NavItemId } from '@/hooks/usePhoneState';

const navItemLabels: Record<NavItemId, string> = {
    'dialpad': 'Wähltastatur',
    'history': 'Anrufliste',
    'settings': 'Einstellungen',
    'termine': 'Termine',
    'aufgaben': 'Aufgaben',
    'produkte': 'Produkte',
    'ki-chat': 'KI-Chat',
};

interface AppHeaderProps {
  activeApp: 'phone' | 'craftsman';
  activeTab: NavItemId;
  onSwitchApp: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ activeApp, activeTab, onSwitchApp }) => {
  const title = navItemLabels[activeTab];

  return (
    <header className="flex-shrink-0 py-4 px-6 grid grid-cols-3 items-center">
      <div className="flex justify-start">
        <img src="/lovable-uploads/5cbdb31b-130f-40f1-9ead-f812366683b2.png" alt="Zoe Logo" className="h-4" />
      </div>
      <h1 className="text-lg font-semibold text-foreground text-center">{title}</h1>
      <div />
    </header>
  );
};

export default AppHeader;
