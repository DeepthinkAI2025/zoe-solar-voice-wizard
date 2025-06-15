
import React from 'react';
import { icons, LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  name: string;
}

const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name as keyof typeof icons];

  if (!LucideIcon) {
    return null; // Or a fallback icon
  }

  return <LucideIcon {...props} />;
};

export default Icon;
