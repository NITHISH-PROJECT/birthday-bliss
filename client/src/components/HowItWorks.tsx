import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Eye, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Personalize Your Surprise',
      description:
        'Choose from 8 distinct visual themes, write your heartfelt message, pick celebratory tunes, and optionally attach cherished photo memories.',
      icon: Palette,
      color: 'from-rose-500 to-pink-600',
      shadow: 'shadow-rose-500/20',
      highlights: ['Custom candles & cake', 'Inspiration message chips', 'Passcode protection'],
    },
    {
      number: '02',
      title: 'Preview Your Creation',
      description:
        'Step through the recipient’s exact celebration experience in real-time. Test the candle blowing, music, message reveal, and photos before sharing.',
      icon: Eye,
      color: 'from-purple-600 to-indigo-600',
      shadow: 'shadow-purple-500/20',
      highlights: ['Interactive cake blowing', 'Live music test', 'Instant edit switch'],
    },
    {
      number: '03',
      title: 'Share the Magic via Link',
      description:
        'Generate a private, unique link with an instant QR code. Send it on WhatsApp, iMessage, Instagram, or email. No recipient login required!',
      icon: Share2,
      color: 'from-amber-500 to-rose-500',
      shadow: 'shadow-amber-500/20',
      highlights: ['One-click copy & share', 'High-res QR code', 'Works on any device'],
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Effortless & Delightful</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight mb-4">
            How Birthday Bliss Works
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            In three simple steps, create an emotional, digital birthday gift that will warm their heart forever.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="glass-card-interactive rounded-3xl p-8 relative flex flex-col justify-between group"
              >
                <div>
                  {/* Step Top Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${step.color} p-0.5 shadow-xl ${step.shadow} group-hover:scale-110 transition-transform`}
                    >
                      <div className="w-full h-full bg-[#140b24] rounded-[14px] flex items-center justify-center text-white">
                        <Icon className="w-7 h-7" />
                      </div>
                    </div>
                    <span className="text-4xl font-black font-display text-white/10 group-hover:text-white/20 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-display">
                    {step.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
                  {step.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA bar */}
        <div className="mt-14 text-center">
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-rose-500 to-purple-600 hover:scale-105 transition-transform shadow-lg shadow-rose-500/25"
          >
            <span>Start Personalizing Now</span>
            <span>✨</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
