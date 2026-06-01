/** A single expense entry within a session. */
export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
  /** Optional weights for weighted splitting. When absent/empty, split equally. */
  splitWeights?: Record<string, number>;
  date?: string;
}

/** Top-level session — one bill-splitting context. */
export interface Session {
  label: string;
  participants: string[];
  expenses: Expense[];
}
