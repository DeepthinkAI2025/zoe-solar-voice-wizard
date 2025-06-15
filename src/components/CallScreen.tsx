
import React from 'react';

interface CallScreenProps {
  title: string;
  children: React.ReactNode;
}

const CallScreen: React.FC<CallScreenProps> = ({ title, children }) => {
  return (
    <div className="flex-grow p-4 overflow-y-auto">
      <h1 className="text-3xl font-bold text-white text-left mb-6">{title}</h1>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default CallScreen;
