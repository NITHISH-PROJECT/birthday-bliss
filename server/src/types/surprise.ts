export type BirthdayTheme =
  | 'cake-celebration'
  | 'galaxy-birthday'
  | 'classic-birthday'
  | 'cute-pastel'
  | 'romantic-birthday'
  | 'friendship-celebration'
  | 'photo-memories'
  | 'minimal-elegant';

export type RelationshipType =
  | 'Friend'
  | 'Best Friend'
  | 'Partner'
  | 'Sibling'
  | 'Parent'
  | 'Other';

export interface PhotoMemory {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

export interface BirthdayDetails {
  date: number; // 1-31
  month: number; // 1-12
  year?: number;
  age?: number;
  showCountdown: boolean;
}

export interface SurpriseSettings {
  confetti: boolean;
  floatingHearts: boolean;
  balloons: boolean;
  sparkles: boolean;
  finalMessage: boolean;
  photoGallery: boolean;
  countdown: boolean;
  hasPasscode: boolean;
}

export interface MusicSettings {
  trackId: string;
  trackName: string;
  customAudioUrl?: string; // Custom uploaded audio or external stream URL
  enabled: boolean;
  volume: number; // 0 to 1
  autoPlayAllowed: boolean;
}

export interface BirthdayWish {
  personalWish: string;
  heartfeltMessage?: string;
  specialPromise?: string;
  creatorSign?: string;
}

export interface RelationshipQuestion {
  id: string;
  question: string;
  type: 'choice' | 'text' | 'textarea';
  options?: string[];
}

export interface RelationshipQuestionsConfig {
  enabled: boolean;
  title: string;
  questions: RelationshipQuestion[];
}

export interface RecipientAnswer {
  questionId: string;
  questionText: string;
  answerText: string;
  answeredAt: string;
}

export interface ProposalConfig {
  enabled?: boolean;
  question: string;
  options: {
    yesText: string;
    alreadyText: string;
    thinkText: string;
  };
  messages: {
    positiveResponse: string;
    thinkResponse: string;
  };
}

export interface VirtualHugConfig {
  enabled?: boolean;
  message?: string;
  style?: 'warm-trio' | 'heart-squeeze' | 'cozy-snuggle';
}

export interface SurpriseDocument {
  id?: string;
  uniqueId: string;
  recipientName: string;
  creatorName: string;
  relationship: RelationshipType;
  nickname?: string;
  birthdayDetails: BirthdayDetails;
  theme: BirthdayTheme;
  message: {
    mainMessage: string;
    subtitle?: string;
    personalNote?: string;
    finalWish?: string;
  };
  birthdayWish?: BirthdayWish;
  proposal?: ProposalConfig;
  virtualHug?: VirtualHugConfig;
  relationshipQuestions?: RelationshipQuestionsConfig;
  answers?: RecipientAnswer[];
  photos: PhotoMemory[];
  music: MusicSettings;
  settings: SurpriseSettings;
  passcodeHash?: string;
  editToken: string;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface PublicSurpriseView {
  uniqueId: string;
  recipientName: string;
  creatorName: string;
  relationship: RelationshipType;
  nickname?: string;
  birthdayDetails: BirthdayDetails;
  theme: BirthdayTheme;
  message?: {
    mainMessage: string;
    subtitle?: string;
    personalNote?: string;
    finalWish?: string;
  };
  birthdayWish?: BirthdayWish;
  proposal?: ProposalConfig;
  virtualHug?: VirtualHugConfig;
  relationshipQuestions?: RelationshipQuestionsConfig;
  photos?: PhotoMemory[];
  music: MusicSettings;
  settings: Omit<SurpriseSettings, 'hasPasscode'> & { hasPasscode: boolean };
  isLocked: boolean;
  createdAt: string;
}

