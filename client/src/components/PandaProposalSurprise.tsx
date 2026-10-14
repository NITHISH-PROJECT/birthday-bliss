import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react';
import { PandaCharacter } from './PandaCharacter';
import type { PublicSurpriseData } from '../types/surprise';
import { triggerFullCelebration, triggerStarsBurst } from './ConfettiEffect';
import { audioEngine } from '../utils/audioEngine';

interface PandaProposalSurpriseProps {
  surprise: PublicSurpriseData;
  onClose: () => void;
  onDiscovered: () => void;
}

export const PandaProposalSurprise: React.FC<PandaProposalSurpriseProps> = ({
  surprise,
  onClose,
  onDiscovered,
}) => {
  const proposalConfig = surprise.proposal;

  const question =
    proposalConfig?.question?.trim() ||
    'Will you be mine and create more beautiful memories together? 💍';

  const yesText = proposalConfig?.options?.yesText?.trim() || 'Yes, of course! ❤️';
  const alreadyText = proposalConfig?.options?.alreadyText?.trim() || 'You already have my heart! 🥹';
  const thinkText = proposalConfig?.options?.thinkText?.trim() || 'Let me think about it 💗';

  const positiveMessage =
    proposalConfig?.messages?.positiveResponse?.trim() ||
    'You just made this moment unforgettable! ❤️';

  const thinkMessage =
    proposalConfig?.messages?.thinkResponse?.trim() ||
    'Take your time. Your feelings matter. 💗';

  const [selectedResponse, setSelectedResponse] = useState<'yes' | 'already' | 'think' | null>(null);

  const handleSelectResponse = (type: 'yes' | 'already' | 'think') => {
    setSelectedResponse(type);
    onDiscovered();

    if (type === 'yes' || type === 'already') {
      audioEngine.playCelebrationCheer();
      triggerFullCelebration();
    } else {
      audioEngine.playChime();
      triggerStarsBurst();
    }
  };

  const handleReset = () => {
    setSelectedResponse(null);
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-purple-900 text-xs sm:text-sm font-bold shadow-md border border-purple-100 transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pandas 🐼</span>
        </button>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
          Surprise 3 of 4 💍
        </span>
      </div>

      {/* Intro Header */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mb-2 shadow-sm border border-purple-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span>Something Special</span>
        </motion.div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 font-display">
          I have one very special question for you... ❤️
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
          {surprise.creatorName} has prepared this special moment straight from the heart.
        </p>
      </div>

      {/* Panda Character Presentation */}
      <div className="mb-6">
        <PandaCharacter
          type="proposal"
          pose={selectedResponse ? 'celebrating' : 'presenting'}
          size="md"
          showLabel={false}
        />
      </div>

      {/* PROPOSAL QUESTION & INTERACTIVE RESPONSES */}
      <AnimatePresence mode="wait">
        {!selectedResponse ? (
          /* QUESTION CARD */
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white/95 border-2 border-purple-200 shadow-2xl shadow-purple-200/50 text-center"
          >
            {/* Pulsing Ring Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-rose-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30 text-2xl animate-bounce">
              💍
            </div>

            {/* The Question */}
            <h3 className="text-xl sm:text-2xl font-black font-display text-slate-800 mb-6 leading-snug">
              "{question}"
            </h3>

            {/* The Three Options */}
            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectResponse('yes')}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 shadow-lg shadow-rose-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>{yesText}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectResponse('already')}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base text-purple-900 bg-purple-100/90 hover:bg-purple-200/90 border border-purple-300 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{alreadyText}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectResponse('think')}
                className="w-full py-3 px-6 rounded-2xl font-semibold text-xs sm:text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <span>{thinkText}</span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* RESPONSE CELEBRATION / KIND CARD */
          <motion.div
            key="response"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white/95 border-2 border-purple-200 shadow-2xl text-center"
          >
            {selectedResponse === 'yes' || selectedResponse === 'already' ? (
              /* POSITIVE CELEBRATION */
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-purple-500 text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-rose-500/40 text-3xl"
                >
                  💖
                </motion.div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Celebration Time! 🎉</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black font-display text-slate-800 mb-3">
                  {positiveMessage}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                  You just filled {surprise.creatorName}'s world with so much happiness! Here's to making countless more unforgettable memories together. ✨
                </p>
              </div>
            ) : (
              /* THOUGHTFUL RESPONSE */
              <div>
                <div className="w-20 h-20 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-4 shadow-inner text-3xl">
                  🌸
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-3">
                  <Heart className="w-3.5 h-3.5 text-pink-600" />
                  <span>With Love & Respect</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-800 mb-3">
                  {thinkMessage}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                  No pressure at all. The most important thing is celebrating you today on your birthday! 💗
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Change Answer</span>
              </button>

              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600 text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105"
              >
                <span>Continue Surprises 🐼</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
