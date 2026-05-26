<p align="center"><img src="src/assets/mascot.svg" alt="Shill the Bear mascot" width="120" /></p>

# Shill the Bear 🐻

**Share the Bill** — a single-page expense splitting app.

Add your crew, log what you paid for, and see exactly who owes whom. No accounts, no backend, no fuss.

## Features

- **Session setup** — name your trip or event, add participants with one click.
- **Expense tracking** — log each expense with date, description, amount, who paid, and who's splitting it.
- **Flexible splits** — split evenly among any subset of participants; select all/none in one click.
- **Live summary** — see each person's balance (paid vs. spent) and the net amount they're owed or owe.
- **Settlement plans** — two strategies to settle up:
  - **Direct** — minimal transfers, each debtor pays creditors directly.
  - **Hub** — everyone pays one person who redistributes (simpler in practice).
- **Copy to clipboard** — one-click copy of the settlement summary to paste into chat or notes.
- **Persistent state** — all data saved to localStorage automatically; pick up where you left off.
- **Currency agnostic** — works with any currency.

## Tech Stack

- [Vite](https://vitejs.dev/) — fast dev server and build
- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) — utility-first styling
- [shadcn-style components](https://ui.shadcn.com/) — accessible UI primitives (Card, Button, Input, Checkbox, Select, Radio, Table, Badge)
- [lucide-react](https://lucide.dev/) — icon set

No backend. No database. No runtime dependencies beyond React.

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── App.tsx                    # Root component — owns state, lays out panels
├── main.tsx                   # Entry point
├── types.ts                   # Expense and Session interfaces
├── lib/
│   └── utils.ts               # cn() helper and fmt() number formatter
├── hooks/
│   └── useLocalStorage.ts     # useState wrapper synced to localStorage
├── components/
│   ├── SetupPanel.tsx         # Session label, participant management
│   ├── AddExpenseForm.tsx     # Form to add a new expense
│   ├── ExpensesTable.tsx      # Full expense breakdown table
│   ├── ResultsPanel.tsx       # Balances + settlement with Direct/Hub toggle
│   └── ui/                    # shadcn-style UI primitives
└── assets/
    ├── mascot.png
    └── mascot.svg
```

## How It Works

1. **Setup** — give the session a label and add participant names.
2. **Add expenses** — for each expense, pick who paid and who's splitting it. The app calculates each person's even share.
3. **View results** — the summary panel shows each person's balance and a settlement plan to zero everything out.

Expense shares are calculated with `Math.round(amount / splitAmong.length)`. Settlements use a greedy algorithm (Direct) or a single-hub approach (Hub).

## License

MIT
