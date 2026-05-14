import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a number with comma thousand separators (e.g. 2,000,000). */
export function fmt(amount: number): string {
  return amount.toLocaleString('en-US');
}
