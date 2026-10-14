import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Gift, Play, ArrowRight, Heart } from 'lucide-react';
import { AmbientParticles } from './ConfettiEffect';

interface HeroSectionProps {
  onOpenPreview: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenPreview }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[500px] bg-gradient-to-tr from-rose-600/20 via-purple-600/25 to-amber-500/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Floating ambient party elements */}
      <AmbientParticles type="confetti" count={12} />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
        {/* Magic Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500/15 via-purple-500/15 to-amber-500/15 border border-white/10 backdrop-blur-xl mb-8 shadow-inner"
        >
          <span className="flex h-2 w-2 rounded-full bg-rose-400 animate-ping" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide bg-gradient-to-r from-rose-300 via-purple-200 to-amber-200 bg-clip-text text-transparent">
            Digital Birthday Surprise Creator
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display max-w-4xl leading-[1.1] mb-6"
        >
          Make Their Birthday{' '}
          <span className="bg-gradient-to-r from-rose-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent underline decoration-rose-500/30 decoration-wavy">
            Unforgettable
          </span>
        </motion.h1>

        {/* Supporting Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed font-normal"
        >
          Create a beautiful birthday surprise filled with memories, music, wishes, and a little magic. Personalized in minutes and delivered as an interactive digital gift.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto"
        >
          <Link
            to="/create"
            className="w-full sm:w-auto group relative px-8 py-4 rounded-full font-bold text-white text-base overflow-hidden shadow-2xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-purple-600 to-amber-500 group-hover:opacity-95" />
            <div className="relative flex items-center justify-center gap-2.5">
              <Gift className="w-5 h-5 animate-bounce" />
              <span>Create Your Surprise</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <button
            onClick={onOpenPreview}
            className="w-full sm:w-auto px-7 py-4 rounded-full font-semibold text-slate-200 text-base glass-panel-light hover:bg-white/10 hover:text-white border border-white/15 transition-all flex items-center justify-center gap-2.5 hover:scale-105 shadow-lg"
          >
            <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Play className="w-3 h-3 fill-rose-400" />
            </div>
            <span>See How It Works</span>
          </button>
        </motion.div>

        {/* Hero Interactive Card Mockup Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-16 sm:mt-20 w-full max-w-4xl relative"
        >
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-2xl shadow-purple-950/50">
            <div className="relative rounded-[22px] bg-[#130b24]/90 backdrop-blur-2xl p-6 sm:p-10 border border-white/10 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              
              {/* Left Side: Mock Experience Content */}
              <div className="flex-1 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-3">
                  <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
                  <span>Real Recipient Experience</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-2">
                  "Happy Birthday, Sarah! 🎂"
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-md">
                  From virtual candles you can blow out, to a personalized letter and photo memories set to celebratory music.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                    <span className="text-amber-400">🎵</span> 4 Ambient Tracks
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                    <span className="text-rose-400">🎨</span> 8 Visual Themes
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                    <span className="text-purple-400">🔒</span> Optional Passcode
                  </div>
                </div>
              </div>

              {/* Right Side: Interactive Preview Miniature Visual */}
              <div className="relative flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-white/10 w-full md:w-80 text-center">
                <div className="text-5xl mb-2 animate-bounce">🎂</div>
                <div className="text-sm font-bold text-amber-300 mb-1">Make a Wish!</div>
                <div className="text-xs text-slate-400 mb-4">Click below to experience the celebration flow</div>
                <button
                  onClick={onOpenPreview}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:scale-105 transition-transform shadow-md"
                >
                  Experience Live Demo
                </button>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
