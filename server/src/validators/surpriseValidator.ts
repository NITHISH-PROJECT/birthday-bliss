import { z } from 'zod';

export const ThemeEnum = z.enum([
  'cake-celebration',
  'galaxy-birthday',
  'classic-birthday',
  'cute-pastel',
  'romantic-birthday',
  'friendship-celebration',
  'photo-memories',
  'minimal-elegant',
]);

export const RelationshipEnum = z.enum([
  'Friend',
  'Best Friend',
  'Partner',
  'Sibling',
  'Parent',
  'Other',
]);

export const PhotoMemorySchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  url: z.string().min(1, 'Photo URL or data string is required'),
  caption: z.string().max(200).optional().default(''),
  order: z.number().int().nonnegative().default(0),
});

export const BirthdayDetailsSchema = z.object({
  date: z.number().int().min(1).max(31),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(1900).max(2100).optional(),
  age: z.number().int().min(1).max(150).optional(),
  showCountdown: z.boolean().default(true),
});

export const MusicSettingsSchema = z.object({
  trackId: z.string().default('en-neelothi'),
  trackName: z.string().default('En Neelothi - Sirai (Justin Prabhakaran, Sooraj Santhosh, Chinmayi)'),
  customAudioUrl: z.string().optional(),
  enabled: z.boolean().default(true),
  volume: z.number().min(0).max(1).default(0.8),
  autoPlayAllowed: z.boolean().default(true),
});

export const SurpriseSettingsSchema = z.object({
  confetti: z.boolean().default(true),
  floatingHearts: z.boolean().default(true),
  balloons: z.boolean().default(true),
  sparkles: z.boolean().default(true),
  finalMessage: z.boolean().default(true),
  photoGallery: z.boolean().default(true),
  countdown: z.boolean().default(true),
  hasPasscode: z.boolean().default(false),
});

export const BirthdayWishSchema = z.object({
  personalWish: z.string().trim().max(3000).default(''),
  heartfeltMessage: z.string().trim().max(2000).optional().default(''),
  specialPromise: z.string().trim().max(1000).optional().default(''),
  creatorSign: z.string().trim().max(100).optional().default(''),
});

export const RelationshipQuestionSchema = z.object({
  id: z.string(),
  question: z.string().min(1),
  type: z.enum(['choice', 'text', 'textarea']).default('choice'),
  options: z.array(z.string()).optional(),
});

export const RelationshipQuestionsConfigSchema = z.object({
  enabled: z.boolean().default(true),
  title: z.string().default("Let's Talk About Us ❤️"),
  questions: z.array(RelationshipQuestionSchema).default([]),
});

export const ProposalConfigSchema = z.object({
  enabled: z.boolean().default(true),
  question: z.string().default('Will you be mine and create more beautiful memories together? 💍'),
  options: z
    .object({
      yesText: z.string().default('Yes, of course! ❤️'),
      alreadyText: z.string().default('You already have my heart! 🥹'),
      thinkText: z.string().default('Let me think about it 💗'),
    })
    .default({
      yesText: 'Yes, of course! ❤️',
      alreadyText: 'You already have my heart! 🥹',
      thinkText: 'Let me think about it 💗',
    }),
  messages: z
    .object({
      positiveResponse: z.string().default('You just made this moment unforgettable! ❤️'),
      thinkResponse: z.string().default('Take your time. Your feelings matter. 💗'),
    })
    .default({
      positiveResponse: 'You just made this moment unforgettable! ❤️',
      thinkResponse: 'Take your time. Your feelings matter. 💗',
    }),
});

export const VirtualHugConfigSchema = z.object({
  enabled: z.boolean().default(true),
  message: z.string().default('Sending you the biggest virtual hug! 🫂'),
  style: z.enum(['warm-trio', 'heart-squeeze', 'cozy-snuggle']).default('warm-trio'),
});

export const CreateSurpriseSchema = z.object({
  recipientName: z.string().trim().min(1, "Recipient's name is required").max(60),
  creatorName: z.string().trim().min(1, "Your name is required").max(60),
  relationship: RelationshipEnum.default('Friend'),
  nickname: z.string().trim().max(40).optional(),
  birthdayDetails: BirthdayDetailsSchema,
  theme: ThemeEnum.default('cake-celebration'),
  message: z.object({
    mainMessage: z.string().trim().min(1, 'Birthday message is required').max(3000),
    subtitle: z.string().trim().max(120).optional(),
    personalNote: z.string().trim().max(1000).optional(),
    finalWish: z.string().trim().max(500).optional(),
  }),
  birthdayWish: BirthdayWishSchema.optional(),
  proposal: ProposalConfigSchema.optional(),
  virtualHug: VirtualHugConfigSchema.optional(),
  relationshipQuestions: RelationshipQuestionsConfigSchema.optional(),
  photos: z.array(PhotoMemorySchema).max(20).default([]),
  music: MusicSettingsSchema.default({
    trackId: 'en-neelothi',
    trackName: 'En Neelothi - Sirai (Justin Prabhakaran, Sooraj Santhosh, Chinmayi)',
    enabled: true,
    volume: 0.8,
    autoPlayAllowed: true,
  }),
  settings: SurpriseSettingsSchema.default({
    confetti: true,
    floatingHearts: true,
    balloons: true,
    sparkles: true,
    finalMessage: true,
    photoGallery: true,
    countdown: true,
    hasPasscode: false,
  }),
  passcode: z
    .string()
    .regex(/^\d{4}$/, 'Passcode must be exactly 4 digits')
    .optional(),
});

export const UpdateSurpriseSchema = CreateSurpriseSchema.partial().extend({
  editToken: z.string().min(1, 'Edit token is required to update a surprise'),
});

export const VerifyPasscodeSchema = z.object({
  passcode: z.string().regex(/^\d{4}$/, 'Passcode must be exactly 4 digits'),
});

export const SaveAnswersSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      questionText: z.string(),
      answerText: z.string().max(1000),
    })
  ),
});
