import React from 'react';
interface CallScreenProps {
  title: string;
  children: React.ReactNode;
}
const CallScreen: React.FC<CallScreenProps> = ({
  title,
  children
}) => {
  return <div className="flex-grow p-4 overflow-y-auto">
      
      <div className="space-y-4">
        {children}
      </div>
    </div>;
};
export default CallScreen;