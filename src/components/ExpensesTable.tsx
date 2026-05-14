import type { Expense } from '../types';
import { Card, CardContent } from '@/components/ui/card';
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

/** Format a number with thousand separators (e.g. 1,928,463). */
function formatFull(amount: number): string {
  return amount.toLocaleString('vi-VN');
}

/** Convert YYYY-MM-DD → DD/MM for compact display. */
function formatDate(dateStr: string): string {
  const [m, d] = dateStr.split('-').slice(1);
  return `${d}/${m}`;
}

/** Calculate one person's share of an expense (even split). */
function personShare(e: Expense, person: string): number {
  if (!e.splitAmong.includes(person)) return 0;
  return Math.round(e.amount / e.splitAmong.length);
}

export default function ExpensesTable({ expenses, participants, onDelete }: ExpensesTableProps) {
  const columnTotals = participants.map((p) =>
    expenses.reduce((sum, e) => sum + personShare(e, p), 0)
  );
  const grandTotal = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <Card className="border-border">
      <CardContent className="pt-5 pb-5">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Expenses{' '}
          <span className="text-sm font-normal text-muted-foreground">({expenses.length})</span>
        </h2>

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
                <TableHead className="whitespace-nowrap">Paid by</TableHead>
                {participants.map((p) => (
                  <TableHead key={p} className="text-right whitespace-nowrap">
                    {p}
                  </TableHead>
                ))}
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {formatDate(e.date ?? '')}
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap">
                    {e.description}
                  </TableCell>
                  <TableCell className="text-right font-semibold whitespace-nowrap">
                    {formatFull(e.amount)}
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {e.paidBy}
                  </TableCell>
                  {participants.map((p) => {
                    const share = personShare(e, p);
                    return (
                      <TableCell key={p} className="text-right text-muted-foreground whitespace-nowrap">
                        {share === 0 ? '—' : formatFull(share)}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center">
                    <button
                      onClick={() => onDelete(e.id)}
                      className="text-muted-foreground hover:text-destructive transition text-xs"
                    >
                      [×]
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {/* Footer totals row */}
              <TableRow className="font-semibold">
                <td className="py-2" colSpan={2} />
                <td className="py-2 text-right">{formatFull(grandTotal)}</td>
                <td className="py-2">Total</td>
                {participants.map((p, i) => (
                  <td key={p} className="py-2 text-right whitespace-nowrap">
                    {formatFull(columnTotals[i])}
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
