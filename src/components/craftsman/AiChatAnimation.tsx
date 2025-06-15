
import React from 'react';
import { motion } from 'framer-motion';

const AiChatAnimation = () => {
  const colors = ["#8A2BE2", "#4169E1", "#00BFFF", "#32CD32"];

  return (
    <div className="relative w-40 h-40">
      {colors.map((color, i) => (
        <motion.div
          key={i}
          className="absolute w-full h-full rounded-full"
          style={{
            backgroundColor: color,
            filter: 'blur(20px)',
            mixBlendMode: 'screen',
          }}
          animate={{
            x: [0, Math.random() * 40 - 20, 0],
            y: [0, Math.random() * 40 - 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default AiChatAnimation;
