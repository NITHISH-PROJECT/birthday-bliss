import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wind, Flame, Heart, Mic, MicOff } from 'lucide-react';
import type { ThemeDefinition } from '../types/themes';
import { audioEngine } from '../utils/audioEngine';
import confetti from 'canvas-confetti';

interface InteractiveCakeProps {
  theme: ThemeDefinition;
  recipientName?: string;
  onBlowOut?: () => void;
  interactive?: boolean;
}

export const InteractiveCake: React.FC<InteractiveCakeProps> = ({
  theme,
  recipientName = 'Special Someone',
  onBlowOut,
  interactive = true,
}) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [isBlowing, setIsBlowing] = useState(false);
  const [wishRevealed, setWishRevealed] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const candleCount = 5;

  const handleBlowOut = () => {
    if (!candlesLit || isBlowing) return;
    setIsBlowing(true);

    // Play whoosh sound
    audioEngine.playBlowCandle();

    // Trigger parent callback IMMEDIATELY in user event handler to satisfy browser autoplay policy
    if (onBlowOut) {
      onBlowOut();
    }

    setTimeout(() => {
      setCandlesLit(false);
      setIsBlowing(false);
      setWishRevealed(true);

      // Play joyful cheer sound
      audioEngine.playCelebrationCheer();

      // Trigger colorful confetti shower
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: [theme.accentHex, '#fbbf24', '#f43f5e', '#38bdf8', '#ffffff'],
        });
      } catch {}
    }, 600);
  };

  const handleRelight = () => {
    setCandlesLit(true);
    setWishRevealed(false);
    audioEngine.playChime();
  };

  // Optional mic listening
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    if (micActive && candlesLit) {
      audioEngine
        .listenForBlowing(() => {
          handleBlowOut();
          setMicActive(false);
        })
        .then((stopFn) => {
          cleanup = stopFn;
        })
        .catch((err) => {
          setMicError(err.message || 'Microphone access denied');
          setMicActive(false);
        });
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, [micActive, candlesLit]);

  return (
    <div className="flex flex-col items-center justify-center relative w-full max-w-md mx-auto py-4 select-none">
      {/* Dynamic Celebration Ambient Aura */}
      <div
        className="absolute w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-700"
        style={{
          background: candlesLit ? theme.accentHex : '#475569',
          top: '20%',
        }}
      />

      {/* Instruction banner before blowing out */}
      {candlesLit && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 text-center px-4 py-2 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md shadow-md"
        >
          <p className="text-amber-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5">
            <span>Close your eyes, make a wish, and blow out the candles. 🎂✨</span>
          </p>
        </motion.div>
      )}

      {/* Wish banner when blown out */}
      <AnimatePresence>
        {wishRevealed && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 z-20 text-center px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-amber-400/30 backdrop-blur-md shadow-lg shadow-amber-500/10"
          >
            <div className="flex items-center justify-center gap-2 text-amber-300 font-semibold text-sm sm:text-base">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
              <span>Your wish has been made! ❤️ Make every day count, {recipientName}! ✨</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The 3D-styled SVG Cake */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        <svg
          viewBox="0 0 320 320"
          className="w-full h-full drop-shadow-2xl overflow-visible"
        >
          <defs>
            <radialGradient id="cakePlateGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="85%" stopColor="#94a3b8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#475569" stopOpacity="0.3" />
            </radialGradient>

            <linearGradient id="frostingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.cake.topFrosting} />
              <stop offset="100%" stopColor={theme.cake.cakeBody} />
            </linearGradient>

            <linearGradient id="baseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.cake.cakeBase} />
              <stop offset="100%" stopColor={theme.cake.cakeBody} />
            </linearGradient>

            <radialGradient id="flameGrad" cx="50%" cy="80%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#fef08a" />
              <stop offset="70%" stopColor={theme.cake.flameColor} />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Elegant Plate / Pedestal */}
          <ellipse cx="160" cy="275" rx="145" ry="30" fill="url(#cakePlateGrad)" />
          <ellipse cx="160" cy="272" rx="135" ry="24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />

          {/* BOTTOM TIER */}
          <path
            d="M 45 195 C 45 195 45 255 45 255 C 45 272 96 285 160 285 C 224 285 275 272 275 255 L 275 195 Z"
            fill="url(#baseGradient)"
            opacity="0.95"
          />
          <ellipse cx="160" cy="195" rx="115" ry="28" fill={theme.cake.cakeBody} />

          {/* Bottom tier drips */}
          <path
            d="M 45 200 
               Q 65 220 85 202
               Q 105 225 125 203
               Q 145 224 165 204
               Q 185 226 205 202
               Q 225 223 245 203
               Q 265 220 275 200
               L 275 195 L 45 195 Z"
            fill={theme.cake.topFrosting}
          />

          {/* TOP TIER */}
          <path
            d="M 80 120 C 80 120 80 180 80 180 C 80 195 116 205 160 205 C 204 205 240 195 240 180 L 240 120 Z"
            fill="url(#frostingGradient)"
          />
          <ellipse cx="160" cy="120" rx="80" ry="22" fill={theme.cake.topFrosting} />

          {/* Frosting Drips on Top Tier */}
          <path
            d="M 80 125 
               Q 95 145 110 127
               Q 125 152 140 128
               Q 155 148 170 129
               Q 185 150 200 128
               Q 215 145 230 126
               Q 238 135 240 125
               L 240 120 L 80 120 Z"
            fill="#ffffff"
            opacity="0.4"
          />

          {/* Theme specific decorations */}
          {theme.particles === 'hearts' && (
            <g fill="#fda4af">
              <circle cx="120" cy="165" r="4" />
              <circle cx="160" cy="172" r="5" />
              <circle cx="200" cy="166" r="4" />
              <circle cx="100" cy="240" r="5" />
              <circle cx="160" cy="250" r="6" />
              <circle cx="220" cy="242" r="5" />
            </g>
          )}

          {theme.particles === 'stars' && (
            <g fill="#fde047">
              <text x="115" y="170" fontSize="12">✦</text>
              <text x="155" y="178" fontSize="14">★</text>
              <text x="195" y="170" fontSize="12">✦</text>
              <text x="95" y="245" fontSize="14">✦</text>
              <text x="155" y="255" fontSize="16">★</text>
              <text x="215" y="245" fontSize="14">✦</text>
            </g>
          )}

          {/* CANDLES */}
          {Array.from({ length: candleCount }).map((_, i) => {
            const offsets = [-52, -26, 0, 26, 52];
            const yOffsets = [118, 122, 124, 122, 118];
            const x = 160 + offsets[i];
            const y = yOffsets[i];

            return (
              <g key={i} className="cursor-pointer" onClick={() => interactive && handleBlowOut()}>
                <rect
                  x={x - 4}
                  y={y - 36}
                  width="8"
                  height="36"
                  rx="3"
                  fill={i % 2 === 0 ? theme.cake.candleColor : '#ffffff'}
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="0.5"
                />
                <line
                  x1={x - 4}
                  y1={y - 28}
                  x2={x + 4}
                  y2={y - 20}
                  stroke="#fbbf24"
                  strokeWidth="2"
                  opacity="0.8"
                />
                <line
                  x1={x - 4}
                  y1={y - 16}
                  x2={x + 4}
                  y2={y - 8}
                  stroke="#fbbf24"
                  strokeWidth="2"
                  opacity="0.8"
                />
                <line
                  x1={x}
                  y1={y - 36}
                  x2={x}
                  y2={y - 42}
                  stroke="#334155"
                  strokeWidth="2"
                />

                {candlesLit ? (
                  <g className="animate-flame">
                    <circle
                      cx={x}
                      cy={y - 50}
                      r="12"
                      fill={theme.cake.flameColor}
                      opacity="0.35"
                      className="animate-pulse"
                    />
                    <path
                      d={`M ${x} ${y - 42} 
                          C ${x + 5} ${y - 46} ${x + 6} ${y - 54} ${x} ${y - 62} 
                          C ${x - 6} ${y - 54} ${x - 5} ${y - 46} ${x} ${y - 42} Z`}
                      fill="url(#flameGrad)"
                    />
                  </g>
                ) : (
                  <g className="animate-smoke">
                    <circle cx={x} cy={y - 46} r="4" fill="#94a3b8" opacity="0.6" />
                    <circle cx={x + (i % 2 === 0 ? 2 : -2)} cy={y - 54} r="6" fill="#cbd5e1" opacity="0.4" />
                    <circle cx={x + (i % 2 === 0 ? 4 : -4)} cy={y - 64} r="8" fill="#e2e8f0" opacity="0.2" />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Blowing wind visual effect */}
        {isBlowing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="flex gap-2 text-cyan-300">
              <Wind className="w-10 h-10 animate-bounce" />
              <Wind className="w-8 h-8 animate-pulse" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Interactive Controls */}
      {interactive && (
        <div className="mt-4 flex flex-col items-center gap-3 z-10 w-full max-w-sm">
          {candlesLit ? (
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              {/* PRIMARY BLOW BUTTON (Always works, no mic required) */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBlowOut}
                disabled={isBlowing}
                className="px-7 py-3 rounded-full font-bold text-sm sm:text-base flex items-center gap-2 shadow-xl transition-all duration-300 text-white"
                style={{
                  background: `linear-gradient(135deg, ${theme.accentHex}, #f43f5e)`,
                  boxShadow: `0 8px 24px -6px ${theme.accentHex}88`,
                }}
              >
                <Wind className="w-5 h-5 animate-spin" />
                <span>Blow Out the Candles 🕯️</span>
              </motion.button>

              {/* OPTIONAL MICROPHONE BLOW BUTTON */}
              <button
                type="button"
                onClick={() => setMicActive(!micActive)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                  micActive
                    ? 'bg-rose-500/30 border-rose-400 text-rose-300 animate-pulse'
                    : 'bg-white/10 hover:bg-white/15 border-white/15 text-slate-300'
                }`}
                title="Blow into your microphone to extinguish candles"
              >
                {micActive ? <Mic className="w-4 h-4 text-rose-400" /> : <MicOff className="w-4 h-4 text-slate-400" />}
                <span>{micActive ? 'Listening for breath... 🌬️' : 'Blow via Mic 🎙️'}</span>
              </button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRelight}
              className="px-6 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-amber-400/30 backdrop-blur-md shadow-lg transition-all"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Light Candles Again</span>
            </motion.button>
          )}

          {micError && (
            <p className="text-[11px] text-amber-300/80">
              Note: {micError}. You can simply click the main button above!
            </p>
          )}

          <div className="text-xs text-slate-400 font-medium">
            {candlesLit ? '(Tap candles or click button to blow)' : '✨ Candles blown out!'}
          </div>
        </div>
      )}
    </div>
  );
};
