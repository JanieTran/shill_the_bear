import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a number with comma thousand separators (e.g. 2,000,000). */
export function fmt(amount: number): string {
  return amount.toLocaleString('en-US');
}

/**
 * Calculate one person's share of an expense.
 * When splitWeights is absent or empty, splits evenly among all in splitAmong.
 * When splitWeights is provided, splits proportionally by each person's weight.
 *
 * @param amount - total expense amount
 * @param person - the participant whose share to calculate
 * @param splitAmong - list of participants sharing this expense
 * @param splitWeights - optional weight for each participant (default weight is 0)
 *
 * Example: amount=100, person="B", splitAmong=["A","B","C"], splitWeights={A:1,B:2,C:1}
 *   totalWeight=4, B's weight=2 → share = round(100 * 2/4) = 50
 */
export function personShareAmount(
  amount: number,
  person: string,
  splitAmong: string[],
  splitWeights?: Record<string, number>,
): number {
  if (splitAmong.length === 0) return 0;

  // Equal split when no weights provided
  if (!splitWeights || Object.keys(splitWeights).length === 0) {
    return Math.round(amount / splitAmong.length);
  }

  // Weighted split: each person's share is proportional to their weight
  const totalWeight = splitAmong.reduce(
    (sum, name) => sum + (splitWeights[name] ?? 0),
    0,
  );
  if (totalWeight === 0) return 0;

  const weight = splitWeights[person] ?? 0;
  return Math.round(amount * (weight / totalWeight));
}
