import type { BirthdayFormData, PublicSurpriseData, RecipientAnswer } from '../types/surprise';

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '5173'
    ? 'http://localhost:5000/api'
    : '/api');
const DRAFT_KEY = 'birthday_bliss_creator_draft_v1';

export interface CreateResponse {
  success: boolean;
  message: string;
  uniqueId: string;
  shareUrl: string;
  editToken: string;
}

export interface GetSurpriseResponse {
  success: boolean;
  surprise: PublicSurpriseData;
}

export interface VerifyPasscodeResponse {
  success: boolean;
  unlocked: boolean;
  surprise: PublicSurpriseData;
  message?: string;
}

export interface GetAnswersResponse {
  success: boolean;
  recipientName: string;
  answers: RecipientAnswer[];
  message?: string;
}

export const api = {
  async createSurprise(data: BirthdayFormData): Promise<CreateResponse> {
    const res = await fetch(`${API_BASE}/surprises`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const body = await res.json();
    if (!res.ok) {
      const msg = body.errors ? body.errors.map((e: any) => e.message).join(', ') : body.message;
      throw new Error(msg || 'Failed to create surprise');
    }

    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}

    return body;
  },

  async getSurprise(id: string): Promise<PublicSurpriseData> {
    const res = await fetch(`${API_BASE}/surprises/${id}`);
    const body: GetSurpriseResponse = await res.json();
    if (!res.ok) {
      throw new Error((body as any).message || 'Surprise not found');
    }
    return body.surprise;
  },

  async verifyPasscode(id: string, passcode: string): Promise<PublicSurpriseData> {
    const res = await fetch(`${API_BASE}/surprises/${id}/verify-passcode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ passcode }),
    });

    const body: VerifyPasscodeResponse = await res.json();
    if (!res.ok) {
      throw new Error(body.message || 'Incorrect passcode');
    }

    return body.surprise;
  },

  async submitAnswers(id: string, answers: RecipientAnswer[]): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/surprises/${id}/answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });

    const body = await res.json();
    if (!res.ok) {
      throw new Error(body.message || 'Failed to save answers');
    }
    return body;
  },

  async getAnswers(id: string, token: string): Promise<GetAnswersResponse> {
    const res = await fetch(`${API_BASE}/surprises/${id}/answers?token=${encodeURIComponent(token)}`);
    const body: GetAnswersResponse = await res.json();
    if (!res.ok) {
      throw new Error(body.message || 'Unauthorized or failed to fetch answers');
    }
    return body;
  },

  saveDraft(data: BirthdayFormData): void {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save draft to local storage', e);
    }
  },

  loadDraft(): BirthdayFormData | null {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Could not read draft from local storage', e);
    }
    return null;
  },

  clearDraft(): void {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
  },
};
