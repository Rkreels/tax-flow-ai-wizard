// Utility to manage tax returns in localStorage with simple helpers
// Keeps a single source of truth so lists and the wizard stay in sync

import { UserRole } from "@/contexts/AuthContext";

export type ReturnStatus =
  | "draft"
  | "in_progress"
  | "submitted"
  | "approved"
  | "needs_info"
  | "resubmitted";

export interface ReturnComment {
  id: string;
  authorId: string;
  authorRole: UserRole;
  message: string;
  createdAt: string;
  requestAdditionalInfo?: boolean;
}

export interface ReturnAttachmentMeta {
  id: string;
  name: string;
  type: string;
  size?: string;
  dataUrl?: string; // optional preview/inline persistence
  uploadedAt: string;
  uploadedBy: string; // user id
}

export interface StoredTaxReturn {
  id: string;
  name: string;
  year: string;
  status: ReturnStatus;
  type: string;
  lastUpdated: string;
  ownerUserId: string;
  ownerName?: string;
  assignedProId?: string;
  assignedProName?: string;
  // Forms (kept as any to avoid circular imports)
  personalInfo: any | null;
  income: any | null;
  deductions: any | null;
  // Collaboration
  comments?: ReturnComment[];
  requestedDocuments?: string[]; // simple list of requested doc descriptions
  attachments?: ReturnAttachmentMeta[]; // user provided docs
}

const KEY_PREFIX = "taxReturn_";

const readAll = (): StoredTaxReturn[] => {
  const items: StoredTaxReturn[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(KEY_PREFIX)) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const obj = JSON.parse(raw) as StoredTaxReturn;
        items.push(obj);
      } catch {
        // ignore broken entries
      }
    }
  }
  // Sort by lastUpdated desc
  return items.sort((a, b) => (b.lastUpdated > a.lastUpdated ? 1 : -1));
};

const write = (ret: StoredTaxReturn) => {
  localStorage.setItem(`${KEY_PREFIX}${ret.id}`, JSON.stringify(ret));
};

export const returnsStore = {
  getAll: (): StoredTaxReturn[] => readAll(),
  getById: (id: string): StoredTaxReturn | null => {
    const raw = localStorage.getItem(`${KEY_PREFIX}${id}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredTaxReturn;
    } catch {
      return null;
    }
  },
  save: (ret: StoredTaxReturn) => write({ ...ret, lastUpdated: new Date().toISOString() }),
  delete: (id: string) => localStorage.removeItem(`${KEY_PREFIX}${id}`),
  updateStatus: (id: string, status: ReturnStatus) => {
    const existing = returnsStore.getById(id);
    if (!existing) return null;
    const updated: StoredTaxReturn = { ...existing, status, lastUpdated: new Date().toISOString() };
    write(updated);
    return updated;
    },
  addComment: (id: string, comment: Omit<ReturnComment, "id" | "createdAt"> & { createdAt?: string }) => {
    const existing = returnsStore.getById(id);
    if (!existing) return null;
    const newComment: ReturnComment = {
      id: `c_${Date.now()}`,
      createdAt: comment.createdAt || new Date().toISOString(),
      authorId: comment.authorId,
      authorRole: comment.authorRole,
      message: comment.message,
      requestAdditionalInfo: comment.requestAdditionalInfo,
    };
    const comments = [...(existing.comments || []), newComment];
    const updated: StoredTaxReturn = { ...existing, comments, lastUpdated: new Date().toISOString() };
    // If pro requested info, flip status
    if (comment.requestAdditionalInfo) {
      updated.status = "needs_info";
    }
    write(updated);
    return updated;
  },
  addRequestedDocuments: (id: string, requests: string[]) => {
    const existing = returnsStore.getById(id);
    if (!existing) return null;
    const updated: StoredTaxReturn = {
      ...existing,
      requestedDocuments: Array.from(new Set([...(existing.requestedDocuments || []), ...requests])),
      lastUpdated: new Date().toISOString(),
    };
    write(updated);
    return updated;
  },
  addAttachments: (id: string, attachments: ReturnAttachmentMeta[]) => {
    const existing = returnsStore.getById(id);
    if (!existing) return null;
    const updated: StoredTaxReturn = {
      ...existing,
      attachments: [...(existing.attachments || []), ...attachments],
      lastUpdated: new Date().toISOString(),
    };
    write(updated);
    return updated;
  },
};
