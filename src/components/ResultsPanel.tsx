import { useState } from 'react';
import type { Expense } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fmt, personShareAmount } from '@/lib/utils';
import { ClipboardCopy } from 'lucide-react';
import {
  RadioGroup,
  RadioRoot,
} from '@/components/ui/radio';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ResultsPanelProps {
  participants: string[];
  expenses: Expense[];
}

// BalanceRow: per-person snapshot of who paid what and who consumed what
interface BalanceRow {
  name: string;
  paid: number;   // total amount this person paid into the pool
  spent: number;  // total share of expenses assigned to this person
  net: number;    // positive = owed money, negative = owes money
}

// Settlement: a single transfer from one person to another to settle up
interface Settlement {
  from: string;   // person who owes
  to: string;     // person who is owed
  amount: number; // how much to transfer
}

/** Compute each person's balance: what they paid minus what they consumed. */
function computeBalances(participants: string[], expenses: Expense[]): BalanceRow[] {
  return participants.map((name) => {
    // Sum of all expenses this person paid for
    const paid = expenses
      .filter((e) => e.paidBy === name)
      .reduce((sum, e) => sum + e.amount, 0);

    // Sum of this person's share across all expenses they're split among
    // Uses weighted split when splitWeights is defined, otherwise equal split
    const spent = expenses
      .filter((e) => e.splitAmong.includes(name))
      .reduce(
        (sum, e) =>
          sum + personShareAmount(e.amount, name, e.splitAmong, e.splitWeights),
        0,
      );

    return { name, paid, spent, net: paid - spent };
  });
}

/** Compute minimal settlements using a greedy approach: debtors pay creditors until all nets are zero. */
function computeSettlements(balances: BalanceRow[]): Settlement[] {
  // Separate into creditors (net > 0, owed money) and debtors (net < 0, owe money)
  const creditors = balances
    .filter((b) => b.net > 0)
    .map((b) => ({ name: b.name, remaining: b.net }));
  const debtors = balances
    .filter((b) => b.net < 0)
    .map((b) => ({ name: b.name, remaining: -b.net })); // store as positive amount owed

  const settlements: Settlement[] = [];

  // Greedily match debtors to creditors
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const transfer = Math.min(debtors[i].remaining, creditors[j].remaining);
    if (transfer > 0) {
      settlements.push({ from: debtors[i].name, to: creditors[j].name, amount: transfer });
    }
    debtors[i].remaining -= transfer;
    creditors[j].remaining -= transfer;
    if (debtors[i].remaining === 0) i++;
    if (creditors[j].remaining === 0) j++;
  }

  return settlements;
}

/** Compute settlements using a hub: all debtors pay the top creditor, who then pays other creditors. */
function computeHubSettlements(balances: BalanceRow[]): Settlement[] {
  const creditors = balances
    .filter((b) => b.net > 0)
    .sort((a, b) => b.net - a.net); // highest net first — this is the hub
  const debtors = balances
    .filter((b) => b.net < 0)
    .map((b) => ({ name: b.name, remaining: -b.net }));

  if (creditors.length === 0 || debtors.length === 0) return [];

  const hub = creditors[0];
  const otherCreditors = creditors.slice(1);
  const settlements: Settlement[] = [];

  // Phase 1: all debtors pay the hub
  for (const debtor of debtors) {
    if (debtor.remaining > 0) {
      settlements.push({ from: debtor.name, to: hub.name, amount: debtor.remaining });
    }
  }

  // Phase 2: hub pays out to other creditors
  for (const creditor of otherCreditors) {
    if (creditor.net > 0) {
      settlements.push({ from: hub.name, to: creditor.name, amount: creditor.net });
    }
  }

  return settlements;
}

type SettlementMode = 'direct' | 'hub';

export default function ResultsPanel({ participants, expenses }: ResultsPanelProps) {
  const [mode, setMode] = useState<SettlementMode>('direct');

  const balances = computeBalances(participants, expenses);
  const settlements = mode === 'direct'
    ? computeSettlements(balances)
    : computeHubSettlements(balances);

  // Copy all settlement lines to clipboard so users can paste into chat / notes
  const copySummary = () => {
    const lines = settlements.map(
      (s) => `${s.from} → ${s.to}: ${fmt(s.amount)}`
    );
    navigator.clipboard.writeText(lines.join('\n')).catch(() => {
      // clipboard may not be available in some environments
    });
  };

  return (
    <Card className="border-border">
      <CardContent className="py-2 h-fit">
        <h2 className="text-lg font-semibold text-foreground mb-4">Summary</h2>

        {/* Balances table: shows each person's contribution vs. consumption */}
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Balances</h3>
        {balances.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6 mb-6">
            No balances to show yet. Add participants and expenses first.
          </p>
        )}
        {balances.length > 0 && (
          <Table className="mb-6">
            <TableHeader>
              <TableRow>
                <TableHead />
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">Spent</TableHead>
                <TableHead className="text-right">Net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balances.map((b) => (
                <TableRow key={b.name}>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {fmt(b.paid)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {fmt(b.spent)}
                  </TableCell>
                  {/* Green for net positive (owed money), red for net negative (owes money) */}
                  <TableCell
                    className={`text-right font-medium ${
                      b.net >= 0 ? 'text-green-600' : 'text-destructive'
                    }`}
                  >
                    {b.net >= 0 ? '+' : ''}
                    {fmt(b.net)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Settlement section: minimal transfers to zero out all balances */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-medium text-muted-foreground">Settlement</h3>
              {/* Let user pick the settlement strategy */}
              <RadioGroup
                value={mode}
                onValueChange={(v) => setMode(v as SettlementMode)}
                className="flex items-center gap-3"
              >
                <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer">
                  <RadioRoot value="direct" className="data-checked:border-4" />
                  Direct
                </label>
                <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer">
                  <RadioRoot value="hub" className="data-checked:border-4" />
                  Hub
                </label>
              </RadioGroup>
            </div>
            {/* Copy button uses ghost variant so it stays subtle next to the heading */}
            <Button
              variant="ghost"
              size="sm"
              onClick={copySummary}
              className="h-fit gap-1.5 py-2 px-4 text-muted-foreground hover:text-foreground"
            >
              <ClipboardCopy className="h-4 w-4" />
              Copy
            </Button>
          </div>
          {/* Short description of the selected strategy */}
          <p className="text-xs text-muted-foreground">
            {mode === 'direct'
              ? 'Each debtor pays creditors directly for minimal total transfers.'
              : 'All debtors pay one person who then redistributes to other creditors.'}
          </p>
        </div>
        {settlements.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            No settlements needed yet.
          </p>
        )}
        {/* Each row is a single transfer — from debtor to creditor */}
        {settlements.length > 0 && (
          <div className="rounded-lg border border-border divide-y divide-border">
            {settlements.map((s, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="text-muted-foreground">
                  {s.from} → {s.to}
                </span>
                <span className="font-medium text-foreground">
                  {fmt(s.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
