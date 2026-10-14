import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareHeart, Cake, Music, Images, Sparkles, Link2 } from 'lucide-react';

export const FeatureCards: React.FC = () => {
  const features = [
    {
      title: 'Personalized Birthday Messages',
      description:
        'Craft emotional, tailored letters with inspired message prompts, custom subtitles, nicknames, and heartfelt handwritten signatures.',
      icon: MessageSquareHeart,
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      title: 'Animated Birthday Cake',
      description:
        'A realistic SVG birthday cake with glowing flickering candles. Recipients can tap or blow out the candles to reveal their magical wish!',
      icon: Cake,
      gradient: 'from-amber-500 to-yellow-600',
    },
    {
      title: 'Curated Celebratory Music',
      description:
        'Curated celebratory music tracks and sound effects generated via Web Audio that play reliably without 404s or autoplay restrictions.',
      icon: Music,
      gradient: 'from-purple-500 to-indigo-600',
    },
    {
      title: 'Photo Memories Gallery',
      description:
        'Attach cherished photographs with personalized captions, carousel controls, and full-screen lightbox viewing for nostalgic moments.',
      icon: Images,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Interactive Magical Surprises',
      description:
        'Full-screen confetti cannons, floating balloon physics, sparkling stardust, and celebratory cheer effects tailored to the theme.',
      icon: Sparkles,
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      title: 'Shareable Links & QR Codes',
      description:
        'Instant unpredictable share link with native Web Share API support and downloadable QR codes for easy texting or card printing.',
      icon: Link2,
      gradient: 'from-fuchsia-500 to-rose-600',
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight mb-4">
            Everything You Need To Create Pure Magic
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Every feature is designed to make the recipient feel deeply loved, celebrated, and amazed on their special day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card-interactive p-7 sm:p-8 rounded-3xl flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feature.gradient} p-0.5 shadow-lg mb-6`}
                  >
                    <div className="w-full h-full bg-[#130b22] rounded-[14px] flex items-center justify-center text-white">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold font-display text-white mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
