import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  User,
  Calendar,
  MessageSquare,
  Camera,
  Music,
  Sliders,
  Eye,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Upload,
  Trash2,
  Lock,
  Play,
  Pause,
  Save,
  Wand2,
  Heart,
  AlertCircle,
  FileAudio,
  Plus,
  HelpCircle,
} from 'lucide-react';
import { THEMES, type BirthdayThemeId } from '../types/themes';
import type {
  BirthdayFormData,
  RelationshipType,
  RelationshipQuestion,
} from '../types/surprise';
import { InteractiveCake } from '../components/InteractiveCake';
import { audioEngine, AVAILABLE_TRACKS } from '../utils/audioEngine';
import { api } from '../services/api';
import { DEFAULT_QUESTIONS } from '../components/RelationshipQuestionsSection';

const RELATIONSHIP_OPTIONS: RelationshipType[] = [
  'Friend',
  'Best Friend',
  'Partner',
  'Sibling',
  'Parent',
  'Other',
];

const SUGGESTED_MESSAGES = [
  'Happy Birthday! You make the world a brighter and warmer place just by being in it. Wishing you a year full of boundless joy, health, and adventure! ✨',
  'To someone truly special: may your birthday be as wonderfully bright, kind, and unforgettable as you are. Cheers to another year of great memories!',
  'Happy Birthday to my favorite human! Thank you for the laughter, the unconditional support, and all our crazy memories. Have the happiest day!',
  'Wishing the happiest of birthdays to the one who holds my heart. May every wish you make today find its way to you in the year ahead. 💖',
];

export const CreateBirthdayPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTheme = (searchParams.get('theme') as BirthdayThemeId) || 'cake-celebration';

  // Wizard state: Steps 1 to 10
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  // Custom question input for relationship questions
  const [customQuestionInput, setCustomQuestionInput] = useState('');

  // Main Form Data
  const [formData, setFormData] = useState<BirthdayFormData>({
    recipientName: '',
    creatorName: '',
    relationship: 'Best Friend',
    nickname: '',
    birthdayDetails: {
      date: new Date().getDate(),
      month: new Date().getMonth() + 1,
      showCountdown: true,
    },
    theme: initialTheme in THEMES ? initialTheme : 'cake-celebration',
    message: {
      mainMessage: SUGGESTED_MESSAGES[0],
      subtitle: 'A special day for someone extraordinary',
      personalNote: 'Forever grateful for you.',
      finalWish: 'May your next chapter be filled with happiness, beautiful memories, and endless reasons to smile.',
    },
    birthdayWish: {
      personalWish: 'May you always be surrounded by love, laughter, and the warmth of those who cherish you most.',
      heartfeltMessage: 'You mean more to me than words can ever describe.',
      specialPromise: 'I promise to always be there for you, in every season of life.',
      creatorSign: '',
    },
    proposal: {
      enabled: true,
      question: 'Will you be mine and create more beautiful memories together? 💍',
      options: {
        yesText: 'Yes, of course! ❤️',
        alreadyText: 'You already have my heart! 🥹',
        thinkText: 'Let me think about it 💗',
      },
      messages: {
        positiveResponse: 'You just made this moment unforgettable! ❤️',
        thinkResponse: 'Take your time. Your feelings matter. 💗',
      },
    },
    virtualHug: {
      enabled: true,
      message: 'Sending you the biggest virtual hug! 🫂',
      style: 'warm-trio',
    },
    relationshipQuestions: {
      enabled: true,
      title: "Let's Talk About Us ❤️",
      questions: [...DEFAULT_QUESTIONS],
    },
    photos: [],
    music: {
      trackId: 'en-neelothi',
      trackName: 'En Neelothi - Sirai (Justin Prabhakaran, Sooraj Santhosh, Chinmayi)',
      customAudioUrl: '',
      enabled: true,
      volume: 0.8,
      autoPlayAllowed: true,
    },
    settings: {
      confetti: true,
      floatingHearts: true,
      balloons: true,
      sparkles: true,
      finalMessage: true,
      photoGallery: true,
      countdown: true,
      hasPasscode: false,
    },
    passcode: '',
  });

  // Load draft if available
  useEffect(() => {
    const saved = api.loadDraft();
    if (saved) {
      setFormData((prev) => ({
        ...prev,
        ...saved,
        theme: initialTheme in THEMES ? initialTheme : (saved.theme || prev.theme),
        music: {
          ...prev.music,
          ...(saved.music || {}),
          trackId: saved.music?.trackId || 'en-neelothi',
        },
        relationshipQuestions: saved.relationshipQuestions || prev.relationshipQuestions,
        birthdayWish: saved.birthdayWish || prev.birthdayWish,
        proposal: saved.proposal || prev.proposal,
        virtualHug: saved.virtualHug || prev.virtualHug,
      }));
    }
  }, [initialTheme]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopTrack();
    };
  }, []);

  // Validation function per step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 2) {
      if (!formData.recipientName.trim()) {
        newErrors.recipientName = "Please enter the recipient's name";
      }
      if (!formData.creatorName.trim()) {
        newErrors.creatorName = 'Please enter your name';
      }
    }

    if (step === 3) {
      if (!formData.birthdayDetails.date || formData.birthdayDetails.date < 1 || formData.birthdayDetails.date > 31) {
        newErrors.date = 'Please enter a valid day (1-31)';
      }
      if (!formData.birthdayDetails.month || formData.birthdayDetails.month < 1 || formData.birthdayDetails.month > 12) {
        newErrors.month = 'Please enter a valid month (1-12)';
      }
    }

    if (step === 4) {
      if (!formData.message.mainMessage.trim()) {
        newErrors.mainMessage = 'Please enter a birthday message';
      }
    }

    if (step === 9) {
      if (formData.settings.hasPasscode) {
        if (!formData.passcode || !/^\d{4}$/.test(formData.passcode)) {
          newErrors.passcode = 'Passcode must be exactly 4 numeric digits (e.g., 2026)';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      api.saveDraft(formData);
      setCurrentStep((prev) => Math.min(10, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProgress = () => {
    api.saveDraft(formData);
    setSaveSuccessMsg('Progress saved safely to your browser!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleCreateSurprise = async () => {
    if (!validateStep(2) || !validateStep(3) || !validateStep(4) || !validateStep(9)) {
      setErrors((prev) => ({ ...prev, submit: 'Please fix the errors in previous steps before creating.' }));
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await api.createSurprise(formData);
      // Navigate to created page and pass edit token
      navigate(`/created/${res.uniqueId}?token=${res.editToken}`);
    } catch (err: any) {
      setErrors({ submit: err.message || 'Failed to create surprise. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Photo handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 12 - formData.photos.length;
    if (remainingSlots <= 0) {
      alert('Maximum 12 photos allowed.');
      return;
    }

    const fileList = Array.from(files).slice(0, remainingSlots);

    fileList.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image.`);
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        alert(`${file.name} is larger than 3MB. Please choose a smaller photo.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          photos: [
            ...prev.photos,
            {
              id: Math.random().toString(36).substring(2, 9),
              url: base64,
              caption: '',
              order: prev.photos.length,
            },
          ],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== id),
    }));
  };

  // Audio file upload handler
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('Please upload an audio file (e.g. MP3, WAV, AAC, M4A).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('Audio file size must be less than 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        music: {
          ...prev.music,
          trackId: 'custom-upload',
          trackName: file.name.replace(/\.[^/.]+$/, ''),
          customAudioUrl: base64,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  // Music track test toggle
  const handleToggleTrackTest = (trackId: string, customUrl?: string) => {
    if (playingTrackId === trackId) {
      audioEngine.stopTrack();
      setPlayingTrackId(null);
    } else {
      audioEngine.playTrack(trackId, customUrl);
      setPlayingTrackId(trackId);
    }
  };

  // Add custom question handler
  const handleAddCustomQuestion = () => {
    if (!customQuestionInput.trim()) return;
    const newQ: RelationshipQuestion = {
      id: `custom_${Date.now()}`,
      question: customQuestionInput.trim(),
      type: 'text',
    };
    setFormData((prev) => ({
      ...prev,
      relationshipQuestions: {
        ...prev.relationshipQuestions!,
        questions: [...(prev.relationshipQuestions?.questions || []), newQ],
      },
    }));
    setCustomQuestionInput('');
  };

  // Remove question handler
  const handleRemoveQuestion = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      relationshipQuestions: {
        ...prev.relationshipQuestions!,
        questions: (prev.relationshipQuestions?.questions || []).filter((q) => q.id !== id),
      },
    }));
  };

  const selectedTheme = THEMES[formData.theme];

  const stepsMeta = [
    { num: 1, title: 'Theme', icon: Palette },
    { num: 2, title: 'Recipient', icon: User },
    { num: 3, title: 'Details', icon: Calendar },
    { num: 4, title: 'Message', icon: MessageSquare },
    { num: 5, title: 'Wish & Letter', icon: Heart },
    { num: 6, title: 'Questions', icon: Sparkles },
    { num: 7, title: 'Memories', icon: Camera },
    { num: 8, title: 'Music', icon: Music },
    { num: 9, title: 'Surprises', icon: Sliders },
    { num: 10, title: 'Preview & Create', icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-[#0b0813] text-slate-100 selection:bg-rose-500 selection:text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xl">🎂</span>
            <span className="font-extrabold text-base font-display text-white">Birthday Bliss Wizard</span>
          </div>

          <button
            onClick={handleSaveProgress}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-all border border-white/10"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Progress</span>
          </button>
        </div>

        {/* Save confirmation toast */}
        <AnimatePresence>
          {saveSuccessMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs text-center font-medium"
            >
              ✓ {saveSuccessMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar & Steps Tabs */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-400 font-medium">
              Step {currentStep} of 10: <strong className="text-white">{stepsMeta[currentStep - 1].title}</strong>
            </span>
            <span className="text-rose-400 font-semibold">{Math.round((currentStep / 10) * 100)}% Completed</span>
          </div>

          {/* Progress track */}
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-6">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-500 via-purple-600 to-amber-400"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 10) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Step Pill Navigator (Clickable for quick jump) */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 scrollbar-none">
            {stepsMeta.map((s) => {
              const isCurrent = currentStep === s.num;
              const isPast = currentStep > s.num;

              return (
                <button
                  key={s.num}
                  onClick={() => {
                    if (s.num <= currentStep || validateStep(currentStep)) {
                      setCurrentStep(s.num);
                    }
                  }}
                  className={`flex flex-col items-center gap-1 min-w-[54px] sm:min-w-[64px] p-2 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300 shadow-md'
                      : isPast
                      ? 'text-slate-300 hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-400'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCurrent
                        ? 'bg-rose-500 text-white'
                        : isPast
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <span className="text-[10px] font-medium truncate max-w-[58px]">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* WIZARD CONTAINER */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative">
          
          {/* STEP 1: CHOOSE THEME */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Step 1</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
                  Choose a Birthday Experience Theme
                </h2>
                <p className="text-slate-300 text-sm mt-1">
                  Pick the visual mood for the celebration. This alters the background, cake design, candle colors, and ambient particle animations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Object.keys(THEMES) as BirthdayThemeId[]).map((key) => {
                  const th = THEMES[key];
                  const isSelected = formData.theme === key;

                  return (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData((prev) => ({ ...prev, theme: key }))}
                      className={`cursor-pointer rounded-2xl p-5 border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-rose-400 bg-rose-950/40 shadow-xl shadow-rose-900/40 ring-2 ring-rose-500/50'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-3xl">{th.emoji}</span>
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs ${
                              isSelected
                                ? 'bg-rose-500 border-rose-400 text-white'
                                : 'border-slate-600 bg-slate-800'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </span>
                        </div>

                        <h3 className="font-bold text-white text-lg font-display">{th.name}</h3>
                        <p className="text-xs text-rose-300 font-medium mb-1">{th.tagline}</p>
                        <p className="text-xs text-slate-300 leading-relaxed">{th.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="capitalize">Style: {th.particles}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: th.cake.topFrosting }} />
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: th.cake.candleColor }} />
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: th.cake.flameColor }} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: WHO IS THE SURPRISE FOR? */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Step 2</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
                  Who is the Birthday Surprise For?
                </h2>
                <p className="text-slate-300 text-sm mt-1">
                  We will weave their name and relationship into the customized celebration cards and heading reveals.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                    Recipient's Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, recipientName: e.target.value }));
                      if (errors.recipientName) setErrors((p) => ({ ...p, recipientName: '' }));
                    }}
                    placeholder="e.g. Alex, Maya, Mom, Ethan"
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-white placeholder-slate-500 text-sm sm:text-base"
                  />
                  {errors.recipientName && (
                    <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.recipientName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                    Your Name (Creator) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.creatorName}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, creatorName: e.target.value }));
                      if (errors.creatorName) setErrors((p) => ({ ...p, creatorName: '' }));
                    }}
                    placeholder="e.g. Sam, Jordan, Your Bestie"
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-white placeholder-slate-500 text-sm sm:text-base"
                  />
                  {errors.creatorName && (
                    <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.creatorName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Your Relationship
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {RELATIONSHIP_OPTIONS.map((rel) => (
                      <button
                        key={rel}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, relationship: rel }))}
                        className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                          formData.relationship === rel
                            ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                    Special Nickname <span className="text-slate-500 text-xs font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nickname || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, nickname: e.target.value }))}
                    placeholder="e.g. Sunshine, Champ, Rockstar"
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-rose-400 focus:outline-none text-white placeholder-slate-500 text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: BIRTHDAY DETAILS */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Step 3</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
                  Birthday Details & Countdown
                </h2>
                <p className="text-slate-300 text-sm mt-1">
                  When is the big day? We can display an animated countdown or celebrate their milestone.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                      Day <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={formData.birthdayDetails.date}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          birthdayDetails: {
                            ...p.birthdayDetails,
                            date: parseInt(e.target.value, 10) || 1,
                          },
                        }))
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-rose-400 focus:outline-none text-white text-base"
                    />
                    {errors.date && <p className="text-rose-400 text-xs mt-1">{errors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                      Month <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={formData.birthdayDetails.month}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          birthdayDetails: {
                            ...p.birthdayDetails,
                            month: parseInt(e.target.value, 10) || 1,
                          },
                        }))
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-[#170e28] border border-white/15 focus:border-rose-400 focus:outline-none text-white text-base cursor-pointer"
                    >
                      {[
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                      ].map((m, idx) => (
                        <option key={m} value={idx + 1}>
                          {m}
                        </option>
                      ))}
                    </select>
                    {errors.month && <p className="text-rose-400 text-xs mt-1">{errors.month}</p>}
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                      Age / Milestone <span className="text-slate-500 text-xs font-normal">(Optional)</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={formData.birthdayDetails.age || ''}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          birthdayDetails: {
                            ...p.birthdayDetails,
                            age: e.target.value ? parseInt(e.target.value, 10) : undefined,
                          },
                        }))
                      }
                      placeholder="e.g. 21, 30"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-rose-400 focus:outline-none text-white text-base"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Show Birthday Countdown</h4>
                    <p className="text-xs text-slate-400">
                      Displays a live celebratory counter on the recipient's page.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.birthdayDetails.showCountdown}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        birthdayDetails: {
                          ...p.birthdayDetails,
                          showCountdown: e.target.checked,
                        },
                      }))
                    }
                    className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: PERSONALIZED MESSAGE */}
          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Step 4</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
                  Craft Your General Birthday Message
                </h2>
                <p className="text-slate-300 text-sm mt-1">
                  A celebratory birthday greeting for the intro and celebration card.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Click to use a suggested greeting:</span>
                </label>
                <div className="flex flex-col gap-2">
                  {SUGGESTED_MESSAGES.map((msg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          message: { ...p.message, mainMessage: msg },
                        }))
                      }
                      className="text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-all"
                    >
                      "{msg.slice(0, 85)}..."
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-slate-200">
                    Main Greeting Message <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-xs text-slate-400">
                    {formData.message.mainMessage.length}/3000 chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={formData.message.mainMessage}
                  maxLength={3000}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      message: { ...p.message, mainMessage: e.target.value },
                    }))
                  }
                  placeholder="Write your greeting here..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-white placeholder-slate-500 text-sm sm:text-base leading-relaxed"
                />
                {errors.mainMessage && (
                  <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.mainMessage}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 5: YOUR BIRTHDAY WISH & SPECIAL LETTER */}
          {currentStep === 5 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold mb-2">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>Step 5: Your Birthday Wish 💌</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  Your Deepest Birthday Wish & Special Letter
                </h2>
                <p className="text-slate-300 text-sm mt-1">
                  This will be revealed in a special animated letter ("Open Your Special Letter 💌") after they blow out the candles.
                </p>
              </div>

              {/* Romantic Letter Form Container */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-950/40 via-purple-950/30 to-pink-950/40 border border-rose-500/30 shadow-2xl space-y-5">
                {/* Personal Wish Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-bold text-rose-200 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
                      <span>Your Birthday Wish (Main Letter)</span>
                    </label>
                    <span className="text-xs text-rose-300/80 font-mono">
                      {(formData.birthdayWish?.personalWish || '').length}/3000 chars
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={formData.birthdayWish?.personalWish || ''}
                    maxLength={3000}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        birthdayWish: {
                          ...p.birthdayWish!,
                          personalWish: e.target.value,
                        },
                      }))
                    }
                    placeholder="Write something from your heart... something you want them to remember forever. ❤️"
                    className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-rose-400/30 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/25 text-white placeholder-rose-300/40 text-sm sm:text-base leading-relaxed font-sans"
                  />
                  <p className="text-[11px] text-rose-300/80 mt-1">
                    * If you leave this wish empty, the special letter section will be neatly hidden.
                  </p>
                </div>

                {/* Heartfelt Note / Promise */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-rose-200 mb-1">
                      A Special Promise or Vow <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.birthdayWish?.specialPromise || ''}
                      maxLength={150}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          birthdayWish: {
                            ...p.birthdayWish!,
                            specialPromise: e.target.value,
                          },
                        }))
                      }
                      placeholder="e.g. I promise to always cheer you on..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-rose-400/20 text-white text-xs sm:text-sm placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-rose-200 mb-1">
                      Heartfelt Ending Line <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.birthdayWish?.heartfeltMessage || ''}
                      maxLength={150}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          birthdayWish: {
                            ...p.birthdayWish!,
                            heartfeltMessage: e.target.value,
                          },
                        }))
                      }
                      placeholder="e.g. You mean the absolute world to me."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-rose-400/20 text-white text-xs sm:text-sm placeholder-slate-500"
                    />
                  </div>
                </div>

                {/* Creator Sign / Nickname */}
                <div>
                  <label className="block text-xs font-semibold text-rose-200 mb-1">
                    Sign As <span className="text-slate-400 font-normal">(e.g. "Forever yours", "Your partner-in-crime")</span>
                  </label>
                  <input
                    type="text"
                    value={formData.birthdayWish?.creatorSign || ''}
                    maxLength={60}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        birthdayWish: {
                          ...p.birthdayWish!,
                          creatorSign: e.target.value,
                        },
                      }))
                    }
                    placeholder={`e.g. With all my love, ${formData.creatorName || 'Me'} ❤️`}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-rose-400/20 text-white text-xs sm:text-sm placeholder-slate-500"
                  />
                </div>

                {/* Live Preview Card */}
                {formData.birthdayWish?.personalWish && (
                  <div className="mt-6 pt-5 border-t border-rose-500/20">
                    <div className="text-xs uppercase font-bold text-amber-300 tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Live Letter Preview</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-slate-100 shadow-lg text-left">
                      <p className="font-display font-bold text-sm text-rose-300 mb-2">
                        To My Dearest {formData.recipientName || 'Someone Special'},
                      </p>
                      <p className="text-xs sm:text-sm whitespace-pre-line leading-relaxed mb-4">
                        {formData.birthdayWish.personalWish}
                      </p>
                      {formData.birthdayWish.specialPromise && (
                        <p className="text-xs text-amber-200 italic mb-2">
                          "{formData.birthdayWish.specialPromise}"
                        </p>
                      )}
                      <div className="border-t border-white/10 pt-2 flex justify-between items-center text-xs text-slate-300 font-cursive text-base">
                        <span>{formData.birthdayWish.heartfeltMessage || 'Always & Forever'}</span>
                        <span className="text-rose-300">
                          {formData.birthdayWish.creatorSign || `~ ${formData.creatorName || 'Your Love'}`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 6: RELATIONSHIP QUESTIONS SECTION */}
          {currentStep === 6 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Step 6</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
                  "Let's Talk About Us ❤️" Questions
                </h2>
                <p className="text-slate-300 text-sm mt-1">
                  An interactive, affectionate card series for the recipient after blowing out the candles. You can keep our 7 curated questions, tweak them, or turn this section off.
                </p>
              </div>

              {/* Enable / Disable Toggle */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    <span>Enable "Let's Talk About Us ❤️" Section</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Recipients will be presented with one question at a time, with answers saved for you to view privately.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.relationshipQuestions?.enabled}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      relationshipQuestions: {
                        ...p.relationshipQuestions!,
                        enabled: e.target.checked,
                      },
                    }))
                  }
                  className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                />
              </div>

              {formData.relationshipQuestions?.enabled && (
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-slate-300 mb-2">
                    Active Questions ({formData.relationshipQuestions.questions.length}):
                  </div>

                  {formData.relationshipQuestions.questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-3 text-left"
                    >
                      <div>
                        <span className="text-[11px] font-bold text-rose-400 uppercase">
                          Question {idx + 1} ({q.type === 'choice' ? 'Choice' : 'Written text'})
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{q.question}</h4>
                        {q.options && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {q.options.map((opt, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] text-slate-300"
                              >
                                {opt}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                        title="Remove question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Add Custom Question */}
                  <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-dashed border-white/20 flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      value={customQuestionInput}
                      onChange={(e) => setCustomQuestionInput(e.target.value)}
                      placeholder="Add a custom question (e.g. What is our next bucket list destination?)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomQuestion}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-rose-500 hover:bg-rose-600 text-white shrink-0 flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Question</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 7: PHOTOS AND MEMORIES */}
          {currentStep === 7 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Step 7</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
                  Photo Memories Gallery
                </h2>
                <p className="text-slate-300 text-sm mt-1">
                  Upload cherished moments (optional). Recipients will be able to swipe through them in a Polaroid-style showcase with your captions.
                </p>
              </div>

              <div className="border-2 border-dashed border-white/20 hover:border-rose-400 rounded-3xl p-8 text-center transition-colors mb-6 bg-white/5 relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center pointer-events-none">
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                    <Upload className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">
                    Click or Drag Photos Here
                  </h4>
                  <p className="text-xs text-slate-400 mb-2">
                    Supports JPG, PNG, WEBP (Up to 12 photos, max 3MB each)
                  </p>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold">
                    {formData.photos.length} / 12 Photos Added
                  </span>
                </div>
              </div>

              {formData.photos.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-col gap-2 relative"
                    >
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                        <img
                          src={photo.url}
                          alt={`Memory ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600/90 text-white hover:bg-red-500 shadow-md transition-colors"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={photo.caption || ''}
                        maxLength={100}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((p) => ({
                            ...p,
                            photos: p.photos.map((ph) => (ph.id === photo.id ? { ...ph, caption: val } : ph)),
                          }));
                        }}
                        placeholder="Add a heartwarming caption..."
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 8: MUSIC SELECTION */}
          {currentStep === 8 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Step 8</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
                  Background Song: "En Nenjorathil" & Audio
                </h2>
                <p className="text-slate-300 text-sm mt-1">
                  Plays immediately when the recipient blows out the candles. You can use our default Tamil song "En Nenjorathil", or upload your own authorized audio track.
                </p>
              </div>

              {/* Music Enabled Toggle */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-white">Enable Background Music</h4>
                  <p className="text-xs text-slate-400">
                    Music starts automatically the instant they blow out the candles.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.music.enabled}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      music: { ...p.music, enabled: e.target.checked },
                    }))
                  }
                  className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                />
              </div>

              {formData.music.enabled && (
                <div className="space-y-4">
                  {/* Track List */}
                  <div className="grid grid-cols-1 gap-3">
                    {AVAILABLE_TRACKS.map((track) => {
                      const isSelected = formData.music.trackId === track.id;
                      const isPlayingThis = playingTrackId === track.id;

                      return (
                        <div
                          key={track.id}
                          onClick={() =>
                            setFormData((p) => ({
                              ...p,
                              music: {
                                ...p.music,
                                trackId: track.id,
                                trackName: track.name,
                              },
                            }))
                          }
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-rose-950/40 border-rose-400 shadow-md ring-1 ring-rose-400/50'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleTrackTest(track.id, formData.music.customAudioUrl);
                              }}
                              className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors"
                              title={isPlayingThis ? 'Pause preview' : 'Play preview'}
                            >
                              {isPlayingThis ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                            </button>

                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm text-white">{track.name}</h4>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold">
                                  {track.mood}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {track.artist} • {track.description}
                              </p>
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                              isSelected
                                ? 'bg-rose-500 border-rose-400 text-white'
                                : 'border-slate-600'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Upload Custom Audio File Box */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-left">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <FileAudio className="w-4 h-4 text-amber-300" />
                        <span>Upload Your Own Audio File (MP3 / WAV)</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formData.music.customAudioUrl
                          ? `Custom audio loaded: "${formData.music.trackName}"`
                          : 'Have an authorized file of "En Nenjorathil" or your favorite love song? Upload it here.'}
                      </p>
                    </div>

                    <label className="px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-xs font-bold text-white cursor-pointer hover:scale-105 transition-transform flex items-center gap-2 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{formData.music.customAudioUrl ? 'Replace Audio File' : 'Upload MP3 / Audio'}</span>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 9: OPTIONAL SURPRISE SETTINGS */}
          {currentStep === 9 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Step 9</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
                  Surprise Settings & Passcode
                </h2>
                <p className="text-slate-300 text-sm mt-1">
                  Configure visual flair, confetti effects, and optionally lock the surprise behind a secret 4-digit passcode.
                </p>
              </div>

              <div className="space-y-6">
                {/* ROMANTIC PROPOSAL CUSTOMIZATION */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/40 via-pink-950/30 to-purple-950/40 border border-purple-400/30 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-purple-400/20">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💍</span>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          Romantic Proposal Question (Optional)
                        </h4>
                        <p className="text-[11px] text-purple-200/80">
                          Ask a sweet, heartfelt question for your special someone.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 font-semibold">
                      Customizable
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-200 mb-1">
                      Proposal Question
                    </label>
                    <input
                      type="text"
                      value={formData.proposal?.question || ''}
                      maxLength={160}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          proposal: {
                            ...p.proposal!,
                            question: e.target.value,
                          },
                        }))
                      }
                      placeholder="e.g. Will you be mine and create more beautiful memories together? 💍"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-purple-400/30 text-white text-xs sm:text-sm placeholder-slate-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-purple-200 mb-1">
                        Option 1 (Positive)
                      </label>
                      <input
                        type="text"
                        value={formData.proposal?.options?.yesText || ''}
                        maxLength={50}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            proposal: {
                              ...p.proposal!,
                              options: {
                                ...p.proposal!.options,
                                yesText: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="Yes, of course! ❤️"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-purple-400/20 text-white text-xs placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-purple-200 mb-1">
                        Option 2 (Positive)
                      </label>
                      <input
                        type="text"
                        value={formData.proposal?.options?.alreadyText || ''}
                        maxLength={50}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            proposal: {
                              ...p.proposal!,
                              options: {
                                ...p.proposal!.options,
                                alreadyText: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="You already have my heart! 🥹"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-purple-400/20 text-white text-xs placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-purple-200 mb-1">
                        Option 3 (Gentle)
                      </label>
                      <input
                        type="text"
                        value={formData.proposal?.options?.thinkText || ''}
                        maxLength={50}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            proposal: {
                              ...p.proposal!,
                              options: {
                                ...p.proposal!.options,
                                thinkText: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="Let me think about it 💗"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-purple-400/20 text-white text-xs placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-purple-200 mb-1">
                        Celebration Message (Shown on Option 1 & 2)
                      </label>
                      <input
                        type="text"
                        value={formData.proposal?.messages?.positiveResponse || ''}
                        maxLength={120}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            proposal: {
                              ...p.proposal!,
                              messages: {
                                ...p.proposal!.messages,
                                positiveResponse: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="You just made this moment unforgettable! ❤️"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-purple-400/20 text-white text-xs placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-purple-200 mb-1">
                        Thoughtful Response (Shown on Option 3)
                      </label>
                      <input
                        type="text"
                        value={formData.proposal?.messages?.thinkResponse || ''}
                        maxLength={120}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            proposal: {
                              ...p.proposal!,
                              messages: {
                                ...p.proposal!.messages,
                                thinkResponse: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="Take your time. Your feelings matter. 💗"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-purple-400/20 text-white text-xs placeholder-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {/* VIRTUAL HUG CUSTOMIZATION */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-950/40 via-rose-950/30 to-pink-950/40 border border-pink-400/30 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-pink-400/20">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🫂</span>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          Heartfelt Hug & Warm Wishes (Optional)
                        </h4>
                        <p className="text-[11px] text-pink-200/80">
                          A sweet, warm hug message to show extra affection.
                        </p>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs text-pink-200">Enable Hug</span>
                      <input
                        type="checkbox"
                        checked={formData.virtualHug?.enabled !== false}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            virtualHug: {
                              ...p.virtualHug!,
                              enabled: e.target.checked,
                            },
                          }))
                        }
                        className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-pink-200 mb-1">
                        Virtual Hug Message
                      </label>
                      <input
                        type="text"
                        value={formData.virtualHug?.message || ''}
                        maxLength={120}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            virtualHug: {
                              ...p.virtualHug!,
                              message: e.target.value,
                            },
                          }))
                        }
                        placeholder="Sending you the biggest virtual hug! 🫂"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-pink-400/30 text-white text-xs sm:text-sm placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-pink-200 mb-1">
                        Hug Animation Style
                      </label>
                      <select
                        value={formData.virtualHug?.style || 'warm-trio'}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            virtualHug: {
                              ...p.virtualHug!,
                              style: e.target.value as any,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-pink-400/30 text-white text-xs sm:text-sm focus:outline-none"
                      >
                        <option value="warm-trio">Warm Trio Hug (All 3 Pandas Embrace)</option>
                        <option value="heart-squeeze">Heart Squeeze (Beating Heart Pulse)</option>
                        <option value="cozy-snuggle">Cozy Snuggle (Gentle Cuddle)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* VISUAL FLAIR TOGGLES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'confetti', label: 'Confetti Cannons', desc: 'Explosive party confetti on reveal' },
                    { key: 'floatingHearts', label: 'Floating Hearts', desc: 'Gentle rising heart particles' },
                    { key: 'balloons', label: 'Balloons Animation', desc: 'Festive celebratory balloon release' },
                    { key: 'sparkles', label: 'Sparkle Stardust', desc: 'Twinkling magical ambient effects' },
                    { key: 'finalMessage', label: 'Final Wish Card', desc: 'Heartwarming closing celebration wish' },
                    { key: 'photoGallery', label: 'Photo Gallery Section', desc: 'Display photo memories carousel' },
                  ].map((setting) => (
                    <div
                      key={setting.key}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white">{setting.label}</h4>
                        <p className="text-[11px] text-slate-400">{setting.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={Boolean(formData.settings[setting.key as keyof typeof formData.settings])}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            settings: {
                              ...p.settings,
                              [setting.key]: e.target.checked,
                            },
                          }))
                        }
                        className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                {/* SECRET PASSCODE */}
                <div className="mt-6 p-5 rounded-2xl bg-amber-500/10 border border-amber-400/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-bold text-amber-200">
                        Optional 4-Digit Secret Passcode
                      </h4>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.settings.hasPasscode}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          settings: { ...p.settings, hasPasscode: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  <p className="text-xs text-amber-200/80 mb-3">
                    If enabled, the recipient must enter this 4-digit code to unlock the letter and memories.
                  </p>

                  {formData.settings.hasPasscode && (
                    <div>
                      <input
                        type="text"
                        maxLength={4}
                        pattern="\d*"
                        value={formData.passcode || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setFormData((p) => ({ ...p, passcode: val }));
                          if (errors.passcode) setErrors((p) => ({ ...p, passcode: '' }));
                        }}
                        placeholder="e.g. 1024"
                        className="w-48 px-4 py-2.5 rounded-xl bg-black/40 border border-amber-400/30 text-amber-300 font-mono text-center tracking-widest text-lg focus:outline-none focus:border-amber-400"
                      />
                      {errors.passcode && (
                        <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.passcode}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 10: PREVIEW AND CONFIRMATION */}
          {currentStep === 10 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Step 10</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
                  Full Experience Preview & Link Creation
                </h2>
                <p className="text-slate-300 text-sm mt-1">
                  Review how your surprise will look and feel to {formData.recipientName || 'your special someone'}.
                </p>
              </div>

              <div
                className={`rounded-3xl p-6 sm:p-8 border border-white/20 mb-8 transition-colors duration-700 ${selectedTheme.bgClass} shadow-2xl relative overflow-hidden`}
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-2">
                    <Sparkles className="w-3 h-3" />
                    <span>Theme: {selectedTheme.name}</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
                    Happy Birthday, {formData.recipientName || 'Name'}! 🎉
                  </h3>
                  {formData.nickname && (
                    <p className="text-xs sm:text-sm text-rose-300 font-medium mt-1">
                      Our one and only "{formData.nickname}"
                    </p>
                  )}
                </div>

                {/* Cake in Preview */}
                <InteractiveCake
                  theme={selectedTheme}
                  recipientName={formData.recipientName || 'Alex'}
                />

                {/* Song indicator */}
                <div className="mt-4 p-3 rounded-2xl bg-white/10 max-w-sm mx-auto text-xs text-rose-200 flex items-center justify-center gap-2">
                  <Music className="w-4 h-4 text-rose-400" />
                  <span>Music: {formData.music.trackName}</span>
                </div>

                {/* 6 Step Romantic Journey Preview in Wizard */}
                <div className="mt-8 p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 max-w-2xl mx-auto">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3 flex items-center justify-center gap-1.5">
                    <span>✨</span>
                    <span>The 6-Step Romantic Journey for Them:</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 my-2 text-left">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-base">🔐</span>
                      <h5 className="text-xs font-bold text-rose-300 mt-1">1. Secret Code</h5>
                      <p className="text-[10px] text-slate-300">Unlocks with special code</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-base">📸</span>
                      <h5 className="text-xs font-bold text-amber-300 mt-1">2. Wish & Photo</h5>
                      <p className="text-[10px] text-slate-300">Birthday photo polaroid</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-base">🎂</span>
                      <h5 className="text-xs font-bold text-pink-300 mt-1">3. Birthday Cake</h5>
                      <p className="text-[10px] text-slate-300">Tap or blow out candles</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-base">💌</span>
                      <h5 className="text-xs font-bold text-rose-300 mt-1">4. Heartfelt Letter</h5>
                      <p className="text-[10px] text-slate-300">Wax-sealed personal letter</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-base">💭</span>
                      <h5 className="text-xs font-bold text-purple-300 mt-1">5. Sweet Questions</h5>
                      <p className="text-[10px] text-slate-300">Interactive memories quiz</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-base">🌟</span>
                      <h5 className="text-xs font-bold text-amber-300 mt-1">6. Grand Finale</h5>
                      <p className="text-[10px] text-slate-300">"Let the day be super!"</p>
                    </div>
                  </div>

                  <div className="mt-3 py-2 px-3 rounded-xl bg-pink-500/20 border border-pink-400/30 text-[11px] text-pink-200 font-semibold text-center">
                    🎵 Plays Tamil romantic song: "En Neelothi - Sirai" (Justin Prabhakaran)
                  </div>
                </div>

                {/* Special Letter in Preview */}
                {formData.birthdayWish?.personalWish && (
                  <div className="max-w-lg mx-auto mt-6 p-6 rounded-2xl bg-gradient-to-br from-rose-950/60 to-purple-950/60 backdrop-blur-md border border-rose-400/30 text-left">
                    <div className="flex items-center gap-2 mb-2 text-rose-300 text-xs font-bold uppercase">
                      <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                      <span>Special Birthday Letter</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-100 whitespace-pre-line leading-relaxed mb-4">
                      {formData.birthdayWish.personalWish}
                    </p>
                    <div className="border-t border-white/10 pt-3 flex items-center justify-between text-xs text-slate-300 font-cursive text-sm">
                      <span>{formData.birthdayWish.heartfeltMessage || 'With love'}</span>
                      <span className="text-rose-300">
                        {formData.birthdayWish.creatorSign || `~ ${formData.creatorName || 'Your Love'}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {errors.submit && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errors.submit}</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Navigation Controls Bar */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {currentStep < 10 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-7 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-rose-500 to-purple-600 hover:scale-105 transition-all shadow-lg shadow-rose-500/25 flex items-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateSurprise}
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-rose-500 via-purple-600 to-amber-500 hover:scale-105 transition-all shadow-xl shadow-rose-500/30 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Magical Link...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Create Birthday Link</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
