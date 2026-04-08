"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";
import type { ChatMessage } from "@/lib/services/landingPageApi";
import { useGetPageQuery } from "@/lib/services/pagesApi";

// ─── SessionStorage persistence ──────────────────────────────

const STORAGE_KEY = "ai-generator-v1";

interface PersistedState {
  phase: GeneratorPhase;
  conversation: Message[];
  pageId: string | null;
  pageContent: Record<string, any> | null;
  activeGenerationId: string | null;
}

function loadFromStorage(): Partial<GeneratorState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const p: PersistedState = JSON.parse(raw);
    return {
      phase: p.phase ?? "prompt",
      conversation: Array.isArray(p.conversation) ? p.conversation : [],
      pageId: p.pageId ?? null,
      pageContent: p.pageContent ?? null,
      activeGenerationId: p.activeGenerationId ?? null,
    };
  } catch {
    return {};
  }
}

function saveToStorage(state: GeneratorState): void {
  if (typeof window === "undefined") return;
  try {
    const toSave: PersistedState = {
      phase: state.phase,
      conversation: state.conversation,
      pageId: state.pageId,
      pageContent: state.pageContent,
      activeGenerationId: state.activeGenerationId,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // Storage full or unavailable — ignore silently
  }
}

// ─── Types ────────────────────────────────────────────────────

export type PreviewMode = "desktop" | "mobile";
export type GeneratorPhase = "prompt" | "generating" | "workspace";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface GeneratorState {
  phase: GeneratorPhase;
  activeGenerationId: string | null;
  pageId: string | null;
  pageContent: Record<string, any> | null;
  conversation: Message[];
  isGenerating: boolean;
  isRefining: boolean;
  previewMode: PreviewMode;
  /** True while we are loading an existing page from DB */
  isLoadingPage: boolean;
}

// ─── Actions ─────────────────────────────────────────────────

type Action =
  | { type: "START_GENERATING"; generationId: string }
  | {
      type: "GENERATION_COMPLETE";
      pageId: string;
      content: Record<string, any>;
    }
  | { type: "GENERATION_FAILED" }
  | { type: "ADD_USER_MESSAGE"; content: string }
  | { type: "ADD_ASSISTANT_MESSAGE"; content: string }
  | { type: "SET_REFINING"; value: boolean }
  | { type: "SET_PAGE_CONTENT"; content: Record<string, any> }
  | { type: "SET_PREVIEW_MODE"; mode: PreviewMode }
  | {
      type: "LOAD_EXISTING_PAGE";
      pageId: string;
      content: Record<string, any>;
      chatHistory: ChatMessage[];
    }
  | { type: "SET_LOADING_PAGE"; value: boolean }
  | { type: "RESET" };

// ─── Reducer ──────────────────────────────────────────────────

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function chatHistoryToMessages(history: ChatMessage[]): Message[] {
  return history.map((m) => ({
    id: makeId(),
    role: m.role,
    content: m.content,
    timestamp: Date.now(),
  }));
}

function reducer(state: GeneratorState, action: Action): GeneratorState {
  switch (action.type) {
    case "START_GENERATING":
      return {
        ...state,
        phase: "generating",
        activeGenerationId: action.generationId,
        isGenerating: true,
        conversation: [
          ...state.conversation,
          {
            id: makeId(),
            role: "system",
            content: "⏳ جاري توليد الصفحة...",
            timestamp: Date.now(),
          },
        ],
      };

    case "GENERATION_COMPLETE": {
      const systemMsg = state.conversation.find(
        (m) => m.role === "system" && m.content.startsWith("⏳"),
      );
      const filtered = state.conversation.filter((m) => m !== systemMsg);
      return {
        ...state,
        phase: "workspace",
        pageId: action.pageId,
        pageContent: action.content,
        isGenerating: false,
        conversation: [
          ...filtered,
          {
            id: makeId(),
            role: "assistant",
            content:
              "✅ تم! صفحة الهبوط جاهزة. يمكنك الآن تعديل أي شيء بالكتابة هنا.",
            timestamp: Date.now(),
          },
        ],
      };
    }

    case "GENERATION_FAILED": {
      const filtered = state.conversation.filter(
        (m) => !(m.role === "system" && m.content.startsWith("⏳")),
      );
      return {
        ...state,
        phase: "prompt",
        isGenerating: false,
        activeGenerationId: null,
        conversation: [
          ...filtered,
          {
            id: makeId(),
            role: "system",
            content: "❌ فشل التوليد. حاول مرة أخرى.",
            timestamp: Date.now(),
          },
        ],
      };
    }

    case "ADD_USER_MESSAGE":
      return {
        ...state,
        conversation: [
          ...state.conversation,
          {
            id: makeId(),
            role: "user",
            content: action.content,
            timestamp: Date.now(),
          },
        ],
      };

    case "ADD_ASSISTANT_MESSAGE":
      return {
        ...state,
        conversation: [
          ...state.conversation,
          {
            id: makeId(),
            role: "assistant",
            content: action.content,
            timestamp: Date.now(),
          },
        ],
      };

    case "SET_REFINING":
      return { ...state, isRefining: action.value };

    case "SET_PAGE_CONTENT":
      return { ...state, pageContent: action.content };

    case "SET_PREVIEW_MODE":
      return { ...state, previewMode: action.mode };

    case "LOAD_EXISTING_PAGE":
      return {
        ...state,
        phase: "workspace",
        pageId: action.pageId,
        pageContent: action.content,
        isGenerating: false,
        isRefining: false,
        isLoadingPage: false,
        activeGenerationId: null,
        conversation: chatHistoryToMessages(action.chatHistory),
      };

    case "SET_LOADING_PAGE":
      return { ...state, isLoadingPage: action.value };

    case "RESET":
      if (typeof window !== "undefined") {
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
      }
      return initialState;

    default:
      return state;
  }
}

// ─── Initial State ────────────────────────────────────────────

const initialState: GeneratorState = {
  phase: "prompt",
  activeGenerationId: null,
  pageId: null,
  pageContent: null,
  conversation: [],
  isGenerating: false,
  isRefining: false,
  previewMode: "desktop",
  isLoadingPage: false,
};

// ─── Context ──────────────────────────────────────────────────

interface GeneratorContextValue {
  state: GeneratorState;
  dispatch: React.Dispatch<Action>;
  /** Ref to the iframe for postMessage communication */
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

const GeneratorContext = createContext<GeneratorContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────

interface GeneratorProviderProps {
  children: React.ReactNode;
  /** When set, the workspace loads this existing page from DB */
  loadPageId?: string;
  /** When true, starts a blank workspace — wipes any sessionStorage state */
  fresh?: boolean;
}

export function GeneratorProvider({
  children,
  loadPageId,
  fresh,
}: GeneratorProviderProps) {
  // Determine initial state:
  //   loadPageId → blank + isLoadingPage (will hydrate from DB)
  //   fresh      → clear sessionStorage + blank state
  //   otherwise  → restore from sessionStorage
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    if (loadPageId) return { ...initialState, isLoadingPage: true };
    if (fresh) {
      // Wipe any previously saved session so old page doesn't leak in
      if (typeof window !== "undefined") {
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
      }
      return { ...initialState };
    }
    return { ...initialState, ...loadFromStorage() };
  });
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Fetch page (content + chatHistory arrive in a single request)
  const { data: pageData, isError: pageError } = useGetPageQuery(
    loadPageId ?? "",
    { skip: !loadPageId },
  );

  // Hydrate state once the page arrives (or fail gracefully on error)
  useEffect(() => {
    if (!loadPageId) return;

    if (pageError) {
      // Unblock UI even if the fetch failed — show empty workspace
      dispatch({ type: "SET_LOADING_PAGE", value: false });
      return;
    }

    if (!pageData) return; // still in flight

    const chatHistory = Array.isArray(pageData.chatHistory)
      ? (pageData.chatHistory as ChatMessage[])
      : [];

    dispatch({
      type: "LOAD_EXISTING_PAGE",
      pageId: pageData.id,
      content: pageData.content ?? {},
      chatHistory,
    });
  }, [loadPageId, pageData, pageError]);

  // Persist relevant state on every change (skip when loading/creating specific page)
  const shouldPersist = !loadPageId && !fresh;
  useEffect(() => {
    if (!shouldPersist) return;
    saveToStorage(state);
  }, [state, shouldPersist]);

  return (
    <GeneratorContext.Provider value={{ state, dispatch, iframeRef }}>
      {children}
    </GeneratorContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────

export function useGenerator() {
  const ctx = useContext(GeneratorContext);
  if (!ctx)
    throw new Error("useGenerator must be used inside GeneratorProvider");
  return ctx;
}

/**
 * All user/assistant conversation messages for sending as history to the API.
 * Returns full history (not capped) so AI has complete context of previous decisions.
 */
export function useConversationHistory(state: GeneratorState) {
  return state.conversation
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
}
