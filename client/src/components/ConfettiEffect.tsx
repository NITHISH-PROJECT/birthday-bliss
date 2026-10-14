import React from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

export const triggerFullCelebration = () => {
  try {
    // Left cannon
    confetti({
      particleCount: 70,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.7 },
      colors: ['#f43f5e', '#fbbf24', '#c084fc', '#38bdf8', '#34d399'],
    });
    // Right cannon
    confetti({
      particleCount: 70,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.7 },
      colors: ['#f43f5e', '#fbbf24', '#c084fc', '#38bdf8', '#34d399'],
    });
  } catch {}
};

export const triggerStarsBurst = () => {
  try {
    confetti({
      particleCount: 50,
      spread: 100,
      origin: { y: 0.5 },
      shapes: ['star'],
      colors: ['#fde047', '#fbbf24', '#c084fc', '#ffffff'],
    });
  } catch {}
};

interface AmbientParticlesProps {
  type?: 'confetti' | 'stars' | 'balloons' | 'pastels' | 'hearts' | 'sparkles' | 'lights' | 'gold-dust';
  count?: number;
}

export const AmbientParticles: React.FC<AmbientParticlesProps> = ({
  type = 'confetti',
  count = 14,
}) => {
  const getParticleSymbol = (i: number) => {
    switch (type) {
      case 'hearts':
        return ['💖', '💕', '✨', '🌸'][i % 4];
      case 'stars':
        return ['✦', '★', '✨', '🪐'][i % 4];
      case 'balloons':
        return ['🎈', '🎉', '✨', '🎊'][i % 4];
      case 'pastels':
        return ['🌸', '🍡', '✨', '🌷'][i % 4];
      case 'lights':
      case 'gold-dust':
        return ['✦', '✨', '★', '💫'][i % 4];
      default:
        return ['🎉', '✨', '🎈', '💖'][i % 4];
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: count }).map((_, i) => {
        const randomX = (i * 7.5 + (i % 3) * 5) % 95;
        const duration = 12 + (i % 6) * 3;
        const delay = (i * 0.8) % 7;
        const size = 16 + (i % 4) * 8;

        return (
          <motion.div
            key={i}
            initial={{
              y: '105vh',
              x: `${randomX}vw`,
              opacity: 0,
              rotate: 0,
            }}
            animate={{
              y: '-10vh',
              x: `${randomX + ((i % 2 === 0 ? 1 : -1) * 8)}vw`,
              opacity: [0, 0.7, 0.7, 0],
              rotate: (i % 2 === 0 ? 1 : -1) * 180,
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ fontSize: `${size}px` }}
            className="absolute select-none opacity-40 blur-[0.4px]"
          >
            {getParticleSymbol(i)}
          </motion.div>
        );
      })}
    </div>
  );
};
