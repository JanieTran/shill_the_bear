# Shill the Bear - Share the Bill

Single-page expense splitting app. Vite + React + TypeScript + Tailwind.
No backend, no database. All state lives in React useState.

State shape: Session { label, participants (string[]), expenses (Expense[]) }.
Calculations are pure functions in src/utils/calculations.ts.
Three panels: Setup → Expenses → Results.

Currency is not tracked — app works with any currency. Always display amounts in full (never compact/k format).

Always add descriptive comments to explain your code.
