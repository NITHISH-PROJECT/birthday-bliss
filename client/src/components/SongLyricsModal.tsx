import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, X, Heart, Sparkles, Languages } from 'lucide-react';

interface SongLyricsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SONG_LYRICS = [
  {
    singer: 'Sooraj Santhosh (Male)',
    tamil: 'என்.. நீலோத்தி, நீலோத்தி\nஉன் நெனப்புல லாந்துறேன் லாந்துறேன்\nநான்.. ஆலாத்தி, ஆலாத்தி\nஎன் உசுருல ஏந்துறேன் ஏந்துறேன்',
    tanglish: 'En.. Neelothi, Neelothi\nUn Nenappula Laandhuren Laandhuren\nNaan.. Aalaathi, Aalaathi\nEn Usurula Yendhuren Yendhuren',
  },
  {
    singer: 'Sooraj Santhosh',
    tamil: 'மூசாவ தேடி ஈசன் கிட்ட\nதுஆவும் செஞ்சி வணங்குனேன்\nஇருட்டறையில தான் இருந்தவன்\nவெளிச்சத்த காட்டிய மூமினும நீ...',
    tanglish: 'Moosaava Thedi Eesan Kitta\nDuaavum Senji Vanangunen\nIruttaraiyila Dhaan Irundhavan\nVelichatha Kaatiya Muminume Nee...',
  },
  {
    singer: 'Chinmayi Sripada (Female)',
    tamil: 'உன்.. நீலோத்தியே, நீலோத்தியே\nஉன் நெனப்புல லாந்துறேன் லாந்துறேன்\nநான்.. ஆலாத்தியே, ஆலாத்தியே\nஎன் உசுருல ஏந்துறேன் ஏந்துறேன்',
    tanglish: 'Un.. Neelothiye, Neelothiye\nUn Nenappula Laandhuren Laandhuren\nNaan.. Aalaathiye, Aalaathiye\nEn Usurula Yendhuren Yendhuren',
  },
  {
    singer: 'Chinmayi & Sooraj',
    tamil: 'பக்கத் தொண நானும் உண்டு\nநெஞ்சின் வலி ஆத்திக்க\nநேந்துக்கிட்டேன் சாமி கிட்ட\nஎஞ்சாமிய பாத்துக்க\nஎண்ணம் போல வாழ்க\nநம்பிக்கையா போய் வா\nநா வருவேன் நா வருவேன்\nஅது வர நெனப்புல கலங்காத...',
    tanglish: 'Pakka Thona Naanum Undu\nNenjin Vali Aathika\nNendhukitten Saami Kitta\nEnjaamiya Paathuka\nEnnom Pola Vaazhka\nNambikkaiyaa Poi Vaa\nNaa Varuven Naa Varuven\nAdhu Vara Nenappula Kalangadha...',
  },
  {
    singer: 'Duet (Chorus)',
    tamil: 'நெனச்ச வாழ்க வேணுமுன்னு\nநோலம் கெடந்து ஏங்குதே\nபடைச்ச சாமி கேக்காததையும்\nபடிச்ச சாமி கேட்டதே\nஎல்லாரையும் போல நல்லா இருப்போம் நாள\nநீதி தரும் செய்தி வரும்\nநமக்குண்டு அழகிய எதிர்காலம்...',
    tanglish: 'Nenacha Vazhka Venumunnu\nNolam Kedandhu Yengudhe\nPadacha Saami Kekkaadhadhaiyum\nPadicha Saami Kettadhey\nEllaraiyum Pola Nallaaruppom Naala\nNeedhi Tharum Sedhi Varum\nNamakkundu Azhagiya Edhir Kaalom...',
  },
  {
    singer: 'Outro',
    tamil: 'இனி தடையில்ல ஒரு கொடைக்குள்ள\nவாழ்ந்திடும் காட்சியும் தெரிகிறதே... ❤️',
    tanglish: 'Ini Thadaiyilla Oru Kodaikulla\nVaazhndhidum Kaatchiyum Therigiradhey... ❤️',
  },
];

export const SongLyricsModal: React.FC<SongLyricsModalProps> = ({ isOpen, onClose }) => {
  const [lang, setLang] = useState<'both' | 'tamil' | 'tanglish'>('both');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-lg max-h-[85vh] bg-gradient-to-b from-[#1c0d1c] via-[#241122] to-[#140813] text-white rounded-3xl border border-rose-500/30 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-5 pb-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-400">
                <Music className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm sm:text-base text-rose-200">
                  En Neelothi (நீலோத்தி)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Sirai • Justin Prabhakaran • Sooraj & Chinmayi
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Language Toggle */}
          <div className="px-5 py-2.5 bg-black/30 border-b border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
              <Languages className="w-3.5 h-3.5 text-rose-400" />
              Lyrics Script:
            </span>

            <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-full text-[11px]">
              <button
                onClick={() => setLang('both')}
                className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
                  lang === 'both' ? 'bg-rose-500 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Both
              </button>
              <button
                onClick={() => setLang('tanglish')}
                className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
                  lang === 'tanglish' ? 'bg-rose-500 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang('tamil')}
                className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
                  lang === 'tamil' ? 'bg-rose-500 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                தமிழ்
              </button>
            </div>
          </div>

          {/* Lyrics Verses Container */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-left text-xs sm:text-sm leading-relaxed">
            {SONG_LYRICS.map((verse, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-rose-500/30 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-rose-400 mb-2">
                  <Sparkles className="w-3 h-3" />
                  <span>{verse.singer}</span>
                </div>

                {/* Tanglish Lyrics */}
                {(lang === 'tanglish' || lang === 'both') && (
                  <p className="text-slate-200 font-medium whitespace-pre-line mb-1.5">
                    {verse.tanglish}
                  </p>
                )}

                {/* Tamil Script Lyrics */}
                {(lang === 'tamil' || lang === 'both') && (
                  <p className="text-rose-300/90 font-serif whitespace-pre-line text-[13px] sm:text-base">
                    {verse.tamil}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Footer with Song Info */}
          <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Full Romantic Track from Sirai</span>
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
