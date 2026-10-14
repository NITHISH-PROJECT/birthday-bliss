import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { SurpriseDocument, RecipientAnswer } from '../types/surprise';
import { SurpriseModel } from '../models/surpriseModel';

const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', 'data')
  : path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'surprises.json');

// Ensure local fallback data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('Could not create local data directory:', err);
}

export class StorageService {
  private isMongoConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  private readLocalData(): SurpriseDocument[] {
    try {
      if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
        return [];
      }
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error reading local surprises file:', err);
      return [];
    }
  }

  private writeLocalData(data: SurpriseDocument[]): void {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing local surprises file:', err);
    }
  }

  async saveSurprise(surprise: SurpriseDocument): Promise<SurpriseDocument> {
    if (this.isMongoConnected()) {
      const doc = new SurpriseModel(surprise);
      await doc.save();
      return doc.toObject() as unknown as SurpriseDocument;
    } else {
      const all = this.readLocalData();
      const existingIdx = all.findIndex((s) => s.uniqueId === surprise.uniqueId);
      if (existingIdx >= 0) {
        all[existingIdx] = surprise;
      } else {
        all.push(surprise);
      }
      this.writeLocalData(all);
      return surprise;
    }
  }

  async getSurpriseById(uniqueId: string): Promise<SurpriseDocument | null> {
    if (this.isMongoConnected()) {
      const doc = await SurpriseModel.findOne({ uniqueId });
      if (!doc) return null;
      // Increment view count asynchronously
      SurpriseModel.updateOne({ uniqueId }, { $inc: { viewsCount: 1 } }).exec();
      return doc.toObject() as unknown as SurpriseDocument;
    } else {
      const all = this.readLocalData();
      const found = all.find((s) => s.uniqueId === uniqueId);
      if (found) {
        found.viewsCount = (found.viewsCount || 0) + 1;
        this.writeLocalData(all);
        return { ...found };
      }
      return null;
    }
  }

  async updateSurprise(
    uniqueId: string,
    editToken: string,
    updates: Partial<SurpriseDocument>
  ): Promise<SurpriseDocument | null> {
    if (this.isMongoConnected()) {
      const doc = await SurpriseModel.findOne({ uniqueId });
      if (!doc) return null;
      if (doc.editToken !== editToken) {
        throw new Error('Unauthorized: Invalid edit token');
      }

      Object.assign(doc, updates);
      await doc.save();
      return doc.toObject() as unknown as SurpriseDocument;
    } else {
      const all = this.readLocalData();
      const idx = all.findIndex((s) => s.uniqueId === uniqueId);
      if (idx === -1) return null;

      if (all[idx].editToken !== editToken) {
        throw new Error('Unauthorized: Invalid edit token');
      }

      all[idx] = {
        ...all[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.writeLocalData(all);
      return all[idx];
    }
  }

  async saveAnswers(uniqueId: string, answers: RecipientAnswer[]): Promise<boolean> {
    if (this.isMongoConnected()) {
      const res = await SurpriseModel.updateOne(
        { uniqueId },
        { $set: { answers, updatedAt: new Date() } }
      );
      return res.modifiedCount > 0;
    } else {
      const all = this.readLocalData();
      const idx = all.findIndex((s) => s.uniqueId === uniqueId);
      if (idx === -1) return false;

      all[idx].answers = answers;
      all[idx].updatedAt = new Date().toISOString();
      this.writeLocalData(all);
      return true;
    }
  }

  async getAnswers(
    uniqueId: string,
    token: string
  ): Promise<{ recipientName: string; answers: RecipientAnswer[] } | null> {
    const doc = await this.getSurpriseById(uniqueId);
    if (!doc) return null;

    if (doc.editToken !== token) {
      throw new Error('Unauthorized: Invalid response access token');
    }

    return {
      recipientName: doc.recipientName,
      answers: doc.answers || [],
    };
  }

  getStorageMode(): string {
    return this.isMongoConnected() ? 'MongoDB (Connected)' : 'Local Persistent Storage (Active)';
  }
}

export const storageService = new StorageService();
