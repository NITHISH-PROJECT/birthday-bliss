export type BirthdayThemeId =
  | 'cake-celebration'
  | 'galaxy-birthday'
  | 'classic-birthday'
  | 'cute-pastel'
  | 'romantic-birthday'
  | 'friendship-celebration'
  | 'photo-memories'
  | 'minimal-elegant';

export interface ThemeDefinition {
  id: BirthdayThemeId;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  gradientBadge: string;
  bgClass: string;
  cardBgClass: string;
  accentColor: string;
  accentHex: string;
  textAccentClass: string;
  cake: {
    topFrosting: string;
    cakeBody: string;
    cakeBase: string;
    candleColor: string;
    flameColor: string;
    details: string;
  };
  particles: 'confetti' | 'stars' | 'balloons' | 'pastels' | 'hearts' | 'sparkles' | 'lights' | 'gold-dust';
}

export const THEMES: Record<BirthdayThemeId, ThemeDefinition> = {
  'cake-celebration': {
    id: 'cake-celebration',
    name: 'Cake Celebration',
    tagline: 'Sweet, festive & joyful',
    description: 'A mouthwatering celebration with glowing candles, rich strawberry frosting, and festive confetti.',
    emoji: '🎂',
    gradientBadge: 'from-rose-500 via-pink-500 to-amber-400',
    bgClass: 'bg-gradient-to-b from-[#180918] via-[#210d1e] to-[#0d040e]',
    cardBgClass: 'bg-rose-950/40 border-rose-500/20 shadow-rose-950/50',
    accentColor: 'rose',
    accentHex: '#f43f5e',
    textAccentClass: 'text-rose-400',
    cake: {
      topFrosting: '#fda4af',
      cakeBody: '#be123c',
      cakeBase: '#ffe4e6',
      candleColor: '#fb7185',
      flameColor: '#fbbf24',
      details: 'berries',
    },
    particles: 'confetti',
  },
  'galaxy-birthday': {
    id: 'galaxy-birthday',
    name: 'Galaxy Birthday',
    tagline: 'Cosmic wonder & stardust',
    description: 'Drift across starry nebulas with glowing neon candles and deep cosmic purple skies.',
    emoji: '🌌',
    gradientBadge: 'from-indigo-600 via-purple-600 to-cyan-400',
    bgClass: 'bg-gradient-to-b from-[#08051a] via-[#120a2e] to-[#04020d]',
    cardBgClass: 'bg-indigo-950/40 border-purple-500/20 shadow-purple-950/50',
    accentColor: 'purple',
    accentHex: '#a855f7',
    textAccentClass: 'text-purple-400',
    cake: {
      topFrosting: '#c084fc',
      cakeBody: '#3b0764',
      cakeBase: '#38bdf8',
      candleColor: '#818cf8',
      flameColor: '#38bdf8',
      details: 'stars',
    },
    particles: 'stars',
  },
  'classic-birthday': {
    id: 'classic-birthday',
    name: 'Classic Birthday',
    tagline: 'Traditional, vibrant & timeless',
    description: 'Warm celebratory colors, festive party balloons, and the beloved birthday spirit.',
    emoji: '🎉',
    gradientBadge: 'from-amber-500 via-red-500 to-pink-500',
    bgClass: 'bg-gradient-to-b from-[#1c1208] via-[#2a1310] to-[#0d0705]',
    cardBgClass: 'bg-amber-950/40 border-amber-500/20 shadow-amber-950/50',
    accentColor: 'amber',
    accentHex: '#f59e0b',
    textAccentClass: 'text-amber-400',
    cake: {
      topFrosting: '#fed7aa',
      cakeBody: '#ea580c',
      cakeBase: '#fef08a',
      candleColor: '#f97316',
      flameColor: '#fde047',
      details: 'sprinkles',
    },
    particles: 'balloons',
  },
  'cute-pastel': {
    id: 'cute-pastel',
    name: 'Cute Pastel Birthday',
    tagline: 'Soft marshmallows & dreaminess',
    description: 'Gentle pastel hues, fluffy clouds, sweet ribbons, and whimsical wonderland vibes.',
    emoji: '🌸',
    gradientBadge: 'from-pink-300 via-purple-300 to-teal-200',
    bgClass: 'bg-gradient-to-b from-[#181124] via-[#221633] to-[#0d0914]',
    cardBgClass: 'bg-pink-950/30 border-pink-400/20 shadow-pink-950/50',
    accentColor: 'pink',
    accentHex: '#f472b6',
    textAccentClass: 'text-pink-300',
    cake: {
      topFrosting: '#fbcfe8',
      cakeBody: '#f472b6',
      cakeBase: '#c7d2fe',
      candleColor: '#a7f3d0',
      flameColor: '#fde047',
      details: 'macarons',
    },
    particles: 'pastels',
  },
  'romantic-birthday': {
    id: 'romantic-birthday',
    name: 'Romantic Birthday',
    tagline: 'Heartfelt passion & roses',
    description: 'Deep velvet crimson, champagne gold accents, floating glowing hearts, and tender elegance.',
    emoji: '💖',
    gradientBadge: 'from-rose-600 via-red-600 to-amber-300',
    bgClass: 'bg-gradient-to-b from-[#1c080e] via-[#260914] to-[#0d0206]',
    cardBgClass: 'bg-red-950/40 border-rose-500/30 shadow-rose-950/50',
    accentColor: 'red',
    accentHex: '#e11d48',
    textAccentClass: 'text-rose-400',
    cake: {
      topFrosting: '#fecdd3',
      cakeBody: '#9f1239',
      cakeBase: '#fbbf24',
      candleColor: '#f43f5e',
      flameColor: '#fbbf24',
      details: 'rosepetals',
    },
    particles: 'hearts',
  },
  'friendship-celebration': {
    id: 'friendship-celebration',
    name: 'Friendship Celebration',
    tagline: 'Unbreakable bonds & pure fun',
    description: 'Vibrant sunburst coral, laughter, shared memories, and energetic party energy.',
    emoji: '🥂',
    gradientBadge: 'from-orange-500 via-amber-400 to-yellow-300',
    bgClass: 'bg-gradient-to-b from-[#1a1107] via-[#291807] to-[#0c0802]',
    cardBgClass: 'bg-orange-950/40 border-orange-500/20 shadow-orange-950/50',
    accentColor: 'orange',
    accentHex: '#f97316',
    textAccentClass: 'text-orange-400',
    cake: {
      topFrosting: '#fed7aa',
      cakeBody: '#c2410c',
      cakeBase: '#fde047',
      candleColor: '#fb923c',
      flameColor: '#fef08a',
      details: 'cheers',
    },
    particles: 'sparkles',
  },
  'photo-memories': {
    id: 'photo-memories',
    name: 'Photo Memories',
    tagline: 'Nostalgic Polaroid warmth',
    description: 'A cozy candlelit trip down memory lane with fairy lights, golden memories, and nostalgia.',
    emoji: '📸',
    gradientBadge: 'from-amber-600 via-rose-500 to-orange-400',
    bgClass: 'bg-gradient-to-b from-[#1a120c] via-[#241512] to-[#0e0705]',
    cardBgClass: 'bg-amber-950/40 border-amber-600/20 shadow-stone-950/50',
    accentColor: 'amber',
    accentHex: '#d97706',
    textAccentClass: 'text-amber-300',
    cake: {
      topFrosting: '#ffedd5',
      cakeBody: '#9a3412',
      cakeBase: '#fed7aa',
      candleColor: '#f59e0b',
      flameColor: '#fbbf24',
      details: 'polaroid',
    },
    particles: 'lights',
  },
  'minimal-elegant': {
    id: 'minimal-elegant',
    name: 'Minimal Elegant',
    tagline: 'Understated luxury & gold foil',
    description: 'Sleek obsidian black, crisp typography, champagne gold dust, and timeless luxury.',
    emoji: '✨',
    gradientBadge: 'from-neutral-200 via-amber-200 to-amber-500',
    bgClass: 'bg-gradient-to-b from-[#0c0d12] via-[#12131a] to-[#060608]',
    cardBgClass: 'bg-neutral-900/60 border-amber-400/20 shadow-black/60',
    accentColor: 'gold',
    accentHex: '#fbbf24',
    textAccentClass: 'text-amber-300',
    cake: {
      topFrosting: '#fef3c7',
      cakeBody: '#1e293b',
      cakeBase: '#fbbf24',
      candleColor: '#f59e0b',
      flameColor: '#fef08a',
      details: 'goldleaf',
    },
    particles: 'gold-dust',
  },
};
