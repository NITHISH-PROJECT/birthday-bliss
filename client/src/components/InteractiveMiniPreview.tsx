import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Gift, Heart, ArrowRight, RotateCcw, Volume2, Wand2 } from 'lucide-react';
import { THEMES } from '../types/themes';
import { InteractiveCake } from './InteractiveCake';
import { triggerFullCelebration } from './ConfettiEffect';
import { audioEngine } from '../utils/audioEngine';
import { Link } from 'react-router-dom';

interface InteractiveMiniPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveMiniPreview: React.FC<InteractiveMiniPreviewProps> = ({
  isOpen,
  onClose,
}) => {
  const [scene, setScene] = useState<'intro' | 'reveal' | 'cake' | 'message'>('intro');
  const [selectedThemeId, setSelectedThemeId] = useState<keyof typeof THEMES>('cake-celebration');

  const theme = THEMES[selectedThemeId];

  const handleOpenSurprise = () => {
    audioEngine.playChime();
    audioEngine.playTrack('celebration-melody');
    triggerFullCelebration();
    setScene('reveal');
  };

  const handleRestart = () => {
    setScene('intro');
    audioEngine.stopTrack();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0f0a1c] border border-white/15 shadow-2xl flex flex-col text-white"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-rose-500/20 text-rose-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="font-bold text-sm tracking-wide text-slate-200">
                Interactive Birthday Preview
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRestart}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Restart Preview"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  audioEngine.stopTrack();
                  onClose();
                }}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Theme Quick Switcher for preview */}
          <div className="px-6 py-2.5 bg-black/40 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 shrink-0">Theme:</span>
            {Object.keys(THEMES).slice(0, 4).map((key) => {
              const th = THEMES[key as keyof typeof THEMES];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedThemeId(key as keyof typeof THEMES)}
                  className={`px-3 py-1 rounded-full shrink-0 transition-all ${
                    selectedThemeId === key
                      ? 'bg-rose-500 text-white font-semibold'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {th.emoji} {th.name}
                </button>
              );
            })}
          </div>

          {/* Experience Body */}
          <div
            className={`p-6 sm:p-10 min-h-[440px] flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-700 ${theme.bgClass}`}
          >
            {/* SCENE 1: INTRO */}
            {scene === 'intro' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center flex flex-col items-center max-w-md"
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, -2, 2, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="w-28 h-28 sm:w-32 sm:h-32 mb-6 rounded-3xl bg-gradient-to-tr from-rose-500 via-purple-600 to-amber-400 p-1 shadow-2xl shadow-rose-500/30 flex items-center justify-center cursor-pointer group"
                  onClick={handleOpenSurprise}
                >
                  <div className="w-full h-full bg-[#180a29] rounded-[22px] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Gift className="w-14 h-14 text-rose-300 animate-pulse" />
                  </div>
                </motion.div>

                <p className="text-sm font-semibold tracking-wider text-rose-400 uppercase mb-2">
                  Special Delivery
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                  Someone has created something magical for you...
                </h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  Click the button below to unwrap this surprise celebration.
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenSurprise}
                  className="px-8 py-3.5 rounded-full font-bold text-base text-white bg-gradient-to-r from-rose-500 via-purple-600 to-amber-500 shadow-xl shadow-rose-500/30 flex items-center gap-2"
                >
                  <Gift className="w-5 h-5" />
                  <span>Open Your Surprise</span>
                </motion.button>
              </motion.div>
            )}

            {/* SCENE 2: REVEAL */}
            {scene === 'reveal' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center flex flex-col items-center w-full"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold mb-4 border border-white/15">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Happy Birthday, Alex! 🎉</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 font-display bg-gradient-to-r from-white via-rose-200 to-amber-200 bg-clip-text text-transparent">
                  Let the Celebration Begin!
                </h2>

                <p className="text-slate-300 text-sm sm:text-base max-w-md mb-8">
                  Get ready for sweet wishes, memories, and your special birthday cake.
                </p>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setScene('cake')}
                    className="px-6 py-3 rounded-full font-bold text-white bg-gradient-to-r from-rose-500 to-purple-600 shadow-lg flex items-center gap-2 text-sm"
                  >
                    <span>Blow The Candles</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* SCENE 3: CAKE */}
            {scene === 'cake' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center"
              >
                <InteractiveCake
                  theme={theme}
                  recipientName="Alex"
                  onBlowOut={() => {
                    setTimeout(() => {
                      // Allow time to see wish
                    }, 1200);
                  }}
                />

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setScene('message')}
                    className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 transition-all"
                  >
                    <span>Read Personal Message</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCENE 4: MESSAGE */}
            {scene === 'message' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-lg text-center"
              >
                <div className="p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl relative">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto mb-4 flex items-center justify-center">
                    <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
                  </div>

                  <h3 className="text-xl font-bold font-display text-white mb-2">
                    Dearest Alex,
                  </h3>

                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6 font-sans">
                    "Happy Birthday! You bring so much laughter, warmth, and light into every room you step into. May this year bring you endless happiness, unforgettable adventures, and everything you've dreamed of!"
                  </p>

                  <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs text-slate-300">
                    <span>From: Sam (Best Friend)</span>
                    <span className="font-cursive text-rose-300 text-base">With love ❤️</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/create"
                    onClick={() => {
                      audioEngine.stopTrack();
                      onClose();
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-white bg-gradient-to-r from-rose-500 via-purple-600 to-amber-500 shadow-xl flex items-center justify-center gap-2 text-sm"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>Create Your Own Surprise</span>
                  </Link>
                  <button
                    onClick={handleRestart}
                    className="w-full sm:w-auto px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 text-sm font-medium transition-all"
                  >
                    Replay Demo
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
