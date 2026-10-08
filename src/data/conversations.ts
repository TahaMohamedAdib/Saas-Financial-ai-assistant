import type { Conversation, SuggestedAction } from "@/types/assistant";

export const suggestedPrompts: SuggestedAction[] = [
  { id: "spend", label: "Analyze my spending", description: "Understand where money went this month" },
  { id: "reduce", label: "Find savings opportunities", description: "Spot recurring expenses worth reviewing" },
  { id: "compare", label: "Compare month to month", description: "See the changes that matter" },
  { id: "budget", label: "Create a monthly budget", description: "Build a plan from recent activity" },
];

export const initialConversations: Conversation[] = [
  {
    id: "conv-october-review",
    title: "October spending review",
    updatedAt: "2026-10-08T10:10:00",
    messages: [
      { id: "msg-1", role: "user", content: "Analyze my spending this month", createdAt: "2026-10-08T10:08:00" },
      {
        id: "msg-2", role: "assistant", content: "Your spending is healthy overall, with one area worth keeping an eye on.", createdAt: "2026-10-08T10:08:05",
        blocks: [
          { type: "metric", label: "October expenses", value: "€4,550", change: "12% higher than September", direction: "up" },
          { type: "warning", title: "Dining is trending above plan", detail: "Food & dining is €92 higher than your usual pace. At this rate, you will use 85% of the monthly budget." },
          { type: "recommendation", title: "Set a weekly dining target", detail: "A €45 weekly cap through month-end would keep this category below €600.", impact: "Could preserve €88" },
        ],
      },
    ],
  },
  { id: "conv-september-budget", title: "September budget plan", updatedAt: "2026-10-02T13:42:00", messages: [] },
  { id: "conv-subscriptions", title: "Recurring subscriptions", updatedAt: "2026-09-29T09:20:00", messages: [] },
];
