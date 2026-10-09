export function formatCurrency(value: number, currency = "EUR", compact = false) {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency, notation: compact ? "compact" : "standard", maximumFractionDigits: compact ? 1 : 2 }).format(value);
}
export function formatDate(value: string) { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)); }
export function relativeTime(value: string) {
  // Fixed demo reference keeps the static frontend deterministic; live data can supply timestamps from an API later.
  const demoReferenceTime = new Date("2026-10-08T14:00:00").getTime();
  const minutes = Math.max(1, Math.round((demoReferenceTime - new Date(value).getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return hours < 24 ? `${hours}h ago` : `${Math.round(hours / 24)}d ago`;
}
