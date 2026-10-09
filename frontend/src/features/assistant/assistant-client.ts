import type { AIResponse, ChatMessage, SendMessageInput } from "@/contracts/assistant";

/** Browser-facing contract. This file never imports server code or API keys. */
export interface AssistantClient {
  sendMessage(input: SendMessageInput): Promise<AIResponse>;
}

function mockResponseFor(message: string): ChatMessage {
  const normalized = message.toLowerCase();
  if (normalized.includes("subscription")) return { id: crypto.randomUUID(), role: "assistant", createdAt: new Date().toISOString(), content: "I found five recurring services in the current month.", blocks: [{ type: "metric", label: "Recurring spend", value: "EUR 218", change: "EUR 145 more than last month", direction: "up" }, { type: "table", headers: ["Merchant", "Monthly cost", "Status"], rows: [["Miro", "EUR 15.00", "Active"], ["Figma", "EUR 16.00", "Active"], ["Spotify", "EUR 11.99", "Active"], ["Medium", "EUR 5.00", "Active"]] }, { type: "recommendation", title: "Review Miro and Medium", detail: "Both have had limited activity recently. Pausing either would make an immediate difference.", impact: "Save up to EUR 20/month" }] };
  if (normalized.includes("budget")) return { id: crypto.randomUUID(), role: "assistant", createdAt: new Date().toISOString(), content: "Here is a balanced starting point based on your recent spending.", blocks: [{ type: "recommendation", title: "Build around stable essentials", detail: "Housing and utilities are predictable; reserve 18% of income for flexible categories and a savings transfer.", impact: "Target 17% savings rate" }, { type: "table", headers: ["Category", "Suggested cap", "Why"], rows: [["Food & dining", "EUR 600", "Matches your recent pace"], ["Transportation", "EUR 350", "Covers usual trips"], ["Entertainment", "EUR 200", "Keeps discretionary spend contained"]] }] };
  return { id: crypto.randomUUID(), role: "assistant", createdAt: new Date().toISOString(), content: "I reviewed your current financial snapshot. Your cash flow remains positive, and the clearest opportunity is to keep discretionary spending aligned with your plan.", blocks: [{ type: "metric", label: "Net cash flow", value: "EUR 4,550", change: "8.4% better than last month", direction: "up" }, { type: "recommendation", title: "Protect your savings momentum", detail: "Move your planned savings transfer soon after income arrives so everyday spending cannot absorb it.", impact: "Keeps EUR 1,547 on track" }] };
}

export const mockAssistantClient: AssistantClient = {
  async sendMessage({ message, conversationId }) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { conversationId, message: mockResponseFor(message) };
  },
};

/** HTTP-only adapter for the separately deployed FastAPI backend. */
export class FastApiAssistantClient implements AssistantClient {
  constructor(private readonly baseUrl = process.env.NEXT_PUBLIC_AI_API_URL ?? "http://localhost:8000") {}

  async sendMessage({ message, conversationId, history = [] }: SendMessageInput): Promise<AIResponse> {
    const response = await fetch(`${this.baseUrl}/v1/assistant/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation_id: conversationId, message, history }),
    });
    if (!response.ok) throw new Error(`FastAPI assistant request failed (${response.status})`);
    return response.json() as Promise<AIResponse>;
  }
}

export const assistantClient: AssistantClient = process.env.NEXT_PUBLIC_AI_PROVIDER === "fastapi"
    ? new FastApiAssistantClient()
    : mockAssistantClient;
