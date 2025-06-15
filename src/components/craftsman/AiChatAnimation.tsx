
import React from 'react';
import { motion } from 'framer-motion';

interface AiChatAnimationProps {
  isListening?: boolean;
}

const AiChatAnimation: React.FC<AiChatAnimationProps> = ({ isListening = false }) => {
  const waveCount = 5;
  
  const containerVariants = {
    listening: { transition: { staggerChildren: 0.1 } },
    idle: { transition: { staggerChildren: 0.1, staggerDirection: -1 } },
  };
  
  const waveVariants = {
    listening: (i: number) => ({
      y: [0, -10, 0, 10, 0, -5, 0],
      scaleY: [1, 1.5, 1, 0.8, 1, 1.2, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut' as const,
        delay: i * 0.1,
      },
    }),
    idle: {
      y: 0,
      scaleY: 1,
      transition: { duration: 0.5, ease: 'easeInOut' as const },
    },
  };

  return (
    <motion.div 
      className="flex items-center justify-center gap-1.5 h-16 w-40"
      variants={containerVariants}
      animate={isListening ? 'listening' : 'idle'}
      initial="idle"
    >
      {[...Array(waveCount)].map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={waveVariants}
          className="w-3 h-8 bg-primary rounded-full"
        />
      ))}
    </motion.div>
  );
};

export default AiChatAnimation;
