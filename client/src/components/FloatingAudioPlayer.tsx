import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, FileMusic, BookOpen, Video, VideoOff } from 'lucide-react';
import { audioEngine, AVAILABLE_TRACKS, type AudioStatus } from '../utils/audioEngine';
import { SongLyricsModal } from './SongLyricsModal';

interface FloatingAudioPlayerProps {
  trackId?: string;
  customAudioUrl?: string;
  autoStart?: boolean;
}

export const FloatingAudioPlayer: React.FC<FloatingAudioPlayerProps> = ({
  trackId = 'en-neelothi',
  customAudioUrl,
  autoStart = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [audioStatus, setAudioStatus] = useState<AudioStatus>('stopped');
  const [showLyricsModal, setShowLyricsModal] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [uploadedSongUrl, setUploadedSongUrl] = useState<string | null>(customAudioUrl || null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const trackInfo =
    AVAILABLE_TRACKS.find((t) => t.id === trackId) ||
    AVAILABLE_TRACKS[0];

  useEffect(() => {
    const unsubscribe = audioEngine.subscribeStatus((status) => {
      setAudioStatus(status);
      setIsPlaying(status === 'playing');
      setIsMuted(status === 'muted');
    });

    if (autoStart && !audioEngine.getIsPlaying()) {
      audioEngine.playTrack(trackId, uploadedSongUrl || customAudioUrl);
    }

    return () => {
      unsubscribe();
      audioEngine.stopTrack();
    };
  }, [trackId, customAudioUrl, autoStart, uploadedSongUrl]);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      audioEngine.pauseTrack();
    } else {
      await audioEngine.playTrack(trackId, uploadedSongUrl || customAudioUrl);
    }
  };

  const handleToggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioEngine.setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
      audioEngine.toggleMute();
    }
  };

  // Upload custom MP3 from device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setUploadedSongUrl(blobUrl);
      audioEngine.playTrack('custom-upload', blobUrl);
    }
  };

  const getStatusBadge = () => {
    if (audioStatus === 'playing') return { text: 'Now Playing', color: 'text-emerald-400' };
    if (audioStatus === 'paused') return { text: 'Paused', color: 'text-amber-400' };
    if (audioStatus === 'muted') return { text: 'Muted', color: 'text-rose-400' };
    if (audioStatus === 'error') return { text: 'Tap to Play', color: 'text-rose-400' };
    return { text: 'Ready', color: 'text-slate-400' };
  };

  const badge = getStatusBadge();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 select-none"
      >
        {/* Optional Embedded Video / Complete Song IFrame Player */}
        <AnimatePresence>
          {showVideo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="w-72 sm:w-80 h-44 sm:h-48 rounded-3xl overflow-hidden glass-panel border border-white/20 shadow-2xl relative"
            >
              <iframe
                src="https://www.youtube.com/embed/wxmOt7Xhb6I?autoplay=1&enablejsapi=1&playsinline=1"
                title="En Neelothi Complete Song"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="w-full h-full border-0"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Controller Capsule */}
        <div className="glass-panel px-3.5 py-2.5 rounded-full flex items-center gap-2.5 sm:gap-3 shadow-2xl border border-white/20 hover:border-white/30 transition-all">
          {/* Animated Equalizer Bars */}
          <div className="flex items-center gap-0.5 h-4 w-4">
            {[1, 2, 3].map((bar) => (
              <motion.span
                key={bar}
                animate={
                  isPlaying && !isMuted
                    ? {
                        height: ['4px', '14px', '6px', '16px', '8px'],
                      }
                    : { height: '4px' }
                }
                transition={{
                  repeat: Infinity,
                  duration: 0.8 + bar * 0.2,
                  ease: 'easeInOut',
                }}
                className="w-1 bg-gradient-to-t from-rose-500 to-amber-300 rounded-full"
              />
            ))}
          </div>

          {/* Track Title and Artist */}
          <div className="hidden sm:flex flex-col text-left pr-1 max-w-[160px]">
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] uppercase tracking-wider font-bold ${badge.color}`}>
                {badge.text}
              </span>
            </div>
            <span className="text-xs text-white font-bold truncate" title="En Neelothi - Sirai">
              {uploadedSongUrl ? 'Personal Track' : 'En Neelothi - Sirai'}
            </span>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={handleTogglePlay}
            className={`p-2 rounded-full text-white transition-all shadow-md ${
              isPlaying
                ? 'bg-white/10 hover:bg-white/20'
                : 'bg-rose-500 hover:bg-rose-600 animate-pulse'
            }`}
            title={isPlaying ? 'Pause Song' : 'Play Song'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          {/* Complete Lyrics Button */}
          <button
            onClick={() => setShowLyricsModal(true)}
            className="px-2.5 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 hover:text-white border border-rose-400/30 text-[11px] font-bold flex items-center gap-1 transition-all"
            title="View Song Lyrics"
          >
            <BookOpen className="w-3 h-3 text-rose-400" />
            <span>Lyrics 📜</span>
          </button>

          {/* Watch Official Video / Complete Audio Mode Toggle */}
          <button
            onClick={() => setShowVideo((prev) => !prev)}
            className={`p-1.5 rounded-full transition-colors ${
              showVideo
                ? 'bg-rose-500 text-white'
                : 'bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white'
            }`}
            title={showVideo ? 'Close Video Player' : 'Watch Official Song Video'}
          >
            {showVideo ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
          </button>

          {/* Custom MP3 File Upload Icon (Optional Local File Playback) */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            title="Choose MP3 from device"
          >
            <FileMusic className="w-3.5 h-3.5 text-amber-300" />
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Mute/Volume Button */}
          <div className="relative flex items-center">
            <button
              onClick={handleToggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              )}
            </button>

            {/* Volume Slider popup */}
            <AnimatePresence>
              {showVolumeSlider && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                  className="absolute bottom-10 right-0 p-2.5 rounded-2xl glass-panel border border-white/15 shadow-2xl flex flex-col items-center gap-1.5"
                >
                  <span className="text-[10px] text-slate-300 font-medium">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 accent-rose-500 h-1.5 cursor-pointer bg-slate-700 rounded-lg"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* FULL COMPLETE SONG LYRICS MODAL */}
      <SongLyricsModal
        isOpen={showLyricsModal}
        onClose={() => setShowLyricsModal(false)}
      />
    </>
  );
};
