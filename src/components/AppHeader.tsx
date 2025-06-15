
import React from 'react';

interface AppHeaderProps {
  onLogoClick: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="flex-shrink-0 py-4 px-6 flex justify-between items-center">
      <img src="/lovable-uploads/5cbdb31b-130f-40f1-9ead-f812366683b2.png" alt="Zoe Logo" className="h-4" />
      <img 
        src="/lovable-uploads/526a4663-c366-4462-a3e2-2713130c98ff.png" 
        alt="Fapro Logo" 
        className="h-6 cursor-pointer"
        onClick={onLogoClick}
      />
    </header>
  );
};

export default AppHeader;
