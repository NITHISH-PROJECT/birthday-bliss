import React from 'react';
import { motion } from 'framer-motion';

export type PandaType = 'letter' | 'photos' | 'proposal' | 'hug';

interface PandaCharacterProps {
  type: PandaType;
  pose?: 'idle' | 'presenting' | 'celebrating' | 'hugging';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isDiscovered?: boolean;
  onClick?: () => void;
  className?: string;
  showLabel?: boolean;
}

export const PandaCharacter: React.FC<PandaCharacterProps> = ({
  type,
  pose = 'idle',
  size = 'md',
  isDiscovered = false,
  onClick,
  className = '',
  showLabel = true,
}) => {
  const sizeMap = {
    sm: 'w-24 h-28',
    md: 'w-36 h-44 sm:w-44 sm:h-52',
    lg: 'w-48 h-56 sm:w-56 sm:h-64',
    xl: 'w-64 h-72 sm:w-80 sm:h-88',
  };

  const getLabelInfo = () => {
    switch (type) {
      case 'letter':
        return {
          title: 'A Letter for You 💌',
          subtitle: 'Read my secret message',
          badgeBg: 'bg-rose-100 text-rose-700 border-rose-200',
        };
      case 'photos':
        return {
          title: 'Our Memories 📸',
          subtitle: 'Cherished moments together',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
        };
      case 'proposal':
        return {
          title: 'Something Special 💍',
          subtitle: 'One very important question',
          badgeBg: 'bg-purple-100 text-purple-700 border-purple-200',
        };
      case 'hug':
        return {
          title: 'A Virtual Hug 🫂',
          subtitle: 'Warmest embrace for you',
          badgeBg: 'bg-pink-100 text-pink-700 border-pink-200',
        };
    }
  };

  const labelInfo = getLabelInfo();

  return (
    <motion.div
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05, y: -6 } : {}}
      whileTap={onClick ? { scale: 0.96 } : {}}
      className={`flex flex-col items-center select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      <div className={`relative ${sizeMap[size]} flex items-center justify-center`}>
        {/* Soft magical glow backdrop */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-rose-200/40 via-pink-100/30 to-amber-100/30 filter blur-xl transform scale-90 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />

        {/* SVG ILLUSTRATIONS */}
        {type === 'letter' && (
          <svg
            viewBox="0 0 200 240"
            className="w-full h-full drop-shadow-md overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="pandaBody1" x1="100" y1="120" x2="100" y2="220" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" />
                <stop offset="1" stopColor="#F5F5FA" />
              </linearGradient>
              <linearGradient id="envelopeGrad" x1="70" y1="140" x2="130" y2="185" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFAEC9" />
                <stop offset="1" stopColor="#F783AC" />
              </linearGradient>
              <filter id="shadowPanda1" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#9C6B82" floodOpacity="0.18" />
              </filter>
            </defs>

            {/* Ground Shadow */}
            <ellipse cx="100" cy="225" rx="55" ry="10" fill="#E8D7DF" opacity="0.6" />

            {/* Left Ear */}
            <motion.ellipse
              cx="54"
              cy="52"
              rx="22"
              ry="24"
              fill="#26252D"
              animate={{ rotate: [-2, 3, -2] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            />
            <ellipse cx="54" cy="54" rx="12" ry="13" fill="#FFC2D4" opacity="0.4" />

            {/* Right Ear */}
            <motion.ellipse
              cx="146"
              cy="52"
              rx="22"
              ry="24"
              fill="#26252D"
              animate={{ rotate: [2, -3, 2] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            />
            <ellipse cx="146" cy="54" rx="12" ry="13" fill="#FFC2D4" opacity="0.4" />

            {/* Cute Pink Bow on Right Ear */}
            <g transform="translate(138, 38) rotate(18)">
              <path d="M-10 -2 C-16 -8 -16 8 -10 2 Z" fill="#FF6B8B" />
              <path d="M10 -2 C16 -8 16 8 10 2 Z" fill="#FF6B8B" />
              <circle cx="0" cy="0" r="4" fill="#FFAEC9" />
            </g>

            {/* Chubby Body */}
            <ellipse cx="100" cy="165" rx="58" ry="52" fill="url(#pandaBody1)" filter="url(#shadowPanda1)" />
            {/* Dark back coat pattern */}
            <path
              d="M48 150 Q100 130 152 150 Q158 195 145 208 Q100 216 55 208 Q42 195 48 150 Z"
              fill="#2C2B36"
            />
            <ellipse cx="100" cy="174" rx="38" ry="32" fill="#FFFFFF" />

            {/* Head */}
            <ellipse cx="100" cy="100" rx="56" ry="48" fill="url(#pandaBody1)" filter="url(#shadowPanda1)" />

            {/* Eye Patches */}
            <ellipse cx="73" cy="98" rx="17" ry="15" transform="rotate(-15 73 98)" fill="#2C2B36" />
            <ellipse cx="127" cy="98" rx="17" ry="15" transform="rotate(15 127 98)" fill="#2C2B36" />

            {/* Big Sparkly Eyes */}
            <circle cx="75" cy="97" r="7" fill="#FFFFFF" />
            <circle cx="77" cy="95" r="3.5" fill="#1A1920" />
            <circle cx="75" cy="93.5" r="1.5" fill="#FFFFFF" />
            <circle cx="78.5" cy="97.5" r="0.9" fill="#FFFFFF" />

            <circle cx="125" cy="97" r="7" fill="#FFFFFF" />
            <circle cx="123" cy="95" r="3.5" fill="#1A1920" />
            <circle cx="124.5" cy="93.5" r="1.5" fill="#FFFFFF" />
            <circle cx="121.5" cy="97.5" r="0.9" fill="#FFFFFF" />

            {/* Blushing Cheeks */}
            <ellipse cx="62" cy="115" rx="11" ry="6" fill="#FF9EBA" opacity="0.65" />
            <ellipse cx="138" cy="115" rx="11" ry="6" fill="#FF9EBA" opacity="0.65" />

            {/* Nose & Smile */}
            <path d="M96 107 C96 104 104 104 104 107 C104 110 96 110 96 107 Z" fill="#2C2B36" />
            <path d="M95 111 Q100 115 105 111" stroke="#2C2B36" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M97 114 Q100 119 103 114" fill="#FF6B8B" />

            {/* Little Feet */}
            <ellipse cx="68" cy="214" rx="16" ry="11" fill="#2C2B36" />
            <ellipse cx="132" cy="214" rx="16" ry="11" fill="#2C2B36" />
            <circle cx="68" cy="212" r="5" fill="#FFC2D4" opacity="0.6" />
            <circle cx="132" cy="212" r="5" fill="#FFC2D4" opacity="0.6" />

            {/* Hands holding the Pink Envelope */}
            {/* The Envelope */}
            <motion.g
              animate={
                pose === 'presenting'
                  ? { y: [-2, -8, -2], scale: [1, 1.05, 1] }
                  : { y: [0, -3, 0] }
              }
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <rect x="62" y="142" width="76" height="48" rx="7" fill="url(#envelopeGrad)" filter="url(#shadowPanda1)" />
              {/* Envelope Flap Lines */}
              <path d="M62 144 L100 168 L138 144" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.8" fill="none" />
              <path d="M62 190 L90 165" stroke="#F06595" strokeWidth="1.5" strokeOpacity="0.4" />
              <path d="M138 190 L110 165" stroke="#F06595" strokeWidth="1.5" strokeOpacity="0.4" />
              {/* Heart Seal */}
              <path
                d="M100 168 C98 164 92 163 92 168 C92 173 100 178 100 178 C100 178 108 173 108 168 C108 163 102 164 100 168 Z"
                fill="#FF1E56"
              />
              <circle cx="98" cy="166" r="1" fill="#FFFFFF" opacity="0.8" />
            </motion.g>

            {/* Left Arm & Paw holding envelope edge */}
            <ellipse cx="58" cy="164" rx="14" ry="18" transform="rotate(25 58 164)" fill="#2C2B36" />
            <circle cx="68" cy="166" r="7" fill="#2C2B36" />

            {/* Right Arm & Paw holding envelope edge */}
            <ellipse cx="142" cy="164" rx="14" ry="18" transform="rotate(-25 142 164)" fill="#2C2B36" />
            <circle cx="132" cy="166" r="7" fill="#2C2B36" />

            {/* Floating Sparkles & Hearts */}
            <motion.path
              d="M155 85 C153 82 148 81 148 85 C148 89 155 93 155 93 C155 93 162 89 162 85 C162 81 157 82 155 85 Z"
              fill="#FF6B8B"
              animate={{ y: [0, -8, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            />
            <motion.circle
              cx="45"
              cy="95"
              r="2.5"
              fill="#FFD166"
              animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </svg>
        )}

        {type === 'photos' && (
          <svg
            viewBox="0 0 200 240"
            className="w-full h-full drop-shadow-md overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="pandaBody2" x1="100" y1="120" x2="100" y2="220" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" />
                <stop offset="1" stopColor="#F5F5FA" />
              </linearGradient>
              <linearGradient id="photoSky" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#FFD166" />
                <stop offset="0.5" stopColor="#F783AC" />
                <stop offset="1" stopColor="#9C36B5" />
              </linearGradient>
              <filter id="shadowPanda2" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#8B7B6B" floodOpacity="0.18" />
              </filter>
            </defs>

            {/* Ground Shadow */}
            <ellipse cx="100" cy="225" rx="55" ry="10" fill="#E8D7DF" opacity="0.6" />

            {/* Left Ear */}
            <motion.ellipse
              cx="54"
              cy="52"
              rx="22"
              ry="24"
              fill="#26252D"
              animate={{ rotate: [-3, 2, -3] }}
              transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut' }}
            />
            <ellipse cx="54" cy="54" rx="12" ry="13" fill="#FFC2D4" opacity="0.4" />

            {/* Right Ear */}
            <motion.ellipse
              cx="146"
              cy="52"
              rx="22"
              ry="24"
              fill="#26252D"
              animate={{ rotate: [3, -2, 3] }}
              transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut' }}
            />
            <ellipse cx="146" cy="54" rx="12" ry="13" fill="#FFC2D4" opacity="0.4" />

            {/* Cute Yellow Flower or Camera Ribbon */}
            <g transform="translate(60, 42)">
              <circle cx="-5" cy="0" r="4" fill="#FFD166" />
              <circle cx="5" cy="0" r="4" fill="#FFD166" />
              <circle cx="0" cy="-5" r="4" fill="#FFD166" />
              <circle cx="0" cy="5" r="4" fill="#FFD166" />
              <circle cx="0" cy="0" r="3" fill="#FFAEC9" />
            </g>

            {/* Chubby Body */}
            <ellipse cx="100" cy="165" rx="58" ry="52" fill="url(#pandaBody2)" filter="url(#shadowPanda2)" />
            <path
              d="M48 150 Q100 130 152 150 Q158 195 145 208 Q100 216 55 208 Q42 195 48 150 Z"
              fill="#2C2B36"
            />
            <ellipse cx="100" cy="174" rx="38" ry="32" fill="#FFFFFF" />

            {/* Head - Slightly Tilted for Cutest Pose */}
            <ellipse cx="100" cy="100" rx="56" ry="48" fill="url(#pandaBody2)" filter="url(#shadowPanda2)" />

            {/* Eye Patches */}
            <ellipse cx="73" cy="98" rx="17" ry="15" transform="rotate(-12 73 98)" fill="#2C2B36" />
            <ellipse cx="127" cy="98" rx="17" ry="15" transform="rotate(12 127 98)" fill="#2C2B36" />

            {/* Left Eye: Happy Winking Arc! */}
            <path
              d="M66 98 Q73 91 80 98"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Right Eye: Big Sparkly Eye */}
            <circle cx="126" cy="97" r="7" fill="#FFFFFF" />
            <circle cx="124" cy="95" r="3.5" fill="#1A1920" />
            <circle cx="125.5" cy="93.5" r="1.5" fill="#FFFFFF" />
            <circle cx="122.5" cy="97.5" r="0.9" fill="#FFFFFF" />

            {/* Blushing Cheeks */}
            <ellipse cx="62" cy="115" rx="11" ry="6" fill="#FF9EBA" opacity="0.65" />
            <ellipse cx="138" cy="115" rx="11" ry="6" fill="#FF9EBA" opacity="0.65" />

            {/* Nose & Sweet Open Smile */}
            <path d="M96 107 C96 104 104 104 104 107 C104 110 96 110 96 107 Z" fill="#2C2B36" />
            <path d="M95 111 Q100 117 105 111" stroke="#2C2B36" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M97 114 Q100 120 103 114" fill="#FF6B8B" />

            {/* Little Feet */}
            <ellipse cx="68" cy="214" rx="16" ry="11" fill="#2C2B36" />
            <ellipse cx="132" cy="214" rx="16" ry="11" fill="#2C2B36" />
            <circle cx="68" cy="212" r="5" fill="#FFC2D4" opacity="0.6" />
            <circle cx="132" cy="212" r="5" fill="#FFC2D4" opacity="0.6" />

            {/* The Polaroid Photo Frame */}
            <motion.g
              animate={
                pose === 'presenting'
                  ? { rotate: [-2, 3, -2], y: [-2, -6, -2] }
                  : { rotate: [-1, 2, -1], y: [0, -2, 0] }
              }
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              transform-origin="100 165"
            >
              {/* Polaroid Card */}
              <rect x="62" y="136" width="76" height="60" rx="4" fill="#FFFFFF" stroke="#EAE6EE" strokeWidth="1.5" filter="url(#shadowPanda2)" />
              {/* Photo inside */}
              <rect x="68" y="142" width="64" height="40" rx="3" fill="url(#photoSky)" />
              {/* Mini sunset & mountain & heart */}
              <circle cx="100" cy="154" r="8" fill="#FFF275" opacity="0.9" />
              <path d="M68 182 L84 168 L102 182 Z" fill="#7928CA" opacity="0.8" />
              <path d="M92 182 L112 165 L132 182 Z" fill="#FF0080" opacity="0.7" />
              {/* Little red heart sticker on polaroid */}
              <path
                d="M100 190 C98 187 94 186 94 189 C94 193 100 196 100 196 C100 196 106 193 106 189 C106 186 102 187 100 190 Z"
                fill="#FF3366"
              />
            </motion.g>

            {/* Left and Right Paws holding Polaroid */}
            <ellipse cx="58" cy="164" rx="14" ry="18" transform="rotate(20 58 164)" fill="#2C2B36" />
            <circle cx="67" cy="166" r="7" fill="#2C2B36" />

            <ellipse cx="142" cy="164" rx="14" ry="18" transform="rotate(-20 142 164)" fill="#2C2B36" />
            <circle cx="133" cy="166" r="7" fill="#2C2B36" />

            {/* Sparkles around photo */}
            <motion.path
              d="M152 135 L154 139 L158 141 L154 143 L152 147 L150 143 L146 141 L150 139 Z"
              fill="#FFD166"
              animate={{ rotate: 360, scale: [0.8, 1.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            />
            <motion.path
              d="M44 142 L46 145 L49 146 L46 147 L44 150 L42 147 L39 146 L42 145 Z"
              fill="#FF9EBA"
              animate={{ scale: [0.7, 1.2, 0.7] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
            />
          </svg>
        )}

        {type === 'proposal' && (
          <svg
            viewBox="0 0 200 240"
            className="w-full h-full drop-shadow-md overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="pandaBody3" x1="100" y1="120" x2="100" y2="220" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" />
                <stop offset="1" stopColor="#F5F5FA" />
              </linearGradient>
              <linearGradient id="velvetBox" x1="75" y1="140" x2="125" y2="190" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D90429" />
                <stop offset="0.7" stopColor="#9B001D" />
                <stop offset="1" stopColor="#5E0012" />
              </linearGradient>
              <linearGradient id="diamondGlint" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#FFFFFF" />
                <stop offset="0.5" stopColor="#E0F2FE" />
                <stop offset="1" stopColor="#93C5FD" />
              </linearGradient>
              <filter id="shadowPanda3" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#8B4358" floodOpacity="0.22" />
              </filter>
            </defs>

            {/* Ground Shadow */}
            <ellipse cx="100" cy="225" rx="55" ry="10" fill="#E8D7DF" opacity="0.6" />

            {/* Left Ear */}
            <motion.ellipse
              cx="54"
              cy="52"
              rx="22"
              ry="24"
              fill="#26252D"
              animate={{ rotate: [-2, 3, -2] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
            />
            <ellipse cx="54" cy="54" rx="12" ry="13" fill="#FFC2D4" opacity="0.4" />

            {/* Right Ear */}
            <motion.ellipse
              cx="146"
              cy="52"
              rx="22"
              ry="24"
              fill="#26252D"
              animate={{ rotate: [2, -3, 2] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
            />
            <ellipse cx="146" cy="54" rx="12" ry="13" fill="#FFC2D4" opacity="0.4" />

            {/* Tiny Floating Heart crown */}
            <motion.path
              d="M100 38 C97 33 90 32 90 38 C90 44 100 49 100 49 C100 49 110 44 110 38 C110 32 103 33 100 38 Z"
              fill="#FF1E56"
              animate={{ y: [0, -4, 0], scale: [0.9, 1.15, 0.9] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
            />

            {/* Chubby Body */}
            <ellipse cx="100" cy="165" rx="58" ry="52" fill="url(#pandaBody3)" filter="url(#shadowPanda3)" />
            <path
              d="M48 150 Q100 130 152 150 Q158 195 145 208 Q100 216 55 208 Q42 195 48 150 Z"
              fill="#2C2B36"
            />
            <ellipse cx="100" cy="174" rx="38" ry="32" fill="#FFFFFF" />

            {/* Head */}
            <ellipse cx="100" cy="100" rx="56" ry="48" fill="url(#pandaBody3)" filter="url(#shadowPanda3)" />

            {/* Eye Patches */}
            <ellipse cx="73" cy="98" rx="17" ry="15" transform="rotate(-15 73 98)" fill="#2C2B36" />
            <ellipse cx="127" cy="98" rx="17" ry="15" transform="rotate(15 127 98)" fill="#2C2B36" />

            {/* Romantic Sparkly Anime Eyes */}
            <circle cx="75" cy="97" r="7.5" fill="#FFFFFF" />
            <circle cx="77" cy="95" r="4" fill="#1A1920" />
            <circle cx="75" cy="93.5" r="2" fill="#FFFFFF" />
            <circle cx="78.5" cy="98" r="1.2" fill="#FFFFFF" />
            {/* Heart reflection in eye */}
            <circle cx="74" cy="99" r="0.8" fill="#FF8DA1" />

            <circle cx="125" cy="97" r="7.5" fill="#FFFFFF" />
            <circle cx="123" cy="95" r="4" fill="#1A1920" />
            <circle cx="124.5" cy="93.5" r="2" fill="#FFFFFF" />
            <circle cx="121.5" cy="98" r="1.2" fill="#FFFFFF" />
            <circle cx="126" cy="99" r="0.8" fill="#FF8DA1" />

            {/* Extra Rosy Blushing Cheeks for Proposal */}
            <ellipse cx="62" cy="115" rx="13" ry="7" fill="#FF85A2" opacity="0.8" />
            <ellipse cx="138" cy="115" rx="13" ry="7" fill="#FF85A2" opacity="0.8" />

            {/* Nose & Sweet Shy Smile */}
            <path d="M96 107 C96 104 104 104 104 107 C104 110 96 110 96 107 Z" fill="#2C2B36" />
            <path d="M96 111 Q100 115 104 111" stroke="#2C2B36" strokeWidth="2.5" strokeLinecap="round" />

            {/* Little Feet */}
            <ellipse cx="68" cy="214" rx="16" ry="11" fill="#2C2B36" />
            <ellipse cx="132" cy="214" rx="16" ry="11" fill="#2C2B36" />
            <circle cx="68" cy="212" r="5" fill="#FFC2D4" opacity="0.6" />
            <circle cx="132" cy="212" r="5" fill="#FFC2D4" opacity="0.6" />

            {/* Heart-Shaped Ring Box & Diamond Ring */}
            <motion.g
              animate={
                pose === 'presenting' || pose === 'celebrating'
                  ? { y: [-3, -9, -3], scale: [1, 1.08, 1] }
                  : { y: [0, -3, 0] }
              }
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
            >
              {/* Velvet Ring Box Bottom */}
              <path
                d="M100 150 C90 136 70 138 70 156 C70 174 100 192 100 192 C100 192 130 174 130 156 C130 138 110 136 100 150 Z"
                fill="url(#velvetBox)"
                filter="url(#shadowPanda3)"
              />
              {/* Inner White Satin Ring Pillow */}
              <ellipse cx="100" cy="162" rx="18" ry="12" fill="#FFFFFF" opacity="0.95" />
              <ellipse cx="100" cy="163" rx="14" ry="7" fill="#FCE7F3" opacity="0.9" />

              {/* The Gold Ring Band */}
              <ellipse cx="100" cy="158" rx="7" ry="4" stroke="#F59E0B" strokeWidth="2" fill="none" />

              {/* The Sparkling Diamond */}
              <polygon points="100,147 106,153 100,159 94,153" fill="url(#diamondGlint)" stroke="#60A5FA" strokeWidth="0.8" />
              <polygon points="98,149 102,149 104,153 100,157 96,153" fill="#FFFFFF" />

              {/* Starburst Diamond Sparkle Flares */}
              <motion.g
                animate={{ rotate: 360, scale: [0.9, 1.25, 0.9] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                transform-origin="100 150"
              >
                <path d="M100 142 L101.5 148 L108 150 L101.5 152 L100 158 L98.5 152 L92 150 L98.5 148 Z" fill="#FFFFFF" />
              </motion.g>
            </motion.g>

            {/* Left and Right Paws gently holding the ring box */}
            <ellipse cx="64" cy="168" rx="13" ry="16" transform="rotate(30 64 168)" fill="#2C2B36" />
            <circle cx="73" cy="169" r="7" fill="#2C2B36" />

            <ellipse cx="136" cy="168" rx="13" ry="16" transform="rotate(-30 136 168)" fill="#2C2B36" />
            <circle cx="127" cy="169" r="7" fill="#2C2B36" />

            {/* Floating Sparkles & Hearts */}
            <motion.path
              d="M154 98 C152 95 148 94 148 98 C148 102 154 105 154 105 C154 105 160 102 160 98 C160 94 156 95 154 98 Z"
              fill="#FF4D6D"
              animate={{ y: [0, -6, 0], scale: [0.9, 1.15, 0.9] }}
              transition={{ repeat: Infinity, duration: 2.4 }}
            />
          </svg>
        )}

        {type === 'hug' && (
          <svg
            viewBox="0 0 320 240"
            className="w-full h-full drop-shadow-lg overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="hugHeartGrad" x1="160" y1="20" x2="160" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FF3366" />
                <stop offset="0.6" stopColor="#FF6B8B" />
                <stop offset="1" stopColor="#FFAEC9" />
              </linearGradient>
              <filter id="shadowHug" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#8B4358" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Ground Shadows */}
            <ellipse cx="160" cy="225" rx="110" ry="12" fill="#E8D7DF" opacity="0.6" />

            {/* ================= PANDA 1 (LEFT) ================= */}
            <g transform="translate(40, 10)">
              {/* Ears */}
              <ellipse cx="50" cy="70" rx="16" ry="18" fill="#26252D" />
              <ellipse cx="106" cy="70" rx="16" ry="18" fill="#26252D" />
              {/* Body */}
              <ellipse cx="78" cy="160" rx="42" ry="40" fill="#FFFFFF" filter="url(#shadowHug)" />
              <path d="M42 150 Q78 135 114 150 Q120 185 110 195 Q78 202 46 195 Z" fill="#2C2B36" />
              <ellipse cx="78" cy="166" rx="28" ry="24" fill="#FFFFFF" />
              {/* Head */}
              <ellipse cx="78" cy="110" rx="40" ry="34" fill="#FFFFFF" filter="url(#shadowHug)" />
              {/* Eyes (Happy Hug Eyes) */}
              <ellipse cx="60" cy="108" rx="12" ry="11" transform="rotate(-10 60 108)" fill="#2C2B36" />
              <path d="M54 109 Q60 103 66 109" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="96" cy="108" rx="12" ry="11" transform="rotate(10 96 108)" fill="#2C2B36" />
              <path d="M90 109 Q96 103 102 109" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              {/* Blushing */}
              <ellipse cx="52" cy="120" rx="8" ry="5" fill="#FF85A2" opacity="0.8" />
              <ellipse cx="104" cy="120" rx="8" ry="5" fill="#FF85A2" opacity="0.8" />
              {/* Nose & Smile */}
              <ellipse cx="78" cy="116" rx="4" ry="3" fill="#2C2B36" />
              <path d="M75 120 Q78 124 81 120" stroke="#2C2B36" strokeWidth="2" strokeLinecap="round" />
              {/* Arm reaching inward */}
              <motion.path
                d="M96 150 Q120 148 134 162"
                stroke="#2C2B36"
                strokeWidth="16"
                strokeLinecap="round"
                animate={{ d: ['M96 150 Q120 148 134 162', 'M96 150 Q124 144 140 160', 'M96 150 Q120 148 134 162'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              />
            </g>

            {/* ================= PANDA 3 (RIGHT) ================= */}
            <g transform="translate(160, 10)">
              {/* Ears */}
              <ellipse cx="54" cy="70" rx="16" ry="18" fill="#26252D" />
              <ellipse cx="110" cy="70" rx="16" ry="18" fill="#26252D" />
              {/* Body */}
              <ellipse cx="82" cy="160" rx="42" ry="40" fill="#FFFFFF" filter="url(#shadowHug)" />
              <path d="M46 150 Q82 135 118 150 Q124 185 114 195 Q82 202 50 195 Z" fill="#2C2B36" />
              <ellipse cx="82" cy="166" rx="28" ry="24" fill="#FFFFFF" />
              {/* Head */}
              <ellipse cx="82" cy="110" rx="40" ry="34" fill="#FFFFFF" filter="url(#shadowHug)" />
              {/* Eyes */}
              <ellipse cx="64" cy="108" rx="12" ry="11" transform="rotate(-10 64 108)" fill="#2C2B36" />
              <path d="M58 109 Q64 103 70 109" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="100" cy="108" rx="12" ry="11" transform="rotate(10 100 108)" fill="#2C2B36" />
              <path d="M94 109 Q100 103 106 109" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              {/* Blushing */}
              <ellipse cx="56" cy="120" rx="8" ry="5" fill="#FF85A2" opacity="0.8" />
              <ellipse cx="108" cy="120" rx="8" ry="5" fill="#FF85A2" opacity="0.8" />
              {/* Nose & Smile */}
              <ellipse cx="82" cy="116" rx="4" ry="3" fill="#2C2B36" />
              <path d="M79 120 Q82 124 85 120" stroke="#2C2B36" strokeWidth="2" strokeLinecap="round" />
              {/* Arm reaching inward */}
              <motion.path
                d="M64 150 Q40 148 26 162"
                stroke="#2C2B36"
                strokeWidth="16"
                strokeLinecap="round"
                animate={{ d: ['M64 150 Q40 148 26 162', 'M64 150 Q36 144 20 160', 'M64 150 Q40 148 26 162'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              />
            </g>

            {/* ================= PANDA 2 (CENTER) ================= */}
            <g transform="translate(100, 20)">
              {/* Ears */}
              <ellipse cx="40" cy="64" rx="17" ry="19" fill="#26252D" />
              <ellipse cx="80" cy="64" rx="17" ry="19" fill="#26252D" />
              {/* Body */}
              <ellipse cx="60" cy="155" rx="45" ry="42" fill="#FFFFFF" filter="url(#shadowHug)" />
              <path d="M22 145 Q60 130 98 145 Q104 180 94 190 Q60 196 26 190 Z" fill="#2C2B36" />
              <ellipse cx="60" cy="160" rx="30" ry="26" fill="#FFFFFF" />
              {/* Head */}
              <ellipse cx="60" cy="102" rx="42" ry="36" fill="#FFFFFF" filter="url(#shadowHug)" />
              {/* Sweet Eyes */}
              <ellipse cx="42" cy="100" rx="12" ry="11" transform="rotate(-8 42 100)" fill="#2C2B36" />
              <path d="M36 101 Q42 95 48 101" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="78" cy="100" rx="12" ry="11" transform="rotate(8 78 100)" fill="#2C2B36" />
              <path d="M72 101 Q78 95 84 101" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              {/* Blushing */}
              <ellipse cx="34" cy="112" rx="9" ry="5.5" fill="#FF85A2" opacity="0.85" />
              <ellipse cx="86" cy="112" rx="9" ry="5.5" fill="#FF85A2" opacity="0.85" />
              {/* Smile */}
              <ellipse cx="60" cy="108" rx="4" ry="3" fill="#2C2B36" />
              <path d="M57 112 Q60 117 63 112" stroke="#2C2B36" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M58 114 Q60 118 62 114" fill="#FF6B8B" />

              {/* Arms wrapped around both friends */}
              <motion.path
                d="M20 150 Q-15 155 -5 170"
                stroke="#2C2B36"
                strokeWidth="16"
                strokeLinecap="round"
                animate={{ d: ['M20 150 Q-15 155 -5 170', 'M20 150 Q-22 152 -10 172', 'M20 150 Q-15 155 -5 170'] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              />
              <motion.path
                d="M100 150 Q135 155 125 170"
                stroke="#2C2B36"
                strokeWidth="16"
                strokeLinecap="round"
                animate={{ d: ['M100 150 Q135 155 125 170', 'M100 150 Q142 152 130 172', 'M100 150 Q135 155 125 170'] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              />
            </g>

            {/* Giant Beating Heart Above All Three Pandas */}
            <motion.g
              animate={{
                scale: [1, 1.15, 1],
                y: [0, -6, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                ease: 'easeInOut',
              }}
              transform-origin="160 50"
            >
              <path
                d="M160 55 C150 35 125 32 125 55 C125 76 160 98 160 98 C160 98 195 76 195 55 C195 32 170 35 160 55 Z"
                fill="url(#hugHeartGrad)"
                filter="url(#shadowHug)"
              />
              {/* Highlight shine */}
              <path
                d="M136 46 C134 44 130 46 130 52 C130 57 136 64 136 64"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeOpacity="0.75"
              />
            </motion.g>

            {/* Floating Mini Hearts & Sparkles */}
            <motion.path
              d="M105 25 C103 22 99 21 99 25 C99 28 105 31 105 31 C105 31 111 28 111 25 C111 21 107 22 105 25 Z"
              fill="#FF85A2"
              animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.6 }}
            />
            <motion.path
              d="M215 22 C213 19 209 18 209 22 C209 25 215 28 215 28 C215 28 221 25 221 22 C221 18 217 19 215 22 Z"
              fill="#FF6B8B"
              animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.2, delay: 0.5 }}
            />
          </svg>
        )}

        {/* Completed Discovered Ribbon Badge */}
        {isDiscovered && type !== 'hug' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-bold shadow-md flex items-center gap-1 border border-white/60"
          >
            <span>✓</span>
            <span className="hidden sm:inline">Opened</span>
          </motion.div>
        )}
      </div>

      {/* Label and Subtitle */}
      {showLabel && (
        <div className="mt-2 text-center max-w-[200px]">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border shadow-sm ${labelInfo.badgeBg} transition-all duration-300 group-hover:scale-105`}
          >
            {labelInfo.title}
          </span>
          <p className="text-[11px] text-slate-500 mt-1 font-medium leading-tight">
            {labelInfo.subtitle}
          </p>
        </div>
      )}
    </motion.div>
  );
};
