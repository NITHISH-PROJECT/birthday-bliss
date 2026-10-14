import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowLeft } from 'lucide-react';
import { TwoTeddiesHug } from './TwoTeddiesHug';
import type { PublicSurpriseData } from '../types/surprise';
import { triggerStarsBurst } from './ConfettiEffect';
import { audioEngine } from '../utils/audioEngine';

interface PandaVirtualHugSurpriseProps {
  surprise: PublicSurpriseData;
  onClose: () => void;
  onDiscovered: () => void;
}

export const PandaVirtualHugSurprise: React.FC<PandaVirtualHugSurpriseProps> = ({
  surprise,
  onClose,
  onDiscovered,
}) => {
  const [hugSent, setHugSent] = useState(false);

  const customHugMessage =
    surprise.virtualHug?.message?.trim() ||
    'Sending you the biggest virtual hug! 🫂';

  const handleSendHugBack = () => {
    audioEngine.playChime();
    triggerStarsBurst();
    setHugSent(true);
    onDiscovered();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-2xl mx-auto flex flex-col items-center py-6 px-4 select-none"
    >
      {/* Top Navigation */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-rose-900 text-xs sm:text-sm font-bold shadow-md border border-rose-100 transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pandas 🐼</span>
        </button>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
          Surprise 4 of 4 🫂
        </span>
      </div>

      {/* Warm Romantic Header */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-2 shadow-sm border border-pink-200"
        >
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
          <span>One Last Special Surprise</span>
        </motion.div>

        <h3 className="text-lg sm:text-xl font-bold text-rose-600 mb-1">
          "One last surprise... come here! 🥹❤️"
        </h3>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 font-display">
          {customHugMessage}
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
          From {surprise.creatorName} with infinite affection, warmth, and care.
        </p>
      </div>

      {/* Two Teddies Run and Hug Stage */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="w-full max-w-lg p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-rose-100/90 via-pink-50/90 to-rose-100/90 border-2 border-pink-200 shadow-2xl shadow-pink-300/40 flex flex-col items-center relative overflow-hidden"
      >
        {/* Warm Ambient Floating Sparkles in Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-200/20 via-transparent to-rose-200/20 pointer-events-none" />

        {/* The Animated Running and Hugging Teddies */}
        <TwoTeddiesHug
          onHugTriggered={onDiscovered}
          className="w-full"
        />

        {/* Hug Received Toast if sent */}
        <AnimatePresence>
          {hugSent && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs sm:text-sm font-bold shadow-lg flex items-center gap-2 border border-white/30"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Hug received! Sending you extra love and teddy warmth! 🧸❤️</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Send Hug Back Button */}
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendHugBack}
            className="w-full sm:w-auto px-7 py-3 rounded-full font-bold text-sm text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white animate-pulse" />
            <span>Send a Hug Back 🫂</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Return to Pandas Button */}
      <div className="mt-8">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-rose-50 text-rose-800 text-xs sm:text-sm font-bold shadow-md border border-rose-200 transition-all hover:scale-105"
        >
          <span>Return to All Surprises 🐼</span>
        </button>
      </div>
    </motion.div>
  );
};
