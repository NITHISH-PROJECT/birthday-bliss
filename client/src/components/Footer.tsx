import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Gift } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#080510] text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start">
          <Link to="/" className="flex items-center gap-2 group mb-2">
            <span className="text-2xl">🎂</span>
            <span className="font-extrabold text-lg text-white font-display">
              Birthday Bliss
            </span>
          </Link>
          <p className="text-xs text-slate-400 max-w-sm text-center md:text-left">
            Create an unforgettable, interactive birthday surprise for your friends, partner, and family.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/create" className="hover:text-white transition-colors">
            Create Surprise
          </Link>
          <a href="#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#themes" className="hover:text-white transition-colors">
            Themes
          </a>
        </div>

        {/* Contact & Copyright */}
        <div className="flex flex-col items-center md:items-end text-xs text-slate-400">
          <div className="flex items-center gap-1 text-slate-300 mb-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>for magical moments</span>
          </div>
          <div>© {new Date().getFullYear()} Birthday Bliss. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};
