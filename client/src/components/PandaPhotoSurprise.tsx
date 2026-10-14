import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ArrowLeft,
  Sparkles,
  Heart,
  Image as ImageIcon,
} from 'lucide-react';
import { PandaCharacter } from './PandaCharacter';
import type { PublicSurpriseData, PhotoMemory } from '../types/surprise';

interface PandaPhotoSurpriseProps {
  surprise: PublicSurpriseData;
  onClose: () => void;
  onDiscovered: () => void;
}

export const PandaPhotoSurprise: React.FC<PandaPhotoSurpriseProps> = ({
  surprise,
  onClose,
  onDiscovered,
}) => {
  const photos = surprise.photos || [];
  const hasPhotos = photos.length > 0;

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoMemory | null>(null);

  // Automatically mark as discovered on view
  useEffect(() => {
    onDiscovered();
  }, [onDiscovered]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-amber-900 text-xs sm:text-sm font-bold shadow-md border border-amber-100 transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pandas 🐼</span>
        </button>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          Surprise 2 of 4 📸
        </span>
      </div>

      {/* Intro Header */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2 shadow-sm border border-amber-200"
        >
          <Camera className="w-3.5 h-3.5 text-amber-600" />
          <span>Photo Memories</span>
        </motion.div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 font-display">
          Our Little World of Memories 📸
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
          Every moment captured is a precious story shared with {surprise.creatorName}.
        </p>
      </div>

      {/* Panda Character Presentation */}
      <div className="mb-4">
        <PandaCharacter
          type="photos"
          pose={hasPhotos ? 'celebrating' : 'presenting'}
          size="md"
          showLabel={false}
        />
      </div>

      {/* GALLERY / FALLBACK */}
      {hasPhotos ? (
        /* REAL PHOTO GALLERY CAROUSEL */
        <div className="w-full max-w-lg">
          <div className="p-4 sm:p-6 rounded-3xl bg-white shadow-2xl shadow-amber-900/10 border-2 border-amber-100 relative">
            {/* Polaroid Photo Frame */}
            <div
              onClick={() => setLightboxPhoto(photos[activeIndex])}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 cursor-pointer group shadow-inner"
            >
              <img
                src={photos[activeIndex].url}
                alt={photos[activeIndex].caption || `Memory ${activeIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Photo Index Badge */}
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-medium backdrop-blur-sm">
                {activeIndex + 1} / {photos.length}
              </div>
            </div>

            {/* Caption */}
            <div className="pt-4 pb-2 text-center min-h-[50px] flex items-center justify-center">
              <p className="font-cursive text-lg sm:text-xl text-slate-800 font-bold">
                {photos[activeIndex].caption ? (
                  `"${photos[activeIndex].caption}"`
                ) : (
                  <span className="text-slate-400 font-sans text-xs italic">
                    Memory #{activeIndex + 1}
                  </span>
                )}
              </p>
            </div>

            {/* Carousel Controls */}
            {photos.length > 1 && (
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 transition-colors shadow-sm"
                  title="Previous Photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Dot indicators */}
                <div className="flex items-center gap-1.5 max-w-[200px] overflow-x-auto py-1">
                  {photos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-2.5 rounded-full transition-all ${
                        activeIndex === idx
                          ? 'bg-amber-500 w-6'
                          : 'bg-slate-300 hover:bg-slate-400 w-2.5'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 transition-colors shadow-sm"
                  title="Next Photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <p className="text-center text-[11px] text-slate-500 mt-3">
            💡 Tap the photograph to view it in full screen.
          </p>
        </div>
      ) : (
        /* SWEET FALLBACK WHEN NO PHOTOS ARE UPLOADED */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-3xl bg-white/95 border-2 border-amber-100 shadow-xl text-center flex flex-col items-center"
        >
          {/* Sweet Memory Illustration */}
          <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-4 shadow-inner border border-amber-200">
            <ImageIcon className="w-10 h-10 animate-pulse" />
          </div>

          <h3 className="text-lg font-bold font-display text-slate-800 mb-2">
            Every beautiful memory starts with a moment. ❤️
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
            Even though {surprise.creatorName} hasn't uploaded personal photos yet, every smile, conversation, and milestone you share is etched forever in time.
          </p>

          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-800 italic flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>"The best memories are the ones felt in the heart."</span>
          </div>
        </motion.div>
      )}

      {/* Close and Continue Button */}
      <div className="mt-8">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105"
        >
          <span>Continue Surprises 🐼</span>
        </button>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxPhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <div
              className="relative max-w-3xl max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxPhoto.url}
                alt="Enlarged Memory"
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border-2 border-white/20"
              />
              {lightboxPhoto.caption && (
                <p className="mt-4 text-white text-sm font-medium bg-black/70 px-5 py-2 rounded-full backdrop-blur-sm border border-white/10">
                  {lightboxPhoto.caption}
                </p>
              )}
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute -top-10 right-0 text-white hover:text-rose-400 p-2 transition-colors"
                title="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
