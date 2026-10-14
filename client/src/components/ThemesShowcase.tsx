import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { THEMES, BirthdayThemeId } from '../types/themes';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ThemesShowcase: React.FC = () => {
  const [selectedThemeId, setSelectedThemeId] = useState<BirthdayThemeId>('cake-celebration');
  const activeTheme = THEMES[selectedThemeId];

  return (
    <section id="themes" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative bg-black/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>8 Distinct Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight mb-4">
            Tailored Themes For Every Personality
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Each theme completely alters the recipient’s visual environment, ambient particles, cake icing colors, glowing flames, and emotional aesthetic.
          </p>
        </div>

        {/* 8 Theme Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {(Object.keys(THEMES) as BirthdayThemeId[]).map((themeKey) => {
            const item = THEMES[themeKey];
            const isSelected = selectedThemeId === themeKey;

            return (
              <motion.div
                key={themeKey}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedThemeId(themeKey)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all text-left relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-rose-400/80 bg-white/10 shadow-xl shadow-rose-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{item.emoji}</span>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-rose-500 text-white">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-white mb-1 font-display">
                    {item.name}
                  </h3>
                  <p className="text-xs text-rose-300 font-medium mb-2">{item.tagline}</p>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="capitalize">Particles: {item.particles}</span>
                  <div
                    className="w-3 h-3 rounded-full border border-white/40 shadow-sm"
                    style={{ backgroundColor: item.accentHex }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Active Theme Preview Card */}
        <div className="rounded-3xl p-1 bg-gradient-to-r from-rose-500/30 via-purple-500/30 to-amber-500/30 shadow-2xl">
          <div
            className={`rounded-[22px] p-6 sm:p-10 border border-white/15 transition-all duration-700 flex flex-col md:flex-row items-center justify-between gap-8 ${activeTheme.bgClass}`}
          >
            <div className="text-left flex-1">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-300">
                Selected Theme Preview
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 mb-2 font-display">
                {activeTheme.emoji} {activeTheme.name}
              </h3>
              <p className="text-slate-200 text-sm sm:text-base mb-6 max-w-xl">
                {activeTheme.description} Includes customized candle flame colors, bespoke cake icing, and ambient {activeTheme.particles} animations.
              </p>

              <Link
                to={`/create?theme=${activeTheme.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-purple-600 hover:scale-105 transition-all shadow-lg"
              >
                <span>Use {activeTheme.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Visual Accent Pill Swatch */}
            <div className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-xs text-slate-300 font-medium">Palette Elements</span>
              <div className="flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-full shadow-md border border-white/20"
                  style={{ backgroundColor: activeTheme.cake.topFrosting }}
                  title="Frosting"
                />
                <span
                  className="w-7 h-7 rounded-full shadow-md border border-white/20"
                  style={{ backgroundColor: activeTheme.cake.cakeBody }}
                  title="Cake Base"
                />
                <span
                  className="w-7 h-7 rounded-full shadow-md border border-white/20"
                  style={{ backgroundColor: activeTheme.cake.candleColor }}
                  title="Candles"
                />
                <span
                  className="w-7 h-7 rounded-full shadow-md border border-white/20"
                  style={{ backgroundColor: activeTheme.cake.flameColor }}
                  title="Flame"
                />
              </div>
              <span className="text-[11px] text-slate-400 capitalize">
                Ambient Effect: {activeTheme.particles}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
