import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, RotateCcw, Mail, Sparkles, Feather } from 'lucide-react';
import { PandaCharacter } from './PandaCharacter';
import type { PublicSurpriseData } from '../types/surprise';
import { audioEngine } from '../utils/audioEngine';

interface PandaLetterSurpriseProps {
  surprise: PublicSurpriseData;
  onClose: () => void;
  onDiscovered: () => void;
}

export const PandaLetterSurprise: React.FC<PandaLetterSurpriseProps> = ({
  surprise,
  onClose,
  onDiscovered,
}) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenLetter = () => {
    audioEngine.playChime();
    setIsOpened(true);
    onDiscovered();
  };

  const handleReplay = () => {
    setIsOpened(false);
  };

  // Letter content with fallback if creator has not provided one
  const letterContent =
    surprise.birthdayWish?.personalWish?.trim() ||
    surprise.message?.personalNote?.trim() ||
    surprise.message?.mainMessage?.trim() ||
    `Dearest ${surprise.recipientName},\n\nEvery day you bring a special warmth into this world, but today is the day we get to celebrate the extraordinary gift that is you.\n\nThank you for every shared laugh, every thoughtful word, and every sweet memory. May your new year of life be filled with radiant happiness, peace, and endless dreams coming true. Happy Birthday! ❤️`;

  const creatorSignature =
    surprise.birthdayWish?.creatorSign?.trim() ||
    `With all my heart, ${surprise.creatorName} ❤️`;

  const specialPromise = surprise.birthdayWish?.specialPromise?.trim();
  const heartfeltEnding = surprise.birthdayWish?.heartfeltMessage?.trim();

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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-rose-800 text-xs sm:text-sm font-bold shadow-md border border-rose-100 transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pandas 🐼</span>
        </button>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
          Surprise 1 of 4 💌
        </span>
      </div>

      {/* Intro Heading */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/90 text-rose-700 text-xs font-bold mb-2 shadow-sm border border-rose-200"
        >
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>A Letter for You</span>
        </motion.div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 font-display">
          Someone has written something special for you. 💌
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
          From {surprise.creatorName} ({surprise.relationship}). A heartfelt birthday letter sealed with love.
        </p>
      </div>

      {/* Panda Character Presentation */}
      <div className="mb-6">
        <PandaCharacter
          type="letter"
          pose={isOpened ? 'celebrating' : 'presenting'}
          size="md"
          showLabel={false}
        />
      </div>

      {/* Envelope / Letter Reveal */}
      <AnimatePresence mode="wait">
        {!isOpened ? (
          /* CLOSED ENVELOPE STAGE */
          <motion.div
            key="closed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md flex flex-col items-center"
          >
            {/* Sealed Envelope Graphic */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpenLetter}
              className="w-full p-8 rounded-3xl bg-gradient-to-br from-rose-100 via-pink-50 to-rose-100 border-2 border-rose-200 shadow-xl shadow-rose-200/50 flex flex-col items-center text-center cursor-pointer relative overflow-hidden group"
            >
              {/* Shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-white/40 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Heart seal icon */}
              <motion.div
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ repeat: Infinity, duration: 2.4 }}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center mb-4 shadow-lg shadow-rose-400/40"
              >
                <Heart className="w-8 h-8 fill-white" />
              </motion.div>

              <h3 className="text-xl font-bold font-display text-slate-800 mb-1">
                To My Dearest {surprise.recipientName}
              </h3>
              <p className="text-xs text-rose-600 font-medium mb-6">
                Sealed with unconditional love by {surprise.creatorName}
              </p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenLetter();
                }}
                className="px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-lg shadow-rose-500/30 hover:scale-105 transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Open My Letter ❤️</span>
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* OPENED LETTER STAGE */
          <motion.div
            key="opened"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-full"
          >
            <div className="w-full rounded-3xl bg-white/95 backdrop-blur-xl p-6 sm:p-10 border-2 border-rose-200 shadow-2xl shadow-rose-300/30 text-left relative overflow-hidden">
              {/* Decorative top ribbon */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-rose-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shadow-inner">
                    <Feather className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display text-rose-800">
                      Dearest {surprise.recipientName},
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      A personalized birthday letter
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{surprise.relationship}</span>
                </div>
              </div>

              {/* Letter Body with smooth fade & line breaks */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans mb-6"
              >
                {letterContent}
              </motion.div>

              {/* Special Promise Note if provided */}
              {specialPromise && (
                <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 text-xs sm:text-sm text-rose-900 italic mb-6">
                  <span className="font-bold not-italic block mb-0.5 text-rose-600">A Special Promise:</span>
                  "{specialPromise}"
                </div>
              )}

              {/* Heartfelt Note / Ending */}
              {heartfeltEnding && (
                <p className="text-xs text-slate-500 italic mb-4">
                  "{heartfeltEnding}"
                </p>
              )}

              {/* Signature Line */}
              <div className="pt-4 border-t border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  Prepared especially for your birthday
                </span>
                <span className="font-cursive text-xl sm:text-2xl text-rose-600 font-bold">
                  {creatorSignature}
                </span>
              </div>

              {/* Bottom Actions */}
              <div className="mt-8 pt-4 border-t border-rose-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handleReplay}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Read Again 🔄</span>
                </button>

                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105"
                >
                  <span>Continue Surprises 🐼</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
