import { useState, useEffect } from 'react';
import type { Expense } from '../types';

const STORAGE_KEY = 'shill-the-bear-session';

/** Shape of the data persisted to localStorage. */
interface StoredSession {
  label: string;
  participants: string[];
  expenses: Expense[];
}

/** Load the session from localStorage, returning null if nothing stored or on parse error. */
function loadSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSession;
  } catch {
    // Corrupted data — start fresh rather than crashing.
    return null;
  }
}

/** Persist the current session state to localStorage. */
function saveSession(session: StoredSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage full or unavailable — silently ignore so the app still works.
  }
}

/** Remove the entire session from localStorage. */
export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable — ignore.
  }
}

/**
 * useState-like hook that syncs with localStorage.
 * Returns [value, setValue] — same contract as useState.
 */
export function useLocalStorage<T extends StoredSession[keyof StoredSession]>(
  key: keyof StoredSession,
  initialValue: T,
) {
  const [value, setValue] = useState<T>(() => {
    const stored = loadSession();
    if (stored && key in stored) {
      return stored[key] as T;
    }
    return initialValue;
  });

  // Persist whenever this specific piece of state changes.
  useEffect(() => {
    const stored = loadSession() ?? { label: '', participants: [], expenses: [] };
    (stored as unknown as Record<string, unknown>)[key] = value;
    saveSession(stored);
  }, [key, value]);

  return [value, setValue] as const;
}
