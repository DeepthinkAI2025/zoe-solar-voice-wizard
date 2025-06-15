
import React from 'react';

interface CallHeaderProps {
  number: string;
  status: 'incoming' | 'active';
  duration: number;
}

const formatDuration = (sec: number) => {
  const minutes = Math.floor(sec / 60).toString().padStart(2, '0');
  const seconds = (sec % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const CallHeader: React.FC<CallHeaderProps> = ({ number, status, duration }) => {
  return (
    <div className="text-center pt-8">
      <h2 className="text-3xl font-bold text-foreground">{number}</h2>
      <p className="text-primary mt-2">
        {status === 'incoming' ? 'Eingehender Anruf' : formatDuration(duration)}
      </p>
    </div>
  );
};

export default CallHeader;
