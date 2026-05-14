import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fmt } from '@/lib/utils';
import { ClipboardCopy } from 'lucide-react';
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

export default function ResultsPanel(_props: ResultsPanelProps) {
  // Placeholder data — will be replaced by real calculations later
  const balances: BalanceRow[] = [
    { name: 'Trâm', paid: 6205000, spent: 1979000, net: 4227000 },
    { name: 'Mai', paid: 1315000, spent: 1983000, net: -668000 },
    { name: 'Phương', paid: 0, spent: 1928000, net: -1928000 },
    { name: 'Loan', paid: 309000, spent: 1939000, net: -1630000 },
  ];

  // Minimal set of transfers that zeroes out every person's net balance
  const settlements: Settlement[] = [
    { from: 'Phương', to: 'Trâm', amount: 1928463 },
    { from: 'Loan', to: 'Trâm', amount: 1630000 },
    { from: 'Mai', to: 'Trâm', amount: 668463 },
  ];

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

        {/* Settlement section: minimal transfers to zero out all balances */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium text-muted-foreground">Settlement</h3>
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
        {/* Each row is a single transfer — from debtor to creditor */}
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
      </CardContent>
    </Card>
  );
}
