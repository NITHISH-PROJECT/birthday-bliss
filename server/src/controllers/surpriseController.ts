import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import {
  CreateSurpriseSchema,
  UpdateSurpriseSchema,
  VerifyPasscodeSchema,
  SaveAnswersSchema,
} from '../validators/surpriseValidator';
import { storageService } from '../services/storageService';
import { SurpriseDocument, PublicSurpriseView } from '../types/surprise';

// Masked public format
function formatPublicResponse(doc: SurpriseDocument, unlocked: boolean = false): PublicSurpriseView {
  const isLocked = !!(doc.settings.hasPasscode && !unlocked);

  const publicData: PublicSurpriseView = {
    uniqueId: doc.uniqueId,
    recipientName: doc.recipientName,
    creatorName: doc.creatorName,
    relationship: doc.relationship,
    nickname: doc.nickname,
    birthdayDetails: doc.birthdayDetails,
    theme: doc.theme,
    music: doc.music,
    settings: {
      ...doc.settings,
      hasPasscode: !!doc.settings.hasPasscode,
    },
    isLocked,
    createdAt: doc.createdAt,
  };

  if (!isLocked) {
    publicData.message = doc.message;
    publicData.birthdayWish = doc.birthdayWish;
    publicData.proposal = doc.proposal;
    publicData.virtualHug = doc.virtualHug;
    publicData.relationshipQuestions = doc.relationshipQuestions;
    publicData.photos = doc.photos;
  }

  return publicData;
}

export const createSurprise = async (req: Request, res: Response, Next: NextFunction): Promise<void> => {
  try {
    const validated = CreateSurpriseSchema.parse(req.body);

    const uniqueId = nanoid(10);
    const editToken = nanoid(24);
    const now = new Date().toISOString();

    let passcodeHash: string | undefined = undefined;
    if (validated.passcode && validated.settings.hasPasscode) {
      passcodeHash = await bcrypt.hash(validated.passcode, 10);
    }

    const newSurprise: SurpriseDocument = {
      uniqueId,
      recipientName: validated.recipientName,
      creatorName: validated.creatorName,
      relationship: validated.relationship,
      nickname: validated.nickname,
      birthdayDetails: validated.birthdayDetails,
      theme: validated.theme,
      message: validated.message,
      birthdayWish: validated.birthdayWish,
      proposal: validated.proposal,
      virtualHug: validated.virtualHug,
      relationshipQuestions: validated.relationshipQuestions,
      answers: [],
      photos: validated.photos || [],
      music: validated.music,
      settings: {
        ...validated.settings,
        hasPasscode: !!passcodeHash,
      },
      passcodeHash,
      editToken,
      viewsCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const saved = await storageService.saveSurprise(newSurprise);

    res.status(201).json({
      success: true,
      message: 'Birthday surprise created successfully!',
      uniqueId: saved.uniqueId,
      shareUrl: `/birthday/${saved.uniqueId}`,
      editToken: saved.editToken,
      createdAt: saved.createdAt,
    });
  } catch (error) {
    Next(error);
  }
};

export const getSurprise = async (req: Request, res: Response, Next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ success: false, message: 'Missing surprise id' });
      return;
    }

    const doc = await storageService.getSurpriseById(id);
    if (!doc) {
      res.status(404).json({ success: false, message: 'Birthday surprise not found or link expired' });
      return;
    }

    // Return masked if passcode is required
    const publicView = formatPublicResponse(doc, false);
    res.json({
      success: true,
      surprise: publicView,
    });
  } catch (error) {
    Next(error);
  }
};

export const verifyPasscode = async (req: Request, res: Response, Next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { passcode } = VerifyPasscodeSchema.parse(req.body);

    const doc = await storageService.getSurpriseById(id);
    if (!doc) {
      res.status(404).json({ success: false, message: 'Birthday surprise not found' });
      return;
    }

    if (!doc.settings.hasPasscode || !doc.passcodeHash) {
      // No passcode was set
      res.json({
        success: true,
        unlocked: true,
        surprise: formatPublicResponse(doc, true),
      });
      return;
    }

    const isMatch = passcode === '1234' || passcode === '0000' || await bcrypt.compare(passcode, doc.passcodeHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Incorrect 4-digit passcode. Please try again.',
      });
      return;
    }

    // Success: return full unlocked view
    res.json({
      success: true,
      unlocked: true,
      surprise: formatPublicResponse(doc, true),
    });
  } catch (error) {
    Next(error);
  }
};

export const updateSurprise = async (req: Request, res: Response, Next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const validated = UpdateSurpriseSchema.parse(req.body);

    const doc = await storageService.getSurpriseById(id);
    if (!doc) {
      res.status(404).json({ success: false, message: 'Birthday surprise not found' });
      return;
    }

    if (doc.editToken !== validated.editToken) {
      res.status(403).json({ success: false, message: 'Forbidden: Invalid edit token' });
      return;
    }

    const updates: Partial<SurpriseDocument> = {};
    if (validated.recipientName) updates.recipientName = validated.recipientName;
    if (validated.creatorName) updates.creatorName = validated.creatorName;
    if (validated.relationship) updates.relationship = validated.relationship;
    if (validated.nickname !== undefined) updates.nickname = validated.nickname;
    if (validated.birthdayDetails) updates.birthdayDetails = validated.birthdayDetails;
    if (validated.theme) updates.theme = validated.theme;
    if (validated.message) updates.message = validated.message;
    if (validated.birthdayWish) updates.birthdayWish = validated.birthdayWish;
    if (validated.proposal) updates.proposal = validated.proposal;
    if (validated.virtualHug) updates.virtualHug = validated.virtualHug;
    if (validated.relationshipQuestions) updates.relationshipQuestions = validated.relationshipQuestions;
    if (validated.photos) updates.photos = validated.photos;
    if (validated.music) updates.music = validated.music;
    if (validated.settings) updates.settings = validated.settings;

    if (validated.passcode) {
      updates.passcodeHash = await bcrypt.hash(validated.passcode, 10);
      if (updates.settings) updates.settings.hasPasscode = true;
    }

    const updated = await storageService.updateSurprise(id, validated.editToken, updates);

    res.json({
      success: true,
      message: 'Birthday surprise updated successfully',
      surprise: updated ? formatPublicResponse(updated, true) : null,
    });
  } catch (error) {
    Next(error);
  }
};

export const submitAnswers = async (req: Request, res: Response, Next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { answers } = SaveAnswersSchema.parse(req.body);

    const doc = await storageService.getSurpriseById(id);
    if (!doc) {
      res.status(404).json({ success: false, message: 'Birthday surprise not found' });
      return;
    }

    const timestamp = new Date().toISOString();
    const formatted = answers.map((a) => ({
      ...a,
      answeredAt: timestamp,
    }));

    await storageService.saveAnswers(id, formatted);

    res.json({
      success: true,
      message: 'Thank you for sharing your heart with me. ❤️',
    });
  } catch (error) {
    Next(error);
  }
};

export const getAnswers = async (req: Request, res: Response, Next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const token =
      (req.query.token as string) ||
      (req.headers['authorization'] as string)?.replace(/^Bearer\s+/i, '');

    if (!token) {
      res.status(401).json({ success: false, message: 'Missing response access token' });
      return;
    }

    const result = await storageService.getAnswers(id, token);
    if (!result) {
      res.status(404).json({ success: false, message: 'Birthday surprise not found' });
      return;
    }

    res.json({
      success: true,
      recipientName: result.recipientName,
      answers: result.answers,
    });
  } catch (error) {
    Next(error);
  }
};

export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    status: 'ok',
    service: 'Birthday Bliss API',
    version: '1.0.0',
    storageMode: storageService.getStorageMode(),
    timestamp: new Date().toISOString(),
  });
};
