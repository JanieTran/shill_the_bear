import type { Expense } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { fmt, personShareAmount } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ExpensesTableProps {
  expenses: Expense[];
  participants: string[];
  onDelete: (id: string) => void;
}

/**
 * Calculate one person's share of an expense.
 * Uses weighted split when splitWeights is defined, otherwise equal split.
 */
function personShare(e: Expense, person: string): number {
  if (!e.splitAmong.includes(person)) return 0;
  return personShareAmount(e.amount, person, e.splitAmong, e.splitWeights);
}

export default function ExpensesTable({ expenses, participants, onDelete }: ExpensesTableProps) {
  // Pre-compute each participant's total share across all expenses (for footer row)
  const columnTotals = participants.map((p) =>
    expenses.reduce((sum, e) => sum + personShare(e, p), 0)
  );
  // Grand total of all expenses (raw amounts, not split)
  const grandTotal = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <Card className="border-border">
      <CardContent className="py-2">
        {/* Header with expense count badge */}
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Expense Breakdown{' '}
          <span className="text-sm font-normal text-muted-foreground">({expenses.length})</span>
        </h2>

        {/* Empty state: shown when no expenses have been added yet */}
        {expenses.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No expenses yet. Add one above!
          </p>
        )}

        {expenses.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Date</TableHead>
                <TableHead className="whitespace-nowrap">Description</TableHead>
                <TableHead className="text-right whitespace-nowrap">Amount</TableHead>
                <TableHead className="whitespace-nowrap">Paid By</TableHead>
                {/* One column per participant showing their share of each expense */}
                {participants.map((p) => (
                  <TableHead key={p} className="text-right whitespace-nowrap">
                    {p}
                  </TableHead>
                ))}
                {/* Delete button column (no header label needed) */}
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {e.date}
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap">
                    {e.description}
                  </TableCell>
                  <TableCell className="text-right font-semibold whitespace-nowrap">
                    {fmt(e.amount)}
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {e.paidBy}
                  </TableCell>
                  {/* Show each person's share; dash if they're not part of this expense */}
                  {participants.map((p) => {
                    const share = personShare(e, p);
                    return (
                      <TableCell key={p} className="text-right text-muted-foreground whitespace-nowrap">
                        {share === 0 ? '—' : fmt(share)}
                      </TableCell>
                    );
                  })}
                  {/* Delete button with browser confirmation to prevent accidental removal */}
                  <TableCell className="text-center">
                    <button
                      onClick={() => {
                        if (confirm('Delete this expense?')) {
                          onDelete(e.id);
                        }
                      }}
                      className="text-muted-foreground hover:text-destructive transition pt-0.5"
                      aria-label="Delete expense"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {/* Footer totals row: grand total + per-person share totals */}
              <TableRow className="font-semibold">
                <td className="py-2" colSpan={2} />
                <td className="py-2 text-right pr-2 text-green-600">{fmt(grandTotal)}</td>
                <td className="py-2"></td>
                {participants.map((p, i) => (
                  <td key={p} className="py-2 pr-2 text-right whitespace-nowrap">
                    {fmt(columnTotals[i])}
                  </td>
                ))}
                <td />
              </TableRow>
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
