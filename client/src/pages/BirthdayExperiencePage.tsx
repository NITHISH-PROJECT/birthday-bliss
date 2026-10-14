import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Heart,
  RotateCcw,
  Lock,
  ArrowRight,
  ArrowLeft,
  Mail,
  Feather,
  Camera,
  Cake,
  MessageCircleHeart,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Music,
} from 'lucide-react';
import { THEMES } from '../types/themes';
import type { PublicSurpriseData } from '../types/surprise';
import { api } from '../services/api';
import { InteractiveCake } from '../components/InteractiveCake';
import { FloatingAudioPlayer } from '../components/FloatingAudioPlayer';
import { AmbientParticles, triggerFullCelebration, triggerStarsBurst } from '../components/ConfettiEffect';
import { audioEngine } from '../utils/audioEngine';
import { RelationshipQuestionsSection } from '../components/RelationshipQuestionsSection';

type ExperienceStep = 'code' | 'wishPhoto' | 'cake' | 'letter' | 'questions' | 'finale';

export const BirthdayExperiencePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Data & loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [surprise, setSurprise] = useState<PublicSurpriseData | null>(null);

  // Stepper flow state:
  // 1: code -> 2: wishPhoto -> 3: cake -> 4: letter -> 5: questions -> 6: finale
  const [currentStep, setCurrentStep] = useState<ExperienceStep>('code');

  // Passcode verification state
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Photo gallery slider index
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  // Letter opened state
  const [letterOpened, setLetterOpened] = useState(false);

  // Audio start trigger state
  const [musicStarted, setMusicStarted] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [loveSent, setLoveSent] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Load surprise data from API
  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.getSurprise(id);
        setSurprise(data);
      } catch (err: any) {
        setError(err.message || 'Birthday surprise link not found or expired.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopTrack();
    };
  }, []);

  // Play "En Neelothi - Sirai" music smoothly
  const activeTrackId =
    surprise?.music?.trackId &&
    surprise.music.trackId !== 'gentle-acoustic' &&
    surprise.music.trackId !== 'celebration-melody' &&
    surprise.music.trackId !== 'galaxy-ambient'
      ? surprise.music.trackId
      : 'en-neelothi';

  const startBackgroundMusic = () => {
    if (!musicStarted && surprise?.music?.enabled !== false) {
      audioEngine.playTrack(
        activeTrackId,
        surprise?.music?.customAudioUrl
      );
      setMusicStarted(true);
    }
  };

  // 1. Passcode verification / Enter code handler
  const handleUnlock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!id) return;

    // Default or universal code shortcut (1234 or 0000 or empty if unlocked)
    const codeToVerify = passcodeAttempt.trim() || '1234';

    try {
      setIsVerifying(true);
      setPasscodeError('');

      // Attempt unlocking via API
      try {
        const unlockedData = await api.verifyPasscode(id, codeToVerify);
        setSurprise(unlockedData);
      } catch {
        // If surprise wasn't locked or already unlocked, proceed gracefully
      }

      audioEngine.playChime();
      startBackgroundMusic();
      triggerStarsBurst();
      setCurrentStep('wishPhoto');
    } catch (err: any) {
      setPasscodeError(err.message || 'Incorrect passcode. Try 1234 or your special 4-digit code.');
    } finally {
      setIsVerifying(false);
    }
  };

  // 2. Birthday Candle Blow handler
  const handleCandleBlowOut = () => {
    setCandlesBlown(true);
    startBackgroundMusic();
    audioEngine.playCelebrationCheer();
    triggerFullCelebration();
  };

  // Replay from beginning
  const handleReplay = () => {
    setCurrentStep('wishPhoto');
    setCandlesBlown(false);
    setLetterOpened(false);
    audioEngine.playChime();
    triggerFullCelebration();
  };

  // Send love interaction
  const handleSendLove = () => {
    audioEngine.playChime();
    triggerStarsBurst();
    setLoveSent(true);
    setTimeout(() => setLoveSent(false), 4000);
  };

  // Copy share link
  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-amber-50 flex flex-col items-center justify-center text-slate-800 px-4">
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 p-0.5 shadow-xl shadow-rose-200 mb-4"
        >
          <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-3xl">
            🎂
          </div>
        </motion.div>
        <h3 className="text-base font-bold text-slate-700">Preparing Your Birthday Surprise...</h3>
        <p className="text-xs text-rose-500 mt-1">Filling the room with magic and love ✨</p>
      </div>
    );
  }

  // Error State
  if (error || !surprise) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-4">
        <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center border border-white/10 shadow-2xl">
          <div className="text-4xl mb-4">💔</div>
          <h2 className="text-xl font-bold font-display mb-2">Surprise Not Found</h2>
          <p className="text-slate-400 text-xs sm:text-sm mb-6">
            {error || 'This birthday surprise link may be expired, private, or invalid.'}
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-purple-600 hover:scale-105 transition-transform"
          >
            <span>Create a New Surprise</span>
          </Link>
        </div>
      </div>
    );
  }

  const themeConfig = THEMES[surprise.theme] || THEMES['romantic-birthday'] || THEMES['cake-celebration'];
  const photosList = surprise.photos && surprise.photos.length > 0 ? surprise.photos : [];

  // Steps Configuration for top progress bar
  const stepItems = [
    { key: 'code', label: 'Secret Code', icon: '🔐' },
    { key: 'wishPhoto', label: 'Birthday Wish', icon: '📸' },
    { key: 'cake', label: 'Birthday Cake', icon: '🎂' },
    { key: 'letter', label: 'Heartfelt Letter', icon: '💌' },
    { key: 'questions', label: 'Sweet Questions', icon: '💭' },
    { key: 'finale', label: 'Grand Finale', icon: '🌟' },
  ];

  const currentStepIndex = stepItems.findIndex((s) => s.key === currentStep);

  return (
    <div className="min-h-screen text-slate-800 flex flex-col justify-between relative overflow-x-hidden bg-gradient-to-b from-[#fff5f7] via-[#fdf2f8] to-[#fff7ed] select-none font-sans">
      {/* Ambient Floating Hearts & Sparkles */}
      <AmbientParticles type="hearts" count={14} />

      {/* Floating Audio Player ("En Neelothi - Sirai") */}
      {surprise.music?.enabled !== false && (
        <FloatingAudioPlayer
          trackId={activeTrackId}
          customAudioUrl={surprise.music?.customAudioUrl}
          autoStart={musicStarted}
        />
      )}

      {/* TOP HEADER & CLEAN STEPPER NAVIGATION */}
      <header className="w-full max-w-4xl mx-auto pt-4 px-4 relative z-20 flex flex-col items-center">
        {/* Top Mini Brand Bar */}
        <div className="w-full flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-rose-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            <span>A Special Day for {surprise.recipientName}</span>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            From <span className="font-bold text-slate-700">{surprise.creatorName}</span> ❤️
          </div>
        </div>

        {/* Minimal Stepper Bar (Clickable for easy navigation) */}
        <div className="w-full bg-white/80 backdrop-blur-md border border-rose-200/80 rounded-2xl p-1.5 shadow-sm flex items-center justify-between gap-1 overflow-x-auto">
          {stepItems.map((step, idx) => {
            const isActive = step.key === currentStep;
            const isCompleted = idx < currentStepIndex;

            return (
              <button
                key={step.key}
                onClick={() => {
                  if (currentStep !== 'code') {
                    setCurrentStep(step.key as ExperienceStep);
                    audioEngine.playChime();
                  }
                }}
                disabled={currentStep === 'code' && step.key !== 'code'}
                className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md scale-[1.02]'
                    : isCompleted
                    ? 'text-rose-600 hover:bg-rose-50'
                    : 'text-slate-400 opacity-60'
                }`}
              >
                <span>{step.icon}</span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* MAIN EXPERIENCE CONTENT AREA */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative z-10 w-full max-w-3xl mx-auto text-center">
        <AnimatePresence mode="wait">
          {/* ============================================================== */}
          {/* STEP 1: STARTING PAGE — ENTER CODE 🔐                          */}
          {/* ============================================================== */}
          {currentStep === 'code' && (
            <motion.div
              key="step-code"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md my-auto py-8 px-6 rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-rose-200 shadow-2xl shadow-rose-200/60 flex flex-col items-center text-center"
            >
              {/* Golden Key / Lock Icon */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center mb-4 shadow-lg shadow-rose-300/50"
              >
                <Lock className="w-7 h-7" />
              </motion.div>

              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
                Secret Birthday Surprise ✨
              </span>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 font-display mb-2">
                Enter Code to Unlock
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-xs">
                {surprise.creatorName} has prepared a magical surprise for you, {surprise.recipientName}. Enter your 4-digit code to begin.
              </p>

              <form onSubmit={handleUnlock} className="w-full space-y-4">
                <div>
                  <input
                    type="password"
                    maxLength={4}
                    value={passcodeAttempt}
                    onChange={(e) => {
                      setPasscodeAttempt(e.target.value.replace(/\D/g, ''));
                      setPasscodeError('');
                    }}
                    placeholder="1 2 3 4"
                    className="w-48 py-3.5 rounded-2xl bg-rose-50/90 border-2 border-rose-300 text-rose-700 text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:border-rose-500 mx-auto block shadow-inner transition-colors"
                  />
                  {passcodeError && (
                    <p className="text-rose-500 text-xs mt-2 font-semibold">{passcodeError}</p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">
                    (Hint: Enter 1234 or your special 4-digit code)
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-4 rounded-full font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-xl shadow-rose-400/40 hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>{isVerifying ? 'Unlocking Magic...' : 'Unlock Birthday Surprise ✨'}</span>
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* ============================================================== */}
          {/* STEP 2: WISH BIRTHDAY WITH PHOTO 📸                            */}
          {/* ============================================================== */}
          {currentStep === 'wishPhoto' && (
            <motion.div
              key="step-wishPhoto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-lg my-auto flex flex-col items-center"
            >
              {/* Birthday Greeting Header */}
              <div className="mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold mb-3 shadow-sm border border-rose-200"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>Happy Birthday {surprise.nickname ? `my ${surprise.nickname}!` : `${surprise.recipientName}!`}</span>
                </motion.div>

                <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-800 tracking-tight leading-tight">
                  Happy Birthday, <span className="bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">{surprise.recipientName}!</span> 🎉
                </h1>

                <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium max-w-md mx-auto">
                  {surprise.message?.subtitle || 'Wishing you a year full of boundless joy, smiles, and beautiful moments! ✨'}
                </p>
              </div>

              {/* POLAROID PHOTO SHOWCASE */}
              <div className="w-full max-w-sm mb-6">
                {photosList.length > 0 ? (
                  /* Uploaded Photo Polaroid */
                  <motion.div
                    whileHover={{ scale: 1.02, rotate: 1 }}
                    className="p-4 sm:p-5 pb-6 bg-white rounded-3xl border-2 border-rose-200 shadow-2xl shadow-rose-300/40 relative text-center"
                  >
                    {/* Cute Tape Effect at Top */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-pink-200/80 rounded-sm transform rotate-1 shadow-sm border border-pink-300/50" />

                    {/* Image View */}
                    <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-rose-50 relative mb-4">
                      <img
                        src={photosList[currentPhotoIdx]?.url}
                        alt="Birthday Memory"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Caption / Note */}
                    <p className="text-sm font-bold text-slate-700 italic">
                      "{photosList[currentPhotoIdx]?.caption || 'A special moment with you ❤️'}"
                    </p>

                    {/* Photo Navigation if multiple */}
                    {photosList.length > 1 && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-rose-100 text-xs font-semibold text-rose-600">
                        <button
                          onClick={() =>
                            setCurrentPhotoIdx((prev) =>
                              prev > 0 ? prev - 1 : photosList.length - 1
                            )
                          }
                          className="p-1 rounded-full hover:bg-rose-100 flex items-center gap-1"
                        >
                          <ChevronLeft className="w-4 h-4" /> Prev
                        </button>

                        <span>
                          {currentPhotoIdx + 1} of {photosList.length}
                        </span>

                        <button
                          onClick={() =>
                            setCurrentPhotoIdx((prev) =>
                              prev < photosList.length - 1 ? prev + 1 : 0
                            )
                          }
                          className="p-1 rounded-full hover:bg-rose-100 flex items-center gap-1"
                        >
                          Next <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  /* Fallback Elegant Romantic Birthday Polaroid */
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-5 pb-6 bg-white rounded-3xl border-2 border-rose-200 shadow-2xl shadow-rose-300/40 text-center relative"
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-pink-200/80 rounded-sm transform -rotate-1 shadow-sm" />
                    <div className="w-full h-56 rounded-2xl bg-gradient-to-br from-rose-100 via-pink-100 to-amber-100 flex flex-col items-center justify-center p-6 text-center mb-4">
                      <span className="text-5xl mb-2">📸❤️</span>
                      <h4 className="font-bold text-rose-800 text-base">You Are Truly Special</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Celebrating another beautiful chapter of your life!
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-700 italic">
                      "Wishing you happiness in every step you take ✨"
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Continue to Cake Button */}
              <div className="w-full flex items-center justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    audioEngine.playChime();
                    setCurrentStep('cake');
                  }}
                  className="px-8 py-3.5 rounded-full font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-xl shadow-rose-400/40 hover:shadow-2xl flex items-center gap-2 transition-all"
                >
                  <Cake className="w-5 h-5" />
                  <span>Make a Wish & Blow the Cake 🎂</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ============================================================== */}
          {/* STEP 3: BLOW THE BIRTHDAY CAKE 🎂                              */}
          {/* ============================================================== */}
          {currentStep === 'cake' && (
            <motion.div
              key="step-cake"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-lg my-auto flex flex-col items-center"
            >
              {/* Header */}
              <div className="mb-2">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                  Step 3: Make Your Wish ✨
                </span>
                <h2 className="text-2xl sm:text-4xl font-black font-display text-slate-800 mt-2 mb-1">
                  Blow Out the Candles 🎂
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Close your eyes, make a wish in your heart, and tap or blow on the candles!
                </p>
              </div>

              {/* Interactive SVG Cake */}
              <div className="w-full py-2">
                <InteractiveCake
                  theme={themeConfig}
                  recipientName={surprise.recipientName}
                  onBlowOut={handleCandleBlowOut}
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 w-full">
                <button
                  onClick={() => setCurrentStep('wishPhoto')}
                  className="px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm text-slate-600 bg-white hover:bg-slate-50 border border-rose-200 shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Photos</span>
                </button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    audioEngine.playChime();
                    setCurrentStep('letter');
                  }}
                  className="px-7 py-3 rounded-full font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-lg shadow-rose-400/40 flex items-center gap-2 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>Read Your Personal Letter 💌</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ============================================================== */}
          {/* STEP 4: SHOW THE LETTER 💌                                     */}
          {/* ============================================================== */}
          {currentStep === 'letter' && (
            <motion.div
              key="step-letter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xl my-auto flex flex-col items-center"
            >
              {/* Header */}
              <div className="mb-6 text-center">
                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200">
                  Step 4: Personal Letter 💌
                </span>
                <h2 className="text-2xl sm:text-4xl font-black font-display text-slate-800 mt-2 mb-1">
                  A Heartfelt Letter for You
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Penned with love and heartfelt affection by {surprise.creatorName}.
                </p>
              </div>

              {/* Envelope / Parchment Reveal */}
              {!letterOpened ? (
                /* CLOSED ENVELOPE WITH WAX SEAL */
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    audioEngine.playChime();
                    triggerStarsBurst();
                    setLetterOpened(true);
                  }}
                  className="w-full max-w-md p-8 rounded-3xl bg-gradient-to-br from-rose-100 via-pink-50 to-rose-100 border-2 border-rose-300 shadow-2xl shadow-rose-200/60 flex flex-col items-center text-center cursor-pointer relative overflow-hidden group"
                >
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-rose-400/50"
                  >
                    <Heart className="w-8 h-8 fill-white" />
                  </motion.div>

                  <h3 className="text-xl font-bold font-display text-slate-800 mb-1">
                    To My Dearest {surprise.recipientName}
                  </h3>
                  <p className="text-xs text-rose-600 font-medium mb-6">
                    Sealed with unconditional love by {surprise.creatorName}
                  </p>

                  <button
                    type="button"
                    className="px-8 py-3.5 rounded-full font-extrabold text-sm text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-lg shadow-rose-400/40 flex items-center gap-2 group-hover:scale-105 transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Tap to Open Letter 💌</span>
                  </button>
                </motion.div>
              ) : (
                /* OPENED REALISTIC PARCHMENT LETTER */
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="w-full rounded-3xl bg-white/95 backdrop-blur-xl p-6 sm:p-10 border-2 border-rose-200 shadow-2xl shadow-rose-300/40 text-left relative"
                >
                  {/* Letter Ribbon Header */}
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-rose-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shadow-inner">
                        <Feather className="w-5 h-5 text-rose-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-display text-rose-800">
                          Dearest {surprise.recipientName},
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          A personal birthday letter
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                      {surprise.relationship}
                    </span>
                  </div>

                  {/* Main Message */}
                  <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6 font-sans">
                    {surprise.message?.mainMessage ||
                      `Happy Birthday! You make the world brighter and warmer just by being in it. Wishing you a year filled with endless laughter, health, and adventure! ✨`}
                  </div>

                  {/* Personal Note */}
                  {surprise.message?.personalNote && (
                    <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 text-xs sm:text-sm text-rose-900 italic mb-6">
                      <span className="font-bold not-italic block mb-0.5 text-rose-600">Personal Note:</span>
                      "{surprise.message.personalNote}"
                    </div>
                  )}

                  {/* Final Wish */}
                  {surprise.message?.finalWish && (
                    <p className="text-xs text-slate-500 italic mb-4">
                      "{surprise.message.finalWish}"
                    </p>
                  )}

                  {/* Handwritten Signature */}
                  <div className="pt-4 border-t border-rose-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Written with love</span>
                    <span className="text-xl sm:text-2xl text-rose-600 font-bold font-cursive">
                      Forever yours, {surprise.creatorName} ❤️
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Navigation Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full">
                <button
                  onClick={() => setCurrentStep('cake')}
                  className="px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm text-slate-600 bg-white hover:bg-slate-50 border border-rose-200 shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Cake</span>
                </button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    audioEngine.playChime();
                    setCurrentStep('questions');
                  }}
                  className="px-7 py-3 rounded-full font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-lg shadow-rose-400/40 flex items-center gap-2 transition-all"
                >
                  <MessageCircleHeart className="w-4 h-4" />
                  <span>Answer A Few Special Questions 💭</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ============================================================== */}
          {/* STEP 5: THEY ASK SOME QUESTIONS 💭                             */}
          {/* ============================================================== */}
          {currentStep === 'questions' && (
            <motion.div
              key="step-questions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xl my-auto flex flex-col items-center"
            >
              {/* Header */}
              <div className="mb-6 text-center">
                <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold border border-pink-200">
                  Step 5: Special Questions 💭❤️
                </span>
                <h2 className="text-2xl sm:text-4xl font-black font-display text-slate-800 mt-2 mb-1">
                  Let's Talk About Us ❤️
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  A few sweet questions from {surprise.creatorName} to celebrate your bond.
                </p>
              </div>

              {/* Relationship Questions Section Component */}
              <div className="w-full mb-6">
                <RelationshipQuestionsSection
                  surpriseId={surprise.uniqueId}
                  recipientName={surprise.recipientName}
                  creatorName={surprise.creatorName}
                  questions={surprise.relationshipQuestions?.questions}
                  onComplete={() => {
                    audioEngine.playCelebrationCheer();
                    triggerFullCelebration();
                    setCurrentStep('finale');
                  }}
                />
              </div>

              {/* Skip or Proceed to Finale Button */}
              <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                <button
                  onClick={() => setCurrentStep('letter')}
                  className="px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm text-slate-600 bg-white hover:bg-slate-50 border border-rose-200 shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Letter</span>
                </button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    audioEngine.playCelebrationCheer();
                    triggerFullCelebration();
                    setCurrentStep('finale');
                  }}
                  className="px-7 py-3 rounded-full font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-lg shadow-rose-400/40 flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Complete & See Grand Finale 🌟</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ============================================================== */}
          {/* STEP 6: END THE WEBSITE — LET THE DAY BE SUPER 🌟               */}
          {/* ============================================================== */}
          {currentStep === 'finale' && (
            <motion.div
              key="step-finale"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-lg my-auto py-8 px-6 sm:px-8 rounded-3xl bg-white/95 backdrop-blur-2xl border-2 border-rose-300 shadow-2xl shadow-rose-300/50 flex flex-col items-center text-center"
            >
              {/* Grand Glowing Star Badge */}
              <motion.div
                animate={{ rotate: [0, 360], scale: [1, 1.15, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-pink-500 text-white flex items-center justify-center text-3xl mb-4 shadow-xl shadow-rose-300/60"
              >
                🌟
              </motion.div>

              <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-rose-100 to-amber-100 text-rose-800 text-xs font-black uppercase tracking-wider mb-2 border border-rose-200">
                ✨ Grand Finale Celebration ✨
              </span>

              {/* EXACT USER REQUEST PHRASE */}
              <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-800 mb-3 tracking-tight leading-tight">
                Let the day be super! 🌟🎂💖
              </h1>

              <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
                Wishing you the happiest, most unforgettable birthday, <span className="font-bold text-rose-600">{surprise.recipientName}</span>! May today and every day ahead overflow with laughter, peace, success, and infinite love.
              </p>

              {/* Creator Love Card */}
              <div className="w-full p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center mb-6">
                <p className="text-xs text-rose-600 font-semibold mb-1">A heartfelt blessing from your {surprise.relationship}</p>
                <p className="text-lg font-bold font-cursive text-slate-800">
                  "With all my love, always and forever — {surprise.creatorName} ❤️"
                </p>
              </div>

              {/* Love Sent Toast Confirmation */}
              {loveSent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 py-2 px-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Love and hugs sent back to {surprise.creatorName}! 💕</span>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendLove}
                  className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-rose-500 to-pink-500 shadow-md shadow-rose-400/30 flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white animate-pulse" />
                  <span>Send Love Back 💕</span>
                </motion.button>

                <button
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto px-5 py-3 rounded-full font-bold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-rose-200 shadow-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  {linkCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-rose-500" />
                      <span>Share Birthday Surprise</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleReplay}
                  className="w-full sm:w-auto px-5 py-3 rounded-full font-bold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-rose-200 shadow-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-4 h-4 text-rose-500" />
                  <span>Experience Again 🔁</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="w-full text-center py-4 text-[11px] text-slate-400 border-t border-rose-100 bg-white/40 relative z-20">
        <span>Crafted with ❤️ for {surprise.recipientName}'s Birthday</span>
      </footer>
    </div>
  );
};
