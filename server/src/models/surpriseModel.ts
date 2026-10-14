import mongoose, { Schema, Document } from 'mongoose';
import { SurpriseDocument } from '../types/surprise';

export interface IMongooseSurprise extends Omit<SurpriseDocument, 'id'>, Document {}

const PhotoMemorySchema = new Schema(
  {
    id: { type: String, required: true },
    url: { type: String, required: true },
    caption: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const BirthdayDetailsSchema = new Schema(
  {
    date: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number },
    age: { type: Number },
    showCountdown: { type: Boolean, default: true },
  },
  { _id: false }
);

const MusicSettingsSchema = new Schema(
  {
    trackId: { type: String, default: 'en-neelothi' },
    trackName: { type: String, default: 'En Neelothi - Sirai (Justin Prabhakaran, Sooraj Santhosh, Chinmayi)' },
    customAudioUrl: { type: String },
    enabled: { type: Boolean, default: true },
    volume: { type: Number, default: 0.8 },
    autoPlayAllowed: { type: Boolean, default: true },
  },
  { _id: false }
);

const SurpriseSettingsSchema = new Schema(
  {
    confetti: { type: Boolean, default: true },
    floatingHearts: { type: Boolean, default: true },
    balloons: { type: Boolean, default: true },
    sparkles: { type: Boolean, default: true },
    finalMessage: { type: Boolean, default: true },
    photoGallery: { type: Boolean, default: true },
    countdown: { type: Boolean, default: true },
    hasPasscode: { type: Boolean, default: false },
  },
  { _id: false }
);

const BirthdayWishSchema = new Schema(
  {
    personalWish: { type: String, default: '' },
    heartfeltMessage: { type: String, default: '' },
    specialPromise: { type: String, default: '' },
    creatorSign: { type: String, default: '' },
  },
  { _id: false }
);

const RelationshipQuestionSchema = new Schema(
  {
    id: { type: String, required: true },
    question: { type: String, required: true },
    type: { type: String, default: 'choice' },
    options: { type: [String], default: [] },
  },
  { _id: false }
);

const RelationshipQuestionsConfigSchema = new Schema(
  {
    enabled: { type: Boolean, default: true },
    title: { type: String, default: "Let's Talk About Us ❤️" },
    questions: { type: [RelationshipQuestionSchema], default: [] },
  },
  { _id: false }
);

const ProposalOptionsSchema = new Schema(
  {
    yesText: { type: String, default: 'Yes, of course! ❤️' },
    alreadyText: { type: String, default: 'You already have my heart! 🥹' },
    thinkText: { type: String, default: 'Let me think about it 💗' },
  },
  { _id: false }
);

const ProposalMessagesSchema = new Schema(
  {
    positiveResponse: { type: String, default: 'You just made this moment unforgettable! ❤️' },
    thinkResponse: { type: String, default: 'Take your time. Your feelings matter. 💗' },
  },
  { _id: false }
);

const ProposalConfigSchema = new Schema(
  {
    enabled: { type: Boolean, default: true },
    question: {
      type: String,
      default: 'Will you be mine and create more beautiful memories together? 💍',
    },
    options: { type: ProposalOptionsSchema, default: () => ({}) },
    messages: { type: ProposalMessagesSchema, default: () => ({}) },
  },
  { _id: false }
);

const VirtualHugConfigSchema = new Schema(
  {
    enabled: { type: Boolean, default: true },
    message: { type: String, default: 'Sending you the biggest virtual hug! 🫂' },
    style: { type: String, default: 'warm-trio' },
  },
  { _id: false }
);

const RecipientAnswerSchema = new Schema(
  {
    questionId: { type: String, required: true },
    questionText: { type: String, required: true },
    answerText: { type: String, required: true },
    answeredAt: { type: String, required: true },
  },
  { _id: false }
);

const SurpriseSchema = new Schema<IMongooseSurprise>(
  {
    uniqueId: { type: String, required: true, unique: true, index: true },
    recipientName: { type: String, required: true, trim: true },
    creatorName: { type: String, required: true, trim: true },
    relationship: {
      type: String,
      required: true,
      enum: ['Friend', 'Best Friend', 'Partner', 'Sibling', 'Parent', 'Other'],
      default: 'Friend',
    },
    nickname: { type: String, trim: true },
    birthdayDetails: { type: BirthdayDetailsSchema, required: true },
    theme: {
      type: String,
      required: true,
      enum: [
        'cake-celebration',
        'galaxy-birthday',
        'classic-birthday',
        'cute-pastel',
        'romantic-birthday',
        'friendship-celebration',
        'photo-memories',
        'minimal-elegant',
      ],
      default: 'cake-celebration',
    },
    message: {
      mainMessage: { type: String, required: true },
      subtitle: { type: String },
      personalNote: { type: String },
      finalWish: { type: String },
    },
    birthdayWish: { type: BirthdayWishSchema },
    proposal: { type: ProposalConfigSchema },
    virtualHug: { type: VirtualHugConfigSchema },
    relationshipQuestions: { type: RelationshipQuestionsConfigSchema },
    answers: { type: [RecipientAnswerSchema], default: [] },
    photos: { type: [PhotoMemorySchema], default: [] },
    music: { type: MusicSettingsSchema, required: true },
    settings: { type: SurpriseSettingsSchema, required: true },
    passcodeHash: { type: String },
    editToken: { type: String, required: true },
    viewsCount: { type: Number, default: 0 },
    expiresAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const SurpriseModel = mongoose.model<IMongooseSurprise>('Surprise', SurpriseSchema);
