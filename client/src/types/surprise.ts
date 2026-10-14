import { BirthdayThemeId } from './themes';

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
  date: number;
  month: number;
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
  customAudioUrl?: string;
  enabled: boolean;
  volume: number;
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
  answeredAt?: string;
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

export interface BirthdayFormData {
  recipientName: string;
  creatorName: string;
  relationship: RelationshipType;
  nickname?: string;
  birthdayDetails: BirthdayDetails;
  theme: BirthdayThemeId;
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
  photos: PhotoMemory[];
  music: MusicSettings;
  settings: SurpriseSettings;
  passcode?: string;
}

export interface PublicSurpriseData {
  uniqueId: string;
  recipientName: string;
  creatorName: string;
  relationship: RelationshipType;
  nickname?: string;
  birthdayDetails: BirthdayDetails;
  theme: BirthdayThemeId;
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
  settings: SurpriseSettings;
  isLocked: boolean;
  createdAt: string;
}
