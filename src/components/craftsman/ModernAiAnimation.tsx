
import React from 'react';
import { motion } from 'framer-motion';

interface ModernAiAnimationProps {
  isListening: boolean;
}

const ModernAiAnimation = ({ isListening }: ModernAiAnimationProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Moderner pulsierender Avatar */}
      <div className="relative">
        <motion.div
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center"
          animate={isListening ? {
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          } : {
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: isListening ? 0.5 : 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* KI-Symbol */}
          <motion.div
            className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center"
            animate={{
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
              <path d="M19 12L19.5 14.5L22 15L19.5 15.5L19 18L18.5 15.5L16 15L18.5 14.5L19 12Z" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Listening-Indikator */}
        {isListening && (
          <motion.div
            className="absolute -inset-2 rounded-3xl border-2 border-red-400"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>

      {/* Status Text */}
      <motion.p
        className="text-sm text-muted-foreground text-center"
        animate={{
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {isListening ? "Ich höre zu..." : "Hallo! Ich bin Zoe, deine KI-Assistentin."}
      </motion.p>

      {/* Moderne Wellenform beim Zuhören */}
      {isListening && (
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-blue-500 rounded-full"
              animate={{
                height: [4, 20, 4]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ModernAiAnimation;
