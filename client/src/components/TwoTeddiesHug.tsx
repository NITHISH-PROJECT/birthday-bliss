import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, RotateCcw } from 'lucide-react';
import { triggerStarsBurst } from './ConfettiEffect';
import { audioEngine } from '../utils/audioEngine';

interface TwoTeddiesHugProps {
  onHugTriggered?: () => void;
  className?: string;
  autoPlay?: boolean;
}

export const TwoTeddiesHug: React.FC<TwoTeddiesHugProps> = ({
  onHugTriggered,
  className = '',
  autoPlay = false,
}) => {
  // States: 'waiting' (separated) -> 'running' (sprinting towards each other) -> 'hugging' (embracing in center)
  const [hugState, setHugState] = useState<'waiting' | 'running' | 'hugging'>('waiting');
  const [squeezePulse, setSqueezePulse] = useState(0);
  const [hugCount, setHugCount] = useState(0);

  // Trigger running towards each other and hugging
  const handleStartHug = () => {
    if (hugState === 'running') return;

    audioEngine.playChime();
    setHugState('running');

    // Run for 1.3s then embrace tightly
    setTimeout(() => {
      setHugState('hugging');
      setHugCount((c) => c + 1);
      audioEngine.playCelebrationCheer();
      triggerStarsBurst();
      if (onHugTriggered) {
        onHugTriggered();
      }
    }, 1300);
  };

  // Replay: reset to waiting and run again
  const handleReplayHug = () => {
    setHugState('waiting');
    setTimeout(() => {
      handleStartHug();
    }, 250);
  };

  // Extra squeeze interaction when hugging
  const handleSqueezeTighter = () => {
    audioEngine.playConfettiPop();
    triggerStarsBurst();
    setSqueezePulse((p) => p + 1);
  };

  useEffect(() => {
    if (autoPlay && hugState === 'waiting') {
      const timer = setTimeout(() => {
        handleStartHug();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [autoPlay]);

  return (
    <div className={`w-full flex flex-col items-center select-none ${className}`}>
      {/* TEDDY ANIMATION STAGE */}
      <div className="relative w-full max-w-md h-72 sm:h-80 flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-rose-100/70 via-pink-50/70 to-rose-100/80 border-2 border-pink-200/90 shadow-xl shadow-pink-200/50 p-4">
        {/* Soft Dreamy Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/60 via-transparent to-pink-200/30 pointer-events-none" />

        {/* Ambient Floating Hearts in Stage */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { x: '15%', y: '18%', d: 2.8, s: 16 },
            { x: '82%', y: '22%', d: 3.2, s: 18 },
            { x: '48%', y: '12%', d: 2.4, s: 22 },
            { x: '25%', y: '65%', d: 3.6, s: 14 },
            { x: '75%', y: '68%', d: 3.0, s: 15 },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              animate={{
                y: [0, -10, 0],
                opacity: [0.4, 0.85, 0.4],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{ repeat: Infinity, duration: item.d, delay: idx * 0.4 }}
              style={{ left: item.x, top: item.y, fontSize: item.s }}
              className="absolute text-pink-400/80"
            >
              ❤️
            </motion.div>
          ))}
        </div>

        {/* ============================================================== */}
        {/* SVG ANIMATION VIEWPORT (380 x 260) */}
        {/* ============================================================== */}
        <svg
          viewBox="0 0 380 260"
          className="w-full h-full drop-shadow-md overflow-visible relative z-10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Left Honey Teddy Gradients */}
            <linearGradient id="honeyFur" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F5B77B" />
              <stop offset="100%" stopColor="#D48B47" />
            </linearGradient>
            <linearGradient id="honeySnout" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF8F0" />
              <stop offset="100%" stopColor="#FDE3C8" />
            </linearGradient>

            {/* Right Mocha Rose Teddy Gradients */}
            <linearGradient id="mochaFur" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DC9790" />
              <stop offset="100%" stopColor="#B86F67" />
            </linearGradient>
            <linearGradient id="mochaSnout" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF2F0" />
              <stop offset="100%" stopColor="#FBD7D1" />
            </linearGradient>

            {/* Giant Glowing Heart Gradient */}
            <linearGradient id="giantHeartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF2E63" />
              <stop offset="50%" stopColor="#FF6B8B" />
              <stop offset="100%" stopColor="#FFAEC9" />
            </linearGradient>

            {/* Drop Shadows */}
            <filter id="softTeddyShadow" x="-15%" y="-15%" width="130%" height="135%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#8B4358" floodOpacity="0.2" />
            </filter>
            <filter id="heartGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#FF3366" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Ground Soft Shadows */}
          <ellipse cx="190" cy="242" rx="150" ry="12" fill="#E8CAD4" opacity="0.5" />

          {/* ============================================================== */}
          {/* STATE 1: WAITING (Separated, Eagerly waving at each other) */}
          {/* ============================================================== */}
          {hugState === 'waiting' && (
            <g>
              {/* Dotted Love Path Connecting the Teddies with paw prints */}
              <path
                d="M100 230 C140 215 240 215 280 230"
                stroke="#F472B6"
                strokeWidth="2.5"
                strokeDasharray="5 6"
                strokeLinecap="round"
                opacity="0.65"
              />

              {/* Heart floating in center of path */}
              <motion.g
                animate={{ y: [0, -8, 0], scale: [0.95, 1.15, 0.95] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                transform-origin="190 200"
              >
                <path
                  d="M190 206 C184 195 170 193 170 206 C170 218 190 230 190 230 C190 230 210 218 210 206 C210 193 196 195 190 206 Z"
                  fill="#FF4D6D"
                  opacity="0.85"
                />
              </motion.g>

              {/* Paw prints along path */}
              <circle cx="145" cy="222" r="3" fill="#F472B6" opacity="0.6" />
              <circle cx="149" cy="218" r="1.5" fill="#F472B6" opacity="0.6" />
              <circle cx="235" cy="222" r="3" fill="#F472B6" opacity="0.6" />
              <circle cx="231" cy="218" r="1.5" fill="#F472B6" opacity="0.6" />

              {/* --- LEFT HONEY TEDDY (WAITING) --- */}
              <motion.g
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                transform="translate(45, 60)"
              >
                {/* Bear Ground Shadow */}
                <ellipse cx="45" cy="172" rx="36" ry="8" fill="#DDBCC6" opacity="0.7" />

                {/* Left Ear */}
                <ellipse cx="20" cy="38" rx="14" ry="15" fill="url(#honeyFur)" />
                <ellipse cx="20" cy="39" rx="8" ry="9" fill="#FFC2D4" />

                {/* Right Ear */}
                <ellipse cx="70" cy="38" rx="14" ry="15" fill="url(#honeyFur)" />
                <ellipse cx="70" cy="39" rx="8" ry="9" fill="#FFC2D4" />

                {/* Body & Belly */}
                <ellipse cx="45" cy="120" rx="36" ry="38" fill="url(#honeyFur)" filter="url(#softTeddyShadow)" />
                <ellipse cx="45" cy="125" rx="22" ry="24" fill="url(#honeySnout)" />

                {/* Left Leg & Foot */}
                <ellipse cx="25" cy="158" rx="14" ry="12" fill="url(#honeyFur)" />
                <ellipse cx="25" cy="160" rx="8" ry="6" fill="#FDE3C8" />

                {/* Right Leg & Foot */}
                <ellipse cx="65" cy="158" rx="14" ry="12" fill="url(#honeyFur)" />
                <ellipse cx="65" cy="160" rx="8" ry="6" fill="#FDE3C8" />

                {/* Resting Left Arm */}
                <ellipse cx="14" cy="115" rx="10" ry="14" transform="rotate(15 14 115)" fill="url(#honeyFur)" />

                {/* Waving Right Arm (Reaching toward right teddy!) */}
                <motion.g
                  animate={{ rotate: [-10, 18, -10] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                  transform-origin="76 105"
                >
                  <path d="M76 105 Q96 95 102 80 Q106 90 92 115 Z" fill="url(#honeyFur)" />
                  <circle cx="100" cy="82" r="7" fill="url(#honeyFur)" />
                  <circle cx="100" cy="82" r="4" fill="#FFC2D4" />
                </motion.g>

                {/* Head */}
                <ellipse cx="45" cy="65" rx="35" ry="31" fill="url(#honeyFur)" filter="url(#softTeddyShadow)" />

                {/* Rosy Blush */}
                <ellipse cx="24" cy="74" rx="8" ry="5" fill="#FF85A2" opacity="0.85" />
                <ellipse cx="66" cy="74" rx="8" ry="5" fill="#FF85A2" opacity="0.85" />

                {/* Eyes (Eager Twinkling Anime Eyes) */}
                <ellipse cx="32" cy="62" rx="5.5" ry="6.5" fill="#2D1E18" />
                <circle cx="34" cy="60" r="2.2" fill="#FFFFFF" />
                <circle cx="31" cy="64" r="1.1" fill="#FFFFFF" />

                <ellipse cx="58" cy="62" rx="5.5" ry="6.5" fill="#2D1E18" />
                <circle cx="60" cy="60" r="2.2" fill="#FFFFFF" />
                <circle cx="57" cy="64" r="1.1" fill="#FFFFFF" />

                {/* Snout & Nose & Smile */}
                <ellipse cx="45" cy="72" rx="14" ry="11" fill="url(#honeySnout)" />
                <ellipse cx="45" cy="68" rx="4.5" ry="3.5" fill="#3E2723" />
                <path d="M42 74 Q45 78 48 74" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />

                {/* Thought Heart */}
                <motion.path
                  d="M50 15 C47 9 37 8 37 15 C37 22 50 29 50 29 C50 29 63 22 63 15 C63 8 53 9 50 15 Z"
                  fill="#FF6B8B"
                  animate={{ y: [0, -6, 0], scale: [0.9, 1.1, 0.9] }}
                  transition={{ repeat: Infinity, duration: 1.9 }}
                />
              </motion.g>

              {/* --- RIGHT MOCHA TEDDY (WAITING) --- */}
              <motion.g
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut', delay: 0.3 }}
                transform="translate(245, 60)"
              >
                {/* Bear Ground Shadow */}
                <ellipse cx="45" cy="172" rx="36" ry="8" fill="#DDBCC6" opacity="0.7" />

                {/* Left Ear */}
                <ellipse cx="20" cy="38" rx="14" ry="15" fill="url(#mochaFur)" />
                <ellipse cx="20" cy="39" rx="8" ry="9" fill="#FFC2D4" />

                {/* Right Ear with Cute Flower Hairpin */}
                <ellipse cx="70" cy="38" rx="14" ry="15" fill="url(#mochaFur)" />
                <ellipse cx="70" cy="39" rx="8" ry="9" fill="#FFC2D4" />

                {/* Flower clip on ear */}
                <circle cx="70" cy="32" r="3.5" fill="#FFFFFF" />
                <circle cx="66" cy="32" r="3.5" fill="#FFFFFF" />
                <circle cx="74" cy="32" r="3.5" fill="#FFFFFF" />
                <circle cx="70" cy="28" r="3.5" fill="#FFFFFF" />
                <circle cx="70" cy="36" r="3.5" fill="#FFFFFF" />
                <circle cx="70" cy="32" r="2.5" fill="#FBBF24" />

                {/* Body & Belly */}
                <ellipse cx="45" cy="120" rx="36" ry="38" fill="url(#mochaFur)" filter="url(#softTeddyShadow)" />
                <ellipse cx="45" cy="125" rx="22" ry="24" fill="url(#mochaSnout)" />

                {/* Left Leg & Foot */}
                <ellipse cx="25" cy="158" rx="14" ry="12" fill="url(#mochaFur)" />
                <ellipse cx="25" cy="160" rx="8" ry="6" fill="#FBD7D1" />

                {/* Right Leg & Foot */}
                <ellipse cx="65" cy="158" rx="14" ry="12" fill="url(#mochaFur)" />
                <ellipse cx="65" cy="160" rx="8" ry="6" fill="#FBD7D1" />

                {/* Resting Right Arm */}
                <ellipse cx="76" cy="115" rx="10" ry="14" transform="rotate(-15 76 115)" fill="url(#mochaFur)" />

                {/* Waving Left Arm (Reaching eagerly toward honey teddy!) */}
                <motion.g
                  animate={{ rotate: [10, -18, 10] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                  transform-origin="14 105"
                >
                  <path d="M14 105 Q-6 95 -12 80 Q-16 90 -2 115 Z" fill="url(#mochaFur)" />
                  <circle cx="-10" cy="82" r="7" fill="url(#mochaFur)" />
                  <circle cx="-10" cy="82" r="4" fill="#FFC2D4" />
                </motion.g>

                {/* Head */}
                <ellipse cx="45" cy="65" rx="35" ry="31" fill="url(#mochaFur)" filter="url(#softTeddyShadow)" />

                {/* Rosy Blush */}
                <ellipse cx="24" cy="74" rx="8" ry="5" fill="#FF6B8B" opacity="0.85" />
                <ellipse cx="66" cy="74" rx="8" ry="5" fill="#FF6B8B" opacity="0.85" />

                {/* Eyes (Sparkling Big Happy Eyes) */}
                <ellipse cx="32" cy="62" rx="5.5" ry="6.5" fill="#2D1E18" />
                <circle cx="30" cy="60" r="2.2" fill="#FFFFFF" />
                <circle cx="33" cy="64" r="1.1" fill="#FFFFFF" />

                <ellipse cx="58" cy="62" rx="5.5" ry="6.5" fill="#2D1E18" />
                <circle cx="56" cy="60" r="2.2" fill="#FFFFFF" />
                <circle cx="59" cy="64" r="1.1" fill="#FFFFFF" />

                {/* Snout & Nose & Sweet Smile */}
                <ellipse cx="45" cy="72" rx="14" ry="11" fill="url(#mochaSnout)" />
                <ellipse cx="45" cy="68" rx="4.5" ry="3.5" fill="#3E2723" />
                <path d="M42 74 Q45 78 48 74" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />

                {/* Thought Heart */}
                <motion.path
                  d="M40 15 C37 9 27 8 27 15 C27 22 40 29 40 29 C40 29 53 22 53 15 C53 8 43 9 40 15 Z"
                  fill="#FF3366"
                  animate={{ y: [0, -6, 0], scale: [0.9, 1.1, 0.9] }}
                  transition={{ repeat: Infinity, duration: 1.7, delay: 0.2 }}
                />
              </motion.g>
            </g>
          )}

          {/* ============================================================== */}
          {/* STATE 2: RUNNING (Two teddies happily sprinting towards each other) */}
          {/* ============================================================== */}
          {hugState === 'running' && (
            <g>
              {/* Speed Dust & Sparkle trails */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Left Teddy sprint dust poofs */}
                <circle cx="70" cy="225" r="8" fill="#FFFFFF" opacity="0.7" />
                <circle cx="55" cy="220" r="5" fill="#FFFFFF" opacity="0.5" />
                <circle cx="45" cy="223" r="3" fill="#FFFFFF" opacity="0.3" />

                {/* Right Teddy sprint dust poofs */}
                <circle cx="310" cy="225" r="8" fill="#FFFFFF" opacity="0.7" />
                <circle cx="325" cy="220" r="5" fill="#FFFFFF" opacity="0.5" />
                <circle cx="335" cy="223" r="3" fill="#FFFFFF" opacity="0.3" />

                {/* Motion lines */}
                <line x1="40" y1="210" x2="80" y2="210" stroke="#FF6B8B" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
                <line x1="300" y1="210" x2="340" y2="210" stroke="#FF6B8B" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
              </motion.g>

              {/* --- LEFT HONEY TEDDY SPRINTING --- */}
              <motion.g
                initial={{ x: 45 }}
                animate={{
                  x: 105,
                  y: [60, 48, 60, 48, 60],
                  rotate: [0, 8, 2, 8, 4],
                }}
                transition={{
                  x: { duration: 1.25, ease: 'easeInOut' },
                  y: { repeat: Infinity, duration: 0.32, ease: 'easeInOut' },
                  rotate: { repeat: Infinity, duration: 0.32, ease: 'easeInOut' },
                }}
                transform-origin="45 120"
              >
                {/* Shadow */}
                <ellipse cx="45" cy="172" rx="30" ry="7" fill="#DDBCC6" opacity="0.7" />

                {/* Ears */}
                <ellipse cx="20" cy="38" rx="14" ry="15" fill="url(#honeyFur)" />
                <ellipse cx="20" cy="39" rx="8" ry="9" fill="#FFC2D4" />
                <ellipse cx="70" cy="38" rx="14" ry="15" fill="url(#honeyFur)" />
                <ellipse cx="70" cy="39" rx="8" ry="9" fill="#FFC2D4" />

                {/* Body & Belly */}
                <ellipse cx="45" cy="120" rx="36" ry="38" fill="url(#honeyFur)" filter="url(#softTeddyShadow)" />
                <ellipse cx="45" cy="125" rx="22" ry="24" fill="url(#honeySnout)" />

                {/* Running Legs (Alternating stride) */}
                <motion.ellipse
                  cx="25"
                  cy="158"
                  rx="14"
                  ry="12"
                  fill="url(#honeyFur)"
                  animate={{ y: [-4, 6, -4], rotate: [-15, 20, -15] }}
                  transition={{ repeat: Infinity, duration: 0.3 }}
                />
                <motion.ellipse
                  cx="65"
                  cy="158"
                  rx="14"
                  ry="12"
                  fill="url(#honeyFur)"
                  animate={{ y: [6, -4, 6], rotate: [20, -15, 20] }}
                  transition={{ repeat: Infinity, duration: 0.3 }}
                />

                {/* Outstretched Eager Running Arms (Reaching straight for the hug!) */}
                <path
                  d="M45 105 Q78 95 98 100 Q106 108 92 118 Q75 115 45 118 Z"
                  fill="url(#honeyFur)"
                  filter="url(#softTeddyShadow)"
                />
                <circle cx="98" cy="106" r="7" fill="url(#honeyFur)" />
                <circle cx="98" cy="106" r="4" fill="#FFC2D4" />

                {/* Head (Leaning forward with big open joyful smile!) */}
                <ellipse cx="48" cy="65" rx="35" ry="31" fill="url(#honeyFur)" filter="url(#softTeddyShadow)" />
                <ellipse cx="27" cy="74" rx="8" ry="5" fill="#FF85A2" opacity="0.85" />
                <ellipse cx="69" cy="74" rx="8" ry="5" fill="#FF85A2" opacity="0.85" />

                {/* Joyful Running Eyes */}
                <ellipse cx="35" cy="62" rx="5.5" ry="6.5" fill="#2D1E18" />
                <circle cx="37" cy="60" r="2.2" fill="#FFFFFF" />
                <ellipse cx="61" cy="62" rx="5.5" ry="6.5" fill="#2D1E18" />
                <circle cx="63" cy="60" r="2.2" fill="#FFFFFF" />

                {/* Snout & Big Happy Open Mouth */}
                <ellipse cx="48" cy="72" rx="14" ry="11" fill="url(#honeySnout)" />
                <ellipse cx="48" cy="67" rx="4.5" ry="3.5" fill="#3E2723" />
                <path d="M42 74 Q48 83 54 74 Z" fill="#FF4D6D" stroke="#3E2723" strokeWidth="1.5" />
              </motion.g>

              {/* --- RIGHT MOCHA TEDDY SPRINTING --- */}
              <motion.g
                initial={{ x: 245 }}
                animate={{
                  x: 185,
                  y: [60, 48, 60, 48, 60],
                  rotate: [0, -8, -2, -8, -4],
                }}
                transition={{
                  x: { duration: 1.25, ease: 'easeInOut' },
                  y: { repeat: Infinity, duration: 0.32, ease: 'easeInOut', delay: 0.05 },
                  rotate: { repeat: Infinity, duration: 0.32, ease: 'easeInOut' },
                }}
                transform-origin="45 120"
              >
                {/* Shadow */}
                <ellipse cx="45" cy="172" rx="30" ry="7" fill="#DDBCC6" opacity="0.7" />

                {/* Ears */}
                <ellipse cx="20" cy="38" rx="14" ry="15" fill="url(#mochaFur)" />
                <ellipse cx="20" cy="39" rx="8" ry="9" fill="#FFC2D4" />
                <ellipse cx="70" cy="38" rx="14" ry="15" fill="url(#mochaFur)" />
                <ellipse cx="70" cy="39" rx="8" ry="9" fill="#FFC2D4" />
                <circle cx="70" cy="32" r="3" fill="#FFFFFF" />
                <circle cx="70" cy="32" r="1.5" fill="#FBBF24" />

                {/* Body & Belly */}
                <ellipse cx="45" cy="120" rx="36" ry="38" fill="url(#mochaFur)" filter="url(#softTeddyShadow)" />
                <ellipse cx="45" cy="125" rx="22" ry="24" fill="url(#mochaSnout)" />

                {/* Running Legs */}
                <motion.ellipse
                  cx="25"
                  cy="158"
                  rx="14"
                  ry="12"
                  fill="url(#mochaFur)"
                  animate={{ y: [6, -4, 6], rotate: [20, -15, 20] }}
                  transition={{ repeat: Infinity, duration: 0.3 }}
                />
                <motion.ellipse
                  cx="65"
                  cy="158"
                  rx="14"
                  ry="12"
                  fill="url(#mochaFur)"
                  animate={{ y: [-4, 6, -4], rotate: [-15, 20, -15] }}
                  transition={{ repeat: Infinity, duration: 0.3 }}
                />

                {/* Outstretched Eager Running Arms */}
                <path
                  d="M45 105 Q12 95 -8 100 Q-16 108 -2 118 Q15 115 45 118 Z"
                  fill="url(#mochaFur)"
                  filter="url(#softTeddyShadow)"
                />
                <circle cx="-8" cy="106" r="7" fill="url(#mochaFur)" />
                <circle cx="-8" cy="106" r="4" fill="#FFC2D4" />

                {/* Head */}
                <ellipse cx="42" cy="65" rx="35" ry="31" fill="url(#mochaFur)" filter="url(#softTeddyShadow)" />
                <ellipse cx="21" cy="74" rx="8" ry="5" fill="#FF6B8B" opacity="0.85" />
                <ellipse cx="63" cy="74" rx="8" ry="5" fill="#FF6B8B" opacity="0.85" />

                {/* Joyful Running Eyes */}
                <ellipse cx="29" cy="62" rx="5.5" ry="6.5" fill="#2D1E18" />
                <circle cx="27" cy="60" r="2.2" fill="#FFFFFF" />
                <ellipse cx="55" cy="62" rx="5.5" ry="6.5" fill="#2D1E18" />
                <circle cx="53" cy="60" r="2.2" fill="#FFFFFF" />

                {/* Snout & Big Happy Open Mouth */}
                <ellipse cx="42" cy="72" rx="14" ry="11" fill="url(#mochaSnout)" />
                <ellipse cx="42" cy="67" rx="4.5" ry="3.5" fill="#3E2723" />
                <path d="M36 74 Q42 83 48 74 Z" fill="#FF4D6D" stroke="#3E2723" strokeWidth="1.5" />
              </motion.g>
            </g>
          )}

          {/* ============================================================== */}
          {/* STATE 3: HUGGING (Embracing tightly in center with giant heart!) */}
          {/* ============================================================== */}
          {hugState === 'hugging' && (
            <motion.g
              key={squeezePulse}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{
                scale: [1, 1.05, 0.98, 1.03, 1],
                y: [0, -3, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              transform-origin="190 140"
            >
              {/* Ground Shadow Under Hugging Teddies */}
              <ellipse cx="190" cy="235" rx="90" ry="14" fill="#DDBCC6" opacity="0.8" />

              {/* Radiating Sparkles and Love Burst */}
              {[
                { cx: 120, cy: 90, r: 2.5, d: 2.2 },
                { cx: 260, cy: 90, r: 2.5, d: 2.5 },
                { cx: 90, cy: 130, r: 2, d: 2.0 },
                { cx: 290, cy: 130, r: 2, d: 2.3 },
                { cx: 140, cy: 50, r: 3, d: 1.8 },
                { cx: 240, cy: 50, r: 3, d: 2.1 },
              ].map((sparkle, idx) => (
                <motion.circle
                  key={idx}
                  cx={sparkle.cx}
                  cy={sparkle.cy}
                  r={sparkle.r}
                  fill="#FF4D6D"
                  animate={{
                    scale: [0.8, 1.4, 0.8],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{ repeat: Infinity, duration: sparkle.d, delay: idx * 0.2 }}
                />
              ))}

              {/* ================= LEFT TEDDY (IN HUG) ================= */}
              <g transform="translate(110, 55)">
                {/* Left Ear */}
                <ellipse cx="20" cy="38" rx="14" ry="15" fill="url(#honeyFur)" />
                <ellipse cx="20" cy="39" rx="8" ry="9" fill="#FFC2D4" />

                {/* Body */}
                <ellipse cx="48" cy="120" rx="35" ry="38" fill="url(#honeyFur)" filter="url(#softTeddyShadow)" />
                <ellipse cx="44" cy="125" rx="20" ry="24" fill="url(#honeySnout)" />

                {/* Feet */}
                <ellipse cx="30" cy="158" rx="13" ry="11" fill="url(#honeyFur)" />
                <ellipse cx="30" cy="160" rx="7" ry="5" fill="#FDE3C8" />

                {/* Head (Tilted comfortably against Mocha Teddy's cheek) */}
                <ellipse cx="52" cy="70" rx="34" ry="30" transform="rotate(8 52 70)" fill="url(#honeyFur)" filter="url(#softTeddyShadow)" />

                {/* Deep Happy Blushing */}
                <ellipse cx="34" cy="77" rx="9" ry="5.5" fill="#FF6B8B" opacity="0.9" />
                <ellipse cx="70" cy="77" rx="9" ry="5.5" fill="#FF6B8B" opacity="0.9" />

                {/* Closed Peaceful Smiling Eyes (^ . ^) */}
                <path d="M38 68 Q44 61 50 68" stroke="#2D1E18" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M58 68 Q64 61 70 68" stroke="#2D1E18" strokeWidth="2.8" strokeLinecap="round" />

                {/* Snout & Sweet Content Smile */}
                <ellipse cx="54" cy="76" rx="13" ry="10" fill="url(#honeySnout)" />
                <ellipse cx="54" cy="72" rx="4" ry="3" fill="#3E2723" />
                <path d="M51 77 Q54 81 57 77" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />

                {/* LEFT ARM WRAPPED TIGHTLY AROUND MOCHA TEDDY'S BACK */}
                <motion.path
                  d="M50 110 Q90 100 115 118 Q122 128 108 135 Q85 125 50 125 Z"
                  fill="url(#honeyFur)"
                  filter="url(#softTeddyShadow)"
                  animate={{
                    d: [
                      'M50 110 Q90 100 115 118 Q122 128 108 135 Q85 125 50 125 Z',
                      'M50 110 Q95 98 120 116 Q125 126 112 133 Q85 125 50 125 Z',
                      'M50 110 Q90 100 115 118 Q122 128 108 135 Q85 125 50 125 Z',
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut' }}
                />
                <circle cx="112" cy="126" r="7" fill="url(#honeyFur)" />
                <circle cx="112" cy="126" r="4" fill="#FFC2D4" />
              </g>

              {/* ================= RIGHT TEDDY (IN HUG) ================= */}
              <g transform="translate(180, 55)">
                {/* Right Ear */}
                <ellipse cx="70" cy="38" rx="14" ry="15" fill="url(#mochaFur)" />
                <ellipse cx="70" cy="39" rx="8" ry="9" fill="#FFC2D4" />

                {/* Flower clip */}
                <circle cx="70" cy="30" r="3.5" fill="#FFFFFF" />
                <circle cx="70" cy="30" r="2" fill="#FBBF24" />

                {/* Body */}
                <ellipse cx="42" cy="120" rx="35" ry="38" fill="url(#mochaFur)" filter="url(#softTeddyShadow)" />
                <ellipse cx="46" cy="125" rx="20" ry="24" fill="url(#mochaSnout)" />

                {/* Feet */}
                <ellipse cx="60" cy="158" rx="13" ry="11" fill="url(#mochaFur)" />
                <ellipse cx="60" cy="160" rx="7" ry="5" fill="#FBD7D1" />

                {/* Head (Tilted lovingly against Honey Teddy's cheek) */}
                <ellipse cx="38" cy="70" rx="34" ry="30" transform="rotate(-8 38 70)" fill="url(#mochaFur)" filter="url(#softTeddyShadow)" />

                {/* Deep Happy Blushing */}
                <ellipse cx="20" cy="77" rx="9" ry="5.5" fill="#FF4D6D" opacity="0.9" />
                <ellipse cx="56" cy="77" rx="9" ry="5.5" fill="#FF4D6D" opacity="0.9" />

                {/* Closed Peaceful Smiling Eyes (^ . ^) */}
                <path d="M22 68 Q28 61 34 68" stroke="#2D1E18" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M42 68 Q48 61 54 68" stroke="#2D1E18" strokeWidth="2.8" strokeLinecap="round" />

                {/* Snout & Sweet Content Smile */}
                <ellipse cx="36" cy="76" rx="13" ry="10" fill="url(#mochaSnout)" />
                <ellipse cx="36" cy="72" rx="4" ry="3" fill="#3E2723" />
                <path d="M33 77 Q36 81 39 77" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />

                {/* RIGHT ARM WRAPPED TIGHTLY AROUND HONEY TEDDY'S BACK */}
                <motion.path
                  d="M40 110 Q0 100 -25 118 Q-32 128 -18 135 Q5 125 40 125 Z"
                  fill="url(#mochaFur)"
                  filter="url(#softTeddyShadow)"
                  animate={{
                    d: [
                      'M40 110 Q0 100 -25 118 Q-32 128 -18 135 Q5 125 40 125 Z',
                      'M40 110 Q-5 98 -30 116 Q-35 126 -22 133 Q5 125 40 125 Z',
                      'M40 110 Q0 100 -25 118 Q-32 128 -18 135 Q5 125 40 125 Z',
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut' }}
                />
                <circle cx="-22" cy="126" r="7" fill="url(#mochaFur)" />
                <circle cx="-22" cy="126" r="4" fill="#FFC2D4" />
              </g>

              {/* ================= GIANT BEATING HEART ABOVE HUG ================= */}
              <motion.g
                animate={{
                  scale: [1, 1.25, 1],
                  y: [0, -8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.4,
                  ease: 'easeInOut',
                }}
                transform-origin="190 42"
              >
                <path
                  d="M190 44 C175 16 135 12 135 44 C135 74 190 104 190 104 C190 104 245 74 245 44 C245 12 205 16 190 44 Z"
                  fill="url(#giantHeartGrad)"
                  filter="url(#heartGlow)"
                />
                {/* Heart Gloss Reflection */}
                <path
                  d="M152 32 C148 28 142 32 142 40 C142 48 152 56 152 56"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeOpacity="0.8"
                />
              </motion.g>

              {/* Small floating hearts emerging from the hug */}
              <motion.path
                d="M135 18 C131 12 123 11 123 18 C123 24 135 30 135 30 C135 30 147 24 147 18 C147 11 139 12 135 18 Z"
                fill="#FF6B8B"
                animate={{ y: [0, -14, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
              />
              <motion.path
                d="M245 16 C241 10 233 9 233 16 C233 22 245 28 245 28 C245 28 257 22 257 16 C257 9 249 10 245 16 Z"
                fill="#FF3366"
                animate={{ y: [0, -14, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.0, delay: 0.3 }}
              />
            </motion.g>
          )}
        </svg>
      </div>

      {/* ============================================================== */}
      {/* INTERACTIVE CONTROLS & STATUS CALLOUT */}
      {/* ============================================================== */}
      <div className="w-full mt-4 flex flex-col items-center text-center">
        {/* Waiting Status and Prompt */}
        {hugState === 'waiting' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <p className="text-xs sm:text-sm font-semibold text-rose-700 mb-3 flex items-center justify-center gap-1.5">
              <span>Two little teddies are waiting for your signal! 🥺❤️</span>
            </p>

            {/* BIG VIRTUAL HUG BUTTON */}
            <motion.button
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleStartHug}
              className="px-8 py-3.5 rounded-full font-black text-sm sm:text-base text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-xl shadow-rose-500/40 hover:shadow-2xl hover:shadow-rose-500/60 border border-white/40 flex items-center gap-2.5 transition-all group"
            >
              <Heart className="w-5 h-5 fill-white animate-pulse" />
              <span>Press for Teddy Hug! 🫂🧸</span>
              <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
            </motion.button>
          </motion.div>
        )}

        {/* Running Status */}
        {hugState === 'running' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-2 px-6 rounded-full bg-pink-100 text-pink-700 font-extrabold text-sm sm:text-base border border-pink-200 flex items-center gap-2 animate-pulse shadow-sm"
          >
            <span>Pitter-patter! Running to hug you... 🧸💨❤️</span>
          </motion.div>
        )}

        {/* Hugging Status & Actions */}
        {hugState === 'hugging' && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full flex flex-col items-center"
          >
            {/* Heartwarming Banner */}
            <div className="mb-4 px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 border border-white/30">
              <Heart className="w-4 h-4 fill-white shrink-0" />
              <span>Aww! You are hugged so tightly! 🧸❤️🧸</span>
            </div>

            {/* Hug Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReplayHug}
                className="px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 shadow-md flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-rose-500" />
                <span>Run & Hug Again! 🔁</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSqueezeTighter}
                className="px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-md shadow-pink-500/30 flex items-center gap-1.5 transition-all"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Squeeze Tighter! 💕</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
