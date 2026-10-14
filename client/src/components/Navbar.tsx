import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Gift, Eye, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onOpenPreview?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPreview }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0b0813]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-600 to-amber-400 p-[1.5px] shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#120a21] rounded-[14px] flex items-center justify-center">
              <span className="text-xl">🎂</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-rose-100 to-amber-200 bg-clip-text text-transparent group-hover:to-rose-300 transition-all">
              Birthday Bliss
            </span>
            <span className="text-[10px] text-rose-400/80 font-medium tracking-wider uppercase flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Magical Surprises
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <Link
            to="/"
            className="hover:text-white hover:text-rose-300 transition-colors"
          >
            Home
          </Link>

          <button
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-white hover:text-rose-300 transition-colors"
          >
            How It Works
          </button>

          <button
            onClick={() => scrollToSection('themes')}
            className="hover:text-white hover:text-rose-300 transition-colors"
          >
            Themes
          </button>

          {onOpenPreview && (
            <button
              onClick={onOpenPreview}
              className="flex items-center gap-1.5 hover:text-amber-300 text-slate-300 transition-colors"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Preview Experience</span>
            </button>
          )}

          <Link
            to="/create"
            className="relative group px-5 py-2.5 rounded-full font-semibold text-white text-xs sm:text-sm overflow-hidden shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-purple-600 to-amber-500 group-hover:opacity-90 transition-opacity" />
            <span className="relative flex items-center gap-2">
              <Gift className="w-4 h-4 animate-bounce" />
              <span>Create Surprise</span>
            </span>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/create"
            className="px-3.5 py-2 rounded-full font-semibold text-white text-xs bg-gradient-to-r from-rose-500 to-purple-600"
          >
            Create
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/10 bg-[#0f0a1c]/95 backdrop-blur-2xl px-6 py-5 flex flex-col gap-4 text-base font-medium"
          >
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 hover:text-rose-400 py-1"
            >
              Home
            </Link>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left text-slate-200 hover:text-rose-400 py-1"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('themes')}
              className="text-left text-slate-200 hover:text-rose-400 py-1"
            >
              8 Visual Themes
            </button>
            {onOpenPreview && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPreview();
                }}
                className="text-left flex items-center gap-2 text-amber-300 py-1"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Experience</span>
              </button>
            )}
            <Link
              to="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center py-3 rounded-full font-semibold text-white bg-gradient-to-r from-rose-500 to-purple-600 flex items-center justify-center gap-2 shadow-lg"
            >
              <Wand2 className="w-4 h-4" />
              <span>Create Birthday Surprise</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
