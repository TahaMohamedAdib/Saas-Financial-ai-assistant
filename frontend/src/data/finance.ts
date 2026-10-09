import type { Account, AppNotification, Budget, CashFlowPoint, ExpenseCategory, Insight, Transaction } from "@/types/finance";

export const accounts: Account[] = [
  { id: "acc-checking", name: "Main Checking", institution: "Northstar Bank", type: "Checking", currency: "EUR", balance: 8420.67, lastSynced: "2 min ago", ending: "•• 4821", color: "#635BFF" },
  { id: "acc-savings", name: "High Yield Savings", institution: "Northstar Bank", type: "Savings", currency: "EUR", balance: 24480.2, lastSynced: "2 min ago", ending: "•• 1307", color: "#12B76A" },
  { id: "acc-business", name: "Studio Business", institution: "Mercantile", type: "Business", currency: "EUR", balance: 12650.55, lastSynced: "18 min ago", ending: "•• 9412", color: "#7c3aed" },
  { id: "acc-credit", name: "Travel Card", institution: "Atlas Credit", type: "Credit", currency: "EUR", balance: -1684.3, lastSynced: "1 hour ago", ending: "•• 9074", color: "#d97706" },
  { id: "acc-invest", name: "Balanced Portfolio", institution: "Summit Invest", type: "Investment", currency: "EUR", balance: 38841.88, lastSynced: "Yesterday", ending: "•• 3639", color: "#0891b2" },
];

export const transactions: Transaction[] = [
  { id: "trx-101", merchant: "Miro", category: "Subscriptions", accountId: "acc-business", account: "Studio Business", date: "2026-10-08", amount: 15, kind: "expense", status: "completed", reference: "MIR-938120", notes: "Product collaboration annual plan", initials: "M", color: "#F79009" },
  { id: "trx-102", merchant: "Aster & Co.", category: "Income", accountId: "acc-business", account: "Studio Business", date: "2026-10-07", amount: 3800, kind: "income", status: "completed", reference: "INV-2026-104", notes: "Brand strategy retainer", initials: "A", color: "#635BFF" },
  { id: "trx-103", merchant: "Whole Foods Market", category: "Food", accountId: "acc-checking", account: "Main Checking", date: "2026-10-07", amount: 74.68, kind: "expense", status: "completed", reference: "WFM-684215", initials: "WF", color: "#12B76A" },
  { id: "trx-104", merchant: "Eurostar", category: "Transportation", accountId: "acc-credit", account: "Travel Card", date: "2026-10-06", amount: 184.5, kind: "expense", status: "pending", reference: "EST-778890", notes: "Paris business trip", initials: "E", color: "#172033" },
  { id: "trx-105", merchant: "Spotify", category: "Subscriptions", accountId: "acc-checking", account: "Main Checking", date: "2026-10-05", amount: 11.99, kind: "expense", status: "completed", reference: "SPT-493124", initials: "S", color: "#1db954" },
  { id: "trx-106", merchant: "Blue Bottle Coffee", category: "Food", accountId: "acc-checking", account: "Main Checking", date: "2026-10-04", amount: 5.7, kind: "expense", status: "completed", reference: "BBC-291502", initials: "BB", color: "#4f2c1d" },
  { id: "trx-107", merchant: "Brightline Design", category: "Income", accountId: "acc-business", account: "Studio Business", date: "2026-10-03", amount: 1250, kind: "income", status: "completed", reference: "INV-2026-099", initials: "B", color: "#7c3aed" },
  { id: "trx-108", merchant: "Urban Gym", category: "Health", accountId: "acc-checking", account: "Main Checking", date: "2026-10-02", amount: 59, kind: "expense", status: "completed", reference: "UGM-682002", initials: "UG", color: "#e11d48" },
  { id: "trx-109", merchant: "Figma", category: "Subscriptions", accountId: "acc-business", account: "Studio Business", date: "2026-10-01", amount: 16, kind: "expense", status: "completed", reference: "FIG-120939", initials: "F", color: "#a259ff" },
  { id: "trx-110", merchant: "City Utilities", category: "Utilities", accountId: "acc-checking", account: "Main Checking", date: "2026-09-30", amount: 128.4, kind: "expense", status: "completed", reference: "CTL-383205", initials: "CU", color: "#0891b2" },
  { id: "trx-111", merchant: "ASOS", category: "Shopping", accountId: "acc-credit", account: "Travel Card", date: "2026-09-29", amount: 96.25, kind: "expense", status: "failed", reference: "ASS-918527", notes: "Awaiting merchant confirmation", initials: "A", color: "#111827" },
  { id: "trx-112", merchant: "Medium", category: "Subscriptions", accountId: "acc-checking", account: "Main Checking", date: "2026-09-28", amount: 5, kind: "expense", status: "completed", reference: "MED-821425", initials: "M", color: "#172033" },
];

export const cashFlowData: CashFlowPoint[] = [
  { label: "Apr", income: 6900, expenses: 3740, balance: 3160 },
  { label: "May", income: 7900, expenses: 4210, balance: 3690 },
  { label: "Jun", income: 7350, expenses: 3960, balance: 3390 },
  { label: "Jul", income: 8200, expenses: 4780, balance: 3420 },
  { label: "Aug", income: 7700, expenses: 4170, balance: 3530 },
  { label: "Sep", income: 8550, expenses: 4310, balance: 4240 },
  { label: "Oct", income: 9100, expenses: 4550, balance: 4550 },
];

export const expenseDistribution: ExpenseCategory[] = [
  { name: "Housing", value: 1420, color: "#635BFF" },
  { name: "Food & dining", value: 732, color: "#A5ADBA" },
  { name: "Shopping", value: 541, color: "#8B5CF6" },
  { name: "Transport", value: 425, color: "#F79009" },
  { name: "Subscriptions", value: 218, color: "#12B76A" },
  { name: "Other", value: 316, color: "#D0D5DD" },
];

export const budgets: Budget[] = [
  { id: "budget-food", category: "Food & dining", spent: 420, limit: 600, color: "#635BFF", icon: "Utensils" },
  { id: "budget-transit", category: "Transportation", spent: 240, limit: 350, color: "#F79009", icon: "Car" },
  { id: "budget-entertainment", category: "Entertainment", spent: 170, limit: 200, color: "#a78bfa", icon: "Clapperboard" },
  { id: "budget-shopping", category: "Shopping", spent: 350, limit: 300, color: "#e76e66", icon: "ShoppingBag" },
];

export const insights: Insight[] = [
  { id: "insight-1", title: "Savings rate is trending up", description: "You saved 17% of your income this month, up from 12% in September.", trend: "positive", icon: "arrow" },
  { id: "insight-2", title: "Dining is running higher", description: "Food & dining is 18% above your monthly average. You have €180 left in budget.", trend: "warning", icon: "wallet" },
  { id: "insight-3", title: "Small subscriptions add up", description: "You spent €145 more on recurring subscriptions than last month.", trend: "neutral", icon: "sparkle" },
];

export const notifications: AppNotification[] = [
  { id: "note-1", title: "Entertainment budget is nearly full", body: "You have used 85% of your €200 monthly budget.", category: "budget", createdAt: "2026-10-08T10:13:00", read: false },
  { id: "note-2", title: "Large transaction detected", body: "A €1,250 payment from Brightline Design was added to your Studio Business account.", category: "security", createdAt: "2026-10-07T16:35:00", read: false },
  { id: "note-3", title: "September report is ready", body: "Your financial summary is available to review or export.", category: "report", createdAt: "2026-10-06T09:20:00", read: true },
  { id: "note-4", title: "You saved more last month", body: "Your September savings rate improved by 14% compared with August.", category: "insight", createdAt: "2026-10-03T13:00:00", read: true },
];
