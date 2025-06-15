
export const getPriorityBadgeInfo = (priority: 'high' | 'medium' | 'low'): { variant: 'destructive' | 'default' | 'secondary', label: string } => {
  switch (priority) {
    case 'high':
      return { variant: 'destructive', label: 'Hoch' };
    case 'medium':
      return { variant: 'default', label: 'Mittel' };
    case 'low':
      return { variant: 'secondary', label: 'Niedrig' };
  }
};
