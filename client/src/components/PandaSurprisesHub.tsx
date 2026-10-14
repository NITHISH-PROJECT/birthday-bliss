import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Music, Lock, Unlock, Cake } from 'lucide-react';
import { PandaCharacter } from './PandaCharacter';
import type { PublicSurpriseData } from '../types/surprise';

interface DiscoveredState {
  letter: boolean;
  photos: boolean;
  proposal: boolean;
  hug: boolean;
}

interface PandaSurprisesHubProps {
  surprise: PublicSurpriseData;
  discovered: DiscoveredState;
  onSelectSurprise: (surpriseKey: 'letter' | 'photos' | 'proposal' | 'hug') => void;
  candlesBlown: boolean;
  onBlowCandles: () => void;
  onViewCake?: () => void;
}

export const PandaSurprisesHub: React.FC<PandaSurprisesHubProps> = ({
  surprise,
  discovered,
  onSelectSurprise,
  candlesBlown,
  onBlowCandles,
  onViewCake,
}) => {
  const discoveredCount =
    (discovered.letter ? 1 : 0) +
    (discovered.photos ? 1 : 0) +
    (discovered.proposal ? 1 : 0) +
    (discovered.hug ? 1 : 0);

  const threePandasCompleted =
    discovered.letter && discovered.photos && discovered.proposal;

  const pandas = [
    {
      key: 'letter' as const,
      type: 'letter' as const,
      title: 'A Letter for You 💌',
      subtitle: 'A personal birthday note',
      isDiscovered: discovered.letter,
      badgeColor: 'from-rose-500 to-pink-500',
      bgColor: 'bg-gradient-to-b from-rose-50/90 to-pink-50/90 hover:from-rose-100 hover:to-pink-100',
      borderColor: 'border-rose-200 hover:border-rose-300',
    },
    {
      key: 'photos' as const,
      type: 'photos' as const,
      title: 'Our Memories 📸',
      subtitle: 'Cherished moments together',
      isDiscovered: discovered.photos,
      badgeColor: 'from-amber-500 to-orange-500',
      bgColor: 'bg-gradient-to-b from-amber-50/90 to-yellow-50/90 hover:from-amber-100 hover:to-yellow-100',
      borderColor: 'border-amber-200 hover:border-amber-300',
    },
    {
      key: 'proposal' as const,
      type: 'proposal' as const,
      title: 'Something Special 💍',
      subtitle: 'One very important question',
      isDiscovered: discovered.proposal,
      badgeColor: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-gradient-to-b from-purple-50/90 to-pink-50/90 hover:from-purple-100 hover:to-pink-100',
      borderColor: 'border-purple-200 hover:border-purple-300',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center py-6 px-4 select-none">
      {/* Top Birthday Song & Candle Blowing Banner */}
      {!candlesBlown ? (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-lg mb-6 p-4 rounded-3xl bg-gradient-to-r from-amber-100/90 via-rose-100/90 to-purple-100/90 border-2 border-rose-200/80 shadow-md flex items-center justify-between gap-3 cursor-pointer hover:scale-[1.02] transition-transform"
          onClick={onBlowCandles}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🎂</span>
            <div className="text-left">
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                Make a Birthday Wish!
              </h4>
              <p className="text-[11px] text-slate-600">
                Tap to blow out your candles & play your birthday song 🎶
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBlowCandles();
            }}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold shadow-sm shrink-0"
          >
            Blow Candles 🎂
          </button>
        </motion.div>
      ) : (
        <div className="w-full max-w-lg mb-6 flex items-center justify-between px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-rose-200/60 shadow-sm text-xs">
          <div className="flex items-center gap-2 text-rose-700 font-semibold truncate">
            <Music className="w-3.5 h-3.5 animate-spin text-rose-500 shrink-0" />
            <span className="truncate">
              Playing: {surprise.music?.trackName || 'En Neelothi - Sirai'} 🎶
            </span>
          </div>
          {onViewCake && (
            <button
              onClick={onViewCake}
              className="px-3 py-1 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors"
            >
              <Cake className="w-3 h-3 text-rose-600" />
              <span>View Cake</span>
            </button>
          )}
        </div>
      )}

      {/* Main Heading */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-rose-200 text-rose-700 text-xs font-bold shadow-sm mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Happy Birthday, {surprise.recipientName}! 🎉</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-800 tracking-tight">
          Your 4 Birthday Surprises 🐼❤️
        </h1>

        <p className="text-xs sm:text-base text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
          Three adorable pandas are waiting to present their surprises for you. Open them all to unlock something magical!
        </p>

        {/* Progress Tracker Indicator */}
        <div className="mt-4 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-md border-2 border-rose-200 shadow-md">
          <span className="text-xs sm:text-sm font-bold text-slate-700">
            Surprises discovered:{' '}
            <span className="text-rose-600 font-extrabold">{discoveredCount} of 4</span>
          </span>

          <div className="flex items-center gap-1.5">
            {[
              { id: 'letter', icon: '💌', discovered: discovered.letter },
              { id: 'photos', icon: '📸', discovered: discovered.photos },
              { id: 'proposal', icon: '💍', discovered: discovered.proposal },
              { id: 'hug', icon: '🫂', discovered: discovered.hug },
            ].map((item) => (
              <span
                key={item.id}
                title={item.discovered ? 'Completed' : 'Not yet discovered'}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                  item.discovered
                    ? 'bg-rose-500 text-white shadow-sm scale-110'
                    : 'bg-slate-200 text-slate-400 opacity-60'
                }`}
              >
                {item.icon}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* THE THREE PANDAS (Side by Side on Desktop, Responsive on Mobile) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-8">
        {pandas.map((panda, idx) => (
          <motion.div
            key={panda.key}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.6 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            onClick={() => onSelectSurprise(panda.key)}
            className={`p-6 rounded-3xl ${panda.bgColor} border-2 ${panda.borderColor} shadow-xl shadow-slate-200/60 cursor-pointer flex flex-col items-center text-center transition-all relative overflow-hidden group`}
          >
            {/* Top Badge */}
            <div className="w-full flex justify-between items-center mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Surprise {idx + 1}
              </span>
              {panda.isDiscovered ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-sm">
                  ✓ Opened
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-white/80 text-rose-600 text-[10px] font-bold border border-rose-200 animate-pulse">
                  ✨ Tap to Open
                </span>
              )}
            </div>

            {/* Panda SVG Illustration */}
            <div className="my-2">
              <PandaCharacter
                type={panda.type}
                pose={panda.isDiscovered ? 'celebrating' : 'presenting'}
                size="md"
                showLabel={false}
              />
            </div>

            {/* Card Titles */}
            <h3 className="text-lg sm:text-xl font-bold font-display text-slate-800 mt-2 mb-1 group-hover:text-rose-600 transition-colors">
              {panda.title}
            </h3>
            <p className="text-xs text-slate-600 mb-4">{panda.subtitle}</p>

            {/* Action Button */}
            <button
              type="button"
              className={`w-full py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r ${panda.badgeColor} shadow-md group-hover:scale-105 transition-transform`}
            >
              {panda.isDiscovered ? 'Revisit Surprise ✨' : 'Open Surprise 💗'}
            </button>
          </motion.div>
        ))}
      </div>

      {/* FOURTH SURPRISE: THE VIRTUAL HUG CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-2xl"
      >
        {threePandasCompleted ? (
          /* UNLOCKED VIRTUAL HUG CARD */
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectSurprise('hug')}
            className="w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-red-400 text-white shadow-2xl shadow-rose-500/40 border-2 border-white/40 cursor-pointer text-center relative overflow-hidden group"
          >
            {/* Shimmer animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-left">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 shadow-inner">
                  🫂
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/30 text-white text-[11px] font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Surprise 4 Unlocked!</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-display leading-tight">
                    A Big Virtual Hug Just For You! 🫂❤️
                  </h3>
                  <p className="text-xs sm:text-sm text-pink-100 mt-0.5">
                    All 3 pandas have come together with one final heartwarming surprise.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="px-6 py-3 rounded-full bg-white text-rose-600 font-extrabold text-sm shadow-xl shrink-0 group-hover:scale-105 transition-transform"
              >
                {discovered.hug ? 'Experience Hug Again 💗' : 'Open Virtual Hug 🫂'}
              </button>
            </div>
          </motion.div>
        ) : (
          /* LOCKED / TEASER VIRTUAL HUG CARD */
          <div className="w-full p-6 rounded-3xl bg-white/60 backdrop-blur-md border-2 border-dashed border-rose-200 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-400 flex items-center justify-center mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">
              Surprise 4: A Warm Virtual Hug 🫂
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Discover all three panda surprises above to unlock the final surprise! ({3 - (discoveredCount - (discovered.hug ? 1 : 0))} more left)
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
