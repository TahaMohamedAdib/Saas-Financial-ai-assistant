export type AssistantBlock =
  | { type: "text"; content: string }
  | { type: "metric"; label: string; value: string; change: string; direction: "up" | "down" }
  | { type: "recommendation"; title: string; detail: string; impact: string }
  | { type: "warning"; title: string; detail: string }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface ChatMessage { id: string; role: "user" | "assistant"; content: string; createdAt: string; blocks?: AssistantBlock[]; }
export interface Conversation { id: string; title: string; updatedAt: string; messages: ChatMessage[]; }
export interface AIResponse { conversationId: string; message: ChatMessage; }
export interface SendMessageInput { conversationId: string; message: string; }
export interface AIInsight { title: string; description: string; type: "positive" | "warning" | "neutral"; }
export interface AIChart { title: string; data: Array<Record<string, string | number>>; keys: string[]; }
export interface SuggestedAction { id: string; label: string; description: string; }
