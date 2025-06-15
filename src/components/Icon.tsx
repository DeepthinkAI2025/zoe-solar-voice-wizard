
import React from 'react';
import { icons, LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  name: keyof typeof icons;
}

const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    return null; // Or a fallback icon
  }

  return <LucideIcon {...props} />;
};

export default Icon;
