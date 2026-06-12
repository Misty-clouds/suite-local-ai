// Single source of truth for spend categories. Budgets and transactions MUST
// use the same list so a budget's "spent" can be matched against transactions
// of the same category (see BudgetsService.spendByCategory on the API).
export const CATEGORIES = [
  "Marketing",
  "Software",
  "Payroll",
  "Operations",
  "Travel",
  "Office",
  "Subscription",
  "Client payment",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
