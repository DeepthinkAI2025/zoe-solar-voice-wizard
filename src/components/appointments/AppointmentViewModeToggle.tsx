
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, List } from 'lucide-react';

interface AppointmentViewModeToggleProps {
  viewMode: 'list' | 'calendar';
  onViewModeChange: (mode: 'list' | 'calendar') => void;
}

const AppointmentViewModeToggle: React.FC<AppointmentViewModeToggleProps> = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant={viewMode === 'list' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => onViewModeChange('list')}
      >
        <List className="mr-2 h-4 w-4" />
        Liste
      </Button>
      <Button 
        variant={viewMode === 'calendar' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => onViewModeChange('calendar')}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Kalender
      </Button>
    </div>
  );
};

export default AppointmentViewModeToggle;
