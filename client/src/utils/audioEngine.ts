// Web Audio API Procedural Celebration Synth, Audio File Player & Sound FX Engine

export type AudioStatus = 'playing' | 'paused' | 'muted' | 'error' | 'stopped';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTrackId = 'en-neelothi';
  private timer: number | null = null;
  private masterGain: GainNode | null = null;
  private volume = 0.8;
  private isMuted = false;
  private htmlAudio: HTMLAudioElement | null = null;
  private statusListeners: Array<(status: AudioStatus) => void> = [];
  private currentStatus: AudioStatus = 'stopped';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribeStatus(listener: (status: AudioStatus) => void): () => void {
    this.statusListeners.push(listener);
    listener(this.currentStatus);
    return () => {
      this.statusListeners = this.statusListeners.filter((l) => l !== listener);
    };
  }

  private notifyStatus(status: AudioStatus) {
    this.currentStatus = status;
    this.statusListeners.forEach((l) => l(status));
  }

  public getStatus(): AudioStatus {
    return this.currentStatus;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    if (this.htmlAudio) {
      this.htmlAudio.volume = this.isMuted ? 0 : this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    if (this.htmlAudio) {
      this.htmlAudio.muted = this.isMuted;
    }
    this.notifyStatus(this.isMuted ? 'muted' : this.isPlaying ? 'playing' : 'paused');
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Play a procedural musical note with harmonic overtone
  private playNote(freq: number, startTime: number, duration: number, type: OscillatorType = 'sine', decay = true) {
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.04);

      if (decay) {
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      } else {
        gain.gain.setValueAtTime(0.2, startTime + duration - 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      }

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    } catch {
      // Audio node cleanup
    }
  }

  // 1. "En Neelothi" - Film Sirai (Composed by Justin Prabhakaran, Sung by Sooraj Santhosh & Chinmayi)
  // Scale: F# Minor (F#m - Bm - C#m - F#m)
  // Melody lines: "En.. Neelothi Neelothi... Un Nenappula Laandhuren Laandhuren... Naan.. Aalaathi Aalaathi..."
  private playEnNeelothiSequence(step: number) {
    if (!this.ctx || !this.isPlaying) return;

    const tempo = 0.38; // tender romantic acoustic tempo
    const now = this.ctx.currentTime;

    const melodyNotes: Array<{ f: number; d: number; type: OscillatorType; chord?: string }> = [
      // Phrase 1: "En.." (C#5 held tenderly)
      { f: 554.37, d: 1.5, type: 'triangle', chord: 'F#m' },
      { f: 587.33, d: 0.5, type: 'sine' },
      // "Nee-lo-thi..."
      { f: 554.37, d: 1.0, type: 'triangle' },
      { f: 493.88, d: 0.75, type: 'sine' },
      { f: 440.00, d: 1.25, type: 'triangle' },
      // "Nee-lo-thi..."
      { f: 415.30, d: 0.75, type: 'sine' },
      { f: 369.99, d: 1.5, type: 'triangle' },
      { f: 415.30, d: 0.75, type: 'sine' },
      { f: 440.00, d: 1.5, type: 'triangle' },

      // Phrase 2: "Un Ne-nap-pu-la..."
      { f: 369.99, d: 0.75, type: 'sine', chord: 'Bm' },
      { f: 415.30, d: 0.5, type: 'sine' },
      { f: 440.00, d: 0.75, type: 'triangle' },
      { f: 493.88, d: 0.75, type: 'sine' },
      { f: 554.37, d: 1.5, type: 'triangle' },
      // "Laan-dhu-ren... Laan-dhu-ren..."
      { f: 587.33, d: 0.75, type: 'sine' },
      { f: 554.37, d: 1.0, type: 'triangle' },
      { f: 493.88, d: 0.75, type: 'sine' },
      { f: 440.00, d: 1.0, type: 'triangle' },
      { f: 415.30, d: 0.75, type: 'sine' },
      { f: 369.99, d: 2.2, type: 'triangle' },

      // Phrase 3: "Naan.. Aa-laa-thi Aa-laa-thi..."
      { f: 554.37, d: 1.5, type: 'triangle', chord: 'C#m' },
      { f: 587.33, d: 0.5, type: 'sine' },
      { f: 554.37, d: 1.0, type: 'triangle' },
      { f: 493.88, d: 0.75, type: 'sine' },
      { f: 440.00, d: 1.25, type: 'triangle' },
      { f: 415.30, d: 0.75, type: 'sine' },
      { f: 369.99, d: 1.5, type: 'triangle' },

      // Phrase 4: "En U-su-ru-la Yen-dhu-ren..."
      { f: 369.99, d: 0.75, type: 'sine', chord: 'F#m' },
      { f: 415.30, d: 0.5, type: 'sine' },
      { f: 440.00, d: 0.75, type: 'triangle' },
      { f: 493.88, d: 0.75, type: 'sine' },
      { f: 554.37, d: 1.75, type: 'triangle' },
      { f: 493.88, d: 0.75, type: 'sine' },
      { f: 440.00, d: 1.0, type: 'triangle' },
      { f: 415.30, d: 0.75, type: 'sine' },
      { f: 369.99, d: 2.5, type: 'triangle' },
    ];

    const noteIdx = step % melodyNotes.length;
    const note = melodyNotes[noteIdx];

    // Main melody note (Acoustic guitar/flute timbre)
    this.playNote(note.f, now, note.d * tempo, note.type);
    // Sparkle harmonic overtone
    this.playNote(note.f * 1.5, now + 0.04, note.d * tempo * 0.6, 'sine');

    // Chords and acoustic bass accompaniment
    if (note.chord === 'F#m') {
      this.playNote(185.00, now, 2.4, 'sine'); // F#3
      this.playNote(277.18, now + 0.08, 1.8, 'triangle'); // C#4
      this.playNote(440.00, now + 0.16, 1.5, 'sine'); // A4
    } else if (note.chord === 'Bm') {
      this.playNote(246.94, now, 2.2, 'sine'); // B3
      this.playNote(293.66, now + 0.08, 1.8, 'triangle'); // D4
      this.playNote(369.99, now + 0.16, 1.5, 'sine'); // F#4
    } else if (note.chord === 'C#m') {
      this.playNote(277.18, now, 2.2, 'sine'); // C#4
      this.playNote(329.63, now + 0.08, 1.8, 'triangle'); // E4
      this.playNote(415.30, now + 0.16, 1.5, 'sine'); // G#4
    }

    const nextTimeMs = note.d * tempo * 1000;
    this.timer = window.setTimeout(() => {
      if (this.isPlaying) {
        this.playEnNeelothiSequence(step + 1);
      }
    }, nextTimeMs);
  }

  // 2. "En Nenjorathil" soulful acoustic romance melody
  // Notes in G minor / Bb major scale: G4, D5, C5, Bb4, A4, G4, F#4, G4...
  private playEnNenjorathilSequence(step: number) {
    if (!this.ctx || !this.isPlaying) return;

    const tempo = 0.36; // gentle romantic tempo
    const now = this.ctx.currentTime;

    const melodyNotes = [
      // En Nenjorathil melody contour
      { f: 392.00, d: 1.0, type: 'triangle' }, // G4
      { f: 440.00, d: 0.5, type: 'sine' },     // A4
      { f: 466.16, d: 1.5, type: 'triangle' }, // Bb4
      { f: 523.25, d: 1.0, type: 'sine' },     // C5
      { f: 587.33, d: 2.0, type: 'triangle' }, // D5
      { f: 523.25, d: 0.75, type: 'sine' },    // C5
      { f: 466.16, d: 0.75, type: 'triangle' },// Bb4
      { f: 440.00, d: 1.5, type: 'sine' },     // A4
      { f: 392.00, d: 2.5, type: 'triangle' }, // G4

      // Gentle phrasing
      { f: 349.23, d: 1.0, type: 'sine' },     // F4
      { f: 392.00, d: 1.0, type: 'triangle' }, // G4
      { f: 440.00, d: 1.5, type: 'sine' },     // A4
      { f: 466.16, d: 1.0, type: 'triangle' }, // Bb4
      { f: 440.00, d: 1.0, type: 'sine' },     // A4
      { f: 392.00, d: 2.5, type: 'triangle' }, // G4
    ];

    const noteIdx = step % melodyNotes.length;
    const note = melodyNotes[noteIdx];

    // Main melody (Warm classical guitar/flute acoustic timbre)
    this.playNote(note.f, now, note.d * tempo, note.type as OscillatorType);
    // Sparkle overtone
    this.playNote(note.f * 1.5, now + 0.05, note.d * tempo * 0.6, 'sine');

    // Deep warm romantic acoustic bass chord on beat
    if (noteIdx === 0 || noteIdx === 4 || noteIdx === 9) {
      this.playNote(196.00, now, 2.2, 'sine'); // G3 bass
      this.playNote(293.66, now + 0.1, 1.8, 'triangle'); // D4
    }

    const nextTimeMs = note.d * tempo * 1000;
    this.timer = window.setTimeout(() => {
      if (this.isPlaying) {
        this.playEnNenjorathilSequence(step + 1);
      }
    }, nextTimeMs);
  }

  // 3. Birthday Melody
  private playCelebrationSequence(step: number) {
    if (!this.ctx || !this.isPlaying) return;

    const tempo = 0.32;
    const now = this.ctx.currentTime;

    const hbdNotes = [
      { f: 261.63, d: 0.75 }, { f: 261.63, d: 0.25 }, { f: 293.66, d: 1 }, { f: 261.63, d: 1 }, { f: 349.23, d: 1 }, { f: 329.63, d: 2 },
      { f: 261.63, d: 0.75 }, { f: 261.63, d: 0.25 }, { f: 293.66, d: 1 }, { f: 261.63, d: 1 }, { f: 392.00, d: 1 }, { f: 349.23, d: 2 },
      { f: 261.63, d: 0.75 }, { f: 261.63, d: 0.25 }, { f: 523.25, d: 1 }, { f: 440.00, d: 1 }, { f: 349.23, d: 1 }, { f: 329.63, d: 1 }, { f: 293.66, d: 2 },
      { f: 466.16, d: 0.75 }, { f: 466.16, d: 0.25 }, { f: 440.00, d: 1 }, { f: 349.23, d: 1 }, { f: 392.00, d: 1 }, { f: 349.23, d: 2.5 },
    ];

    const noteIdx = step % hbdNotes.length;
    const note = hbdNotes[noteIdx];

    this.playNote(note.f, now, note.d * tempo, 'triangle');
    this.playNote(note.f * 2, now, note.d * tempo * 0.7, 'sine');

    if (noteIdx % 3 === 0) {
      this.playNote(note.f / 2, now, tempo * 1.5, 'sine');
    }

    const nextTimeMs = note.d * tempo * 1000;
    this.timer = window.setTimeout(() => {
      if (this.isPlaying) {
        this.playCelebrationSequence(step + 1);
      }
    }, nextTimeMs);
  }

  // 4. Galaxy synth sequence
  private playGalaxySequence(step: number) {
    if (!this.ctx || !this.isPlaying) return;

    const chords = [
      [220.0, 277.18, 329.63, 440.0],
      [174.61, 220.0, 261.63, 349.23],
      [196.0, 246.94, 293.66, 392.0],
      [164.81, 207.65, 246.94, 329.63],
    ];

    const chord = chords[step % chords.length];
    const now = this.ctx.currentTime;

    chord.forEach((freq, i) => {
      this.playNote(freq, now + i * 0.15, 2.8, 'sine');
      this.playNote(freq * 2, now + i * 0.15 + 0.3, 1.8, 'triangle');
    });

    this.timer = window.setTimeout(() => {
      if (this.isPlaying) {
        this.playGalaxySequence(step + 1);
      }
    }, 2800);
  }

  // 5. Acoustic guitar warmth
  private playAcousticSequence(step: number) {
    if (!this.ctx || !this.isPlaying) return;

    const arpeggio = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63];
    const now = this.ctx.currentTime;
    const note = arpeggio[step % arpeggio.length];

    this.playNote(note, now, 0.45, 'triangle');

    this.timer = window.setTimeout(() => {
      if (this.isPlaying) {
        this.playAcousticSequence(step + 1);
      }
    }, 380);
  }

  public async playTrack(trackId: string = 'en-neelothi', customAudioUrl?: string): Promise<boolean> {
    this.stopTrack();
    this.currentTrackId = trackId;

    // If a custom audio file or URL was provided, attempt HTML5 Audio playback first
    if (customAudioUrl && (trackId === 'custom-upload' || customAudioUrl.length > 10)) {
      try {
        if (!this.htmlAudio) {
          this.htmlAudio = new Audio();
        }
        this.htmlAudio.src = customAudioUrl;
        this.htmlAudio.volume = this.isMuted ? 0 : this.volume;
        this.htmlAudio.loop = true;

        const playPromise = this.htmlAudio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }

        this.isPlaying = true;
        this.notifyStatus('playing');
        return true;
      } catch (err) {
        console.warn('HTML5 Audio playback failed or blocked. Falling back to synthesized romance melody.', err);
        // Fall back gracefully to procedural audio without failing
      }
    }

    // Fall back to Web Audio procedural engine
    try {
      this.initContext();
      this.isPlaying = true;

      if (trackId === 'celebration-melody') {
        this.playCelebrationSequence(0);
      } else if (trackId === 'galaxy-ambient') {
        this.playGalaxySequence(0);
      } else if (trackId === 'gentle-acoustic') {
        this.playAcousticSequence(0);
      } else if (trackId === 'en-nenjorathil') {
        this.playEnNenjorathilSequence(0);
      } else {
        // Default: En Neelothi from Sirai (Justin Prabhakaran)
        this.playEnNeelothiSequence(0);
      }

      this.notifyStatus('playing');
      return true;
    } catch (err) {
      console.error('Audio playback error:', err);
      this.isPlaying = false;
      this.notifyStatus('error');
      return false;
    }
  }

  public stopTrack() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.htmlAudio) {
      this.htmlAudio.pause();
      this.htmlAudio.currentTime = 0;
    }
    this.notifyStatus('stopped');
  }

  public pauseTrack() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.htmlAudio) {
      this.htmlAudio.pause();
    }
    this.notifyStatus('paused');
  }

  public resumeTrack() {
    if (this.htmlAudio && this.htmlAudio.src) {
      this.htmlAudio.play().then(() => {
        this.isPlaying = true;
        this.notifyStatus('playing');
      }).catch(() => {
        this.playTrack(this.currentTrackId);
      });
    } else {
      this.playTrack(this.currentTrackId);
    }
  }

  // SOUND EFFECTS
  public playChime() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playNote(587.33, now, 0.4, 'sine');
    this.playNote(880.0, now + 0.1, 0.6, 'sine');
    this.playNote(1174.66, now + 0.2, 0.8, 'sine');
  }

  public playBlowCandle() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.5);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start();
    } catch {}
  }

  public playConfettiPop() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playNote(440, now, 0.08, 'square');
    this.playNote(880, now + 0.05, 0.25, 'triangle');
    this.playNote(1318.5, now + 0.12, 0.4, 'sine');
  }

  public playCelebrationCheer() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const fanfare = [523.25, 659.25, 783.99, 1046.5];
    fanfare.forEach((f, i) => {
      this.playNote(f, now + i * 0.12, 0.6, 'triangle');
      this.playNote(f * 1.5, now + i * 0.12 + 0.04, 0.4, 'sine');
    });
  }

  // OPTIONAL MICROPHONE BLOW DETECTION
  public async listenForBlowing(onBlowDetected: () => void): Promise<() => void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Microphone not supported on this device');
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 512;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let animationFrameId: number;
    let blowStreak = 0;

    const checkVolume = () => {
      analyser.getByteFrequencyData(dataArray);

      // Low frequency energy check for breath / wind blowing
      let lowFreqSum = 0;
      for (let i = 0; i < 20; i++) {
        lowFreqSum += dataArray[i];
      }
      const avgLow = lowFreqSum / 20;

      if (avgLow > 65) {
        blowStreak++;
        if (blowStreak >= 3) {
          onBlowDetected();
          stopListening();
          return;
        }
      } else {
        blowStreak = Math.max(0, blowStreak - 1);
      }

      animationFrameId = requestAnimationFrame(checkVolume);
    };

    animationFrameId = requestAnimationFrame(checkVolume);

    const stopListening = () => {
      cancelAnimationFrame(animationFrameId);
      stream.getTracks().forEach((track) => track.stop());
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    };

    return stopListening;
  }
}

export const audioEngine = new AudioEngine();

export const AVAILABLE_TRACKS = [
  {
    id: 'en-neelothi',
    name: 'En Neelothi - Sirai',
    artist: 'Justin Prabhakaran, Sooraj Santhosh, Chinmayi',
    description: 'Soulful, heartfelt Tamil melody from the movie Sirai, composed by Justin Prabhakaran',
    mood: 'Soulful Romance ❤️',
    isDefault: true,
  },
  {
    id: 'en-nenjorathil',
    name: 'En Nenjorathil',
    artist: 'Vijay Antony & Supriya Joshi (Pichaikkaran)',
    description: 'Soulful, emotional Tamil melody featuring acoustic warmth and heartfelt strings',
    mood: 'Emotional Romance ❤️',
  },
  {
    id: 'celebration-melody',
    name: 'Magical Birthday Chimes',
    artist: 'Birthday Bliss Ensemble',
    description: 'Enchanting glockenspiel & music box rendition of the birthday theme',
    mood: 'Celebratory & Joyful',
  },
  {
    id: 'galaxy-ambient',
    name: 'Starry Stardust Drift',
    artist: 'Cosmic Dreams',
    description: 'Dreamy synthesizer chords filled with cosmic wonder and love',
    mood: 'Magical & Ethereal',
  },
  {
    id: 'gentle-acoustic',
    name: 'Acoustic Heartstrings',
    artist: 'Acoustic Soul',
    description: 'Intimate, warm arpeggios full of affection and nostalgic warmth',
    mood: 'Sweet & Acoustic',
  },
  {
    id: 'custom-upload',
    name: 'Custom Uploaded Song',
    artist: 'Your Personal Audio File',
    description: 'Your authorized audio file (MP3 / WAV) uploaded by you',
    mood: 'Personalized ✨',
  },
];
