import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowRight, CheckCircle2, CornerDownRight } from 'lucide-react';
import type { RelationshipQuestion, RecipientAnswer } from '../types/surprise';
import { api } from '../services/api';
import { audioEngine } from '../utils/audioEngine';

interface RelationshipQuestionsSectionProps {
  surpriseId: string;
  recipientName: string;
  creatorName: string;
  questions?: RelationshipQuestion[];
  onComplete: () => void;
}

export const DEFAULT_QUESTIONS: RelationshipQuestion[] = [
  {
    id: 'q1',
    question: 'Do you love me? ❤️',
    type: 'choice',
    options: ['Of course! ❤️', 'More than you know! 🥹', 'You already know the answer! 💕'],
  },
  {
    id: 'q2',
    question: 'What am I to you?',
    type: 'choice',
    options: [
      'Someone special ❤️',
      'My favourite person 🫶',
      'My happiness 😊',
      'Something I can’t explain 💗',
    ],
  },
  {
    id: 'q3',
    question: 'What is your favourite memory with me?',
    type: 'text',
  },
  {
    id: 'q4',
    question: 'Do you want to create more beautiful memories together?',
    type: 'choice',
    options: ['Definitely! ❤️', 'A thousand times yes! 🥹', 'Let’s make every moment count! ✨'],
  },
  {
    id: 'q5',
    question: 'What is one thing you want to tell me?',
    type: 'textarea',
  },
  {
    id: 'q6',
    question: 'How much do I mean to you?',
    type: 'choice',
    options: [
      'A little more every day ❤️',
      'More than words can explain 💕',
      'You’re irreplaceable 🫶',
    ],
  },
  {
    id: 'q7',
    question: 'Will you stay in my life and create more memories with me?',
    type: 'choice',
    options: [
      'Yes, let’s make beautiful memories ❤️',
      'Always cherish our bond 🫶',
      'Let’s see where our journey takes us ✨',
    ],
  },
];

export const RelationshipQuestionsSection: React.FC<RelationshipQuestionsSectionProps> = ({
  surpriseId,
  recipientName,
  creatorName,
  questions = DEFAULT_QUESTIONS,
  onComplete,
}) => {
  const activeQuestions = questions.length > 0 ? questions : DEFAULT_QUESTIONS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<RecipientAnswer[]>([]);
  const [currentTextAnswer, setCurrentTextAnswer] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentQ = activeQuestions[currentIndex];

  const handleSelectOption = (option: string) => {
    audioEngine.playChime();
    const updated = [
      ...answers.filter((a) => a.questionId !== currentQ.id),
      {
        questionId: currentQ.id,
        questionText: currentQ.question,
        answerText: option,
      },
    ];
    setAnswers(updated);
    advanceQuestion(updated);
  };

  const handleTextSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentTextAnswer.trim()) {
      handleSkip();
      return;
    }
    audioEngine.playChime();
    const updated = [
      ...answers.filter((a) => a.questionId !== currentQ.id),
      {
        questionId: currentQ.id,
        questionText: currentQ.question,
        answerText: currentTextAnswer.trim(),
      },
    ];
    setAnswers(updated);
    setCurrentTextAnswer('');
    advanceQuestion(updated);
  };

  const handleSkip = () => {
    audioEngine.playChime();
    setCurrentTextAnswer('');
    advanceQuestion(answers);
  };

  const advanceQuestion = async (latestAnswers: RecipientAnswer[]) => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Reached the end
      setIsFinished(true);
      setIsSaving(true);
      try {
        await api.submitAnswers(surpriseId, latestAnswers);
      } catch (err) {
        console.warn('Could not save answers to server:', err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl mx-auto p-8 rounded-3xl glass-panel border border-white/20 shadow-2xl text-center"
      >
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 mx-auto mb-4 flex items-center justify-center">
          <Heart className="w-8 h-8 fill-rose-500 animate-pulse" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-2">
          Thank you for sharing your heart with me. ❤️
        </h3>

        <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
          Every thought, every smile, and every memory you shared means the world to {creatorName}.
        </p>

        <button
          onClick={onComplete}
          className="px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-rose-500 to-purple-600 hover:scale-105 transition-all shadow-xl shadow-rose-500/30 flex items-center justify-center gap-2 mx-auto"
        >
          <span>Continue Your Surprise ✨</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto py-4 select-none">
      {/* Header Pill */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/25 text-rose-300 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>Let's Talk About Us ❤️</span>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Question {currentIndex + 1} of {activeQuestions.length}
        </span>
      </div>

      {/* Progress track */}
      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-rose-500 to-amber-300"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentIndex + 1) / activeQuestions.length) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -25 }}
          transition={{ duration: 0.3 }}
          className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/20 shadow-2xl relative"
        >
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white text-center mb-6 leading-snug">
            {currentQ.question}
          </h3>

          {/* Multiple Choice Options */}
          {currentQ.type === 'choice' && currentQ.options && (
            <div className="flex flex-col gap-3">
              {currentQ.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectOption(option)}
                  className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-rose-400/50 text-left text-sm sm:text-base font-semibold text-white transition-all shadow-sm flex items-center justify-between group"
                >
                  <span>{option}</span>
                  <Heart className="w-4 h-4 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity fill-rose-500" />
                </motion.button>
              ))}
            </div>
          )}

          {/* Text input */}
          {currentQ.type === 'text' && (
            <form onSubmit={handleTextSubmit} className="space-y-4">
              <input
                type="text"
                autoFocus
                value={currentTextAnswer}
                onChange={(e) => setCurrentTextAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/15 focus:border-rose-400 focus:outline-none text-white text-sm sm:text-base placeholder-slate-500"
              />
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-rose-500 to-purple-600 shadow-md hover:scale-102 transition-all flex items-center justify-center gap-2"
              >
                <span>Save Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Multiline textarea */}
          {currentQ.type === 'textarea' && (
            <form onSubmit={handleTextSubmit} className="space-y-4">
              <textarea
                rows={3}
                autoFocus
                value={currentTextAnswer}
                onChange={(e) => setCurrentTextAnswer(e.target.value)}
                placeholder="Write whatever is in your heart..."
                className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/15 focus:border-rose-400 focus:outline-none text-white text-sm sm:text-base placeholder-slate-500 leading-relaxed"
              />
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-rose-500 to-purple-600 shadow-md hover:scale-102 transition-all flex items-center justify-center gap-2"
              >
                <span>Save Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Skip option */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Skip this question for now →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
