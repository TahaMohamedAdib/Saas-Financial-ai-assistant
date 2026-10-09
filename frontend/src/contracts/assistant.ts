/**
 * Contrat de données partagé entre le navigateur et le backend de l’assistant.
 * Chaque couche reste indépendante des détails internes de l’autre.
 */
export type AssistantBlock =
  | { type: "text"; content: string }
  | { type: "metric"; label: string; value: string; change: string; direction: "up" | "down" }
  | { type: "recommendation"; title: string; detail: string; impact: string }
  | { type: "warning"; title: string; detail: string }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface ClientTokenQuota {
  /** Compteur transmis par FastAPI pour le client ou l'espace de travail courant. */
  clientId: string;
  limitTokens: number;
  usedTokens: number;
  remainingTokens: number;
}

export interface TokenUsage {
  /** Les tokens d’entrée Groq incluent les instructions système et l’historique retenu. */
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  source: "groq" | "guardrail";
  /** Optionnel pour rester compatible avec les réponses d'une ancienne API FastAPI. */
  quota?: ClientTokenQuota;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  blocks?: AssistantBlock[];
  usage?: TokenUsage;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface AIResponse {
  conversationId: string;
  message: ChatMessage;
}

export interface SendMessageInput {
  /** Aujourd'hui c'est l'identifiant du workspace démo ; l'authentification le remplacera plus tard. */
  clientId: string;
  conversationId: string;
  message: string;
  history?: Pick<ChatMessage, "role" | "content">[];
}

export interface AIInsight { title: string; description: string; type: "positive" | "warning" | "neutral"; }
export interface AIChart { title: string; data: Array<Record<string, string | number>>; keys: string[]; }
export interface SuggestedAction { id: string; label: string; description: string; }
