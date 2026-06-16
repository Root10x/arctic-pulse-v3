// lib/stores/draftStore.ts
import { create } from "zustand";

type Draft = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  suggestedCategories: string[];
  suggestedTags: string[];
  suggestedImages: string[];
  siteId: string;
  siteName: string;
  siteUrl: string;
  featuredImage?: string;
  backlink?: string;
  status: "draft" | "pending_review" | "needs_changes" | "approved" | "published" | "scheduled";
};

type DraftStore = {
  drafts: Draft[];
  addDraft: (draft: Draft) => void;
};

export const useDraftStore = create<DraftStore>((set) => ({
  drafts: [],
  addDraft: (draft) => set((state) => ({ drafts: [draft, ...state.drafts] })),
}));
