export type TransactionStatus = "completed" | "pending" | "failed";
export type TransactionKind = "income" | "expense";

export interface Account { id: string; name: string; institution: string; type: "Checking" | "Savings" | "Business" | "Credit" | "Investment"; currency: string; balance: number; lastSynced: string; ending: string; color: string; }
export interface Transaction { id: string; merchant: string; category: string; accountId: string; account: string; date: string; amount: number; kind: TransactionKind; status: TransactionStatus; reference: string; notes?: string; initials: string; color: string; }
export interface CashFlowPoint { label: string; income: number; expenses: number; balance: number; }
export interface ExpenseCategory { name: string; value: number; color: string; }
export interface Budget { id: string; category: string; spent: number; limit: number; color: string; icon: string; }
export interface AppNotification { id: string; title: string; body: string; category: "budget" | "security" | "report" | "insight"; createdAt: string; read: boolean; }
export interface Insight { id: string; title: string; description: string; trend: "positive" | "warning" | "neutral"; icon: "sparkle" | "arrow" | "wallet"; }
