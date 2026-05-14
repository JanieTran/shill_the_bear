import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fmt } from '@/lib/utils';
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

interface BalanceRow {
  name: string;
  paid: number;
  spent: number;
  net: number;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export default function ResultsPanel(_props: ResultsPanelProps) {
  // Placeholder data — will be replaced by real calculations later
  const balances: BalanceRow[] = [
    { name: 'Trâm', paid: 6205000, spent: 1979000, net: 4227000 },
    { name: 'Mai', paid: 1315000, spent: 1983000, net: -668000 },
    { name: 'Phương', paid: 0, spent: 1928000, net: -1928000 },
    { name: 'Loan', paid: 309000, spent: 1939000, net: -1630000 },
  ];

  const settlements: Settlement[] = [
    { from: 'Phương', to: 'Trâm', amount: 1928463 },
    { from: 'Loan', to: 'Trâm', amount: 1630000 },
    { from: 'Mai', to: 'Trâm', amount: 668463 },
  ];

  const copySummary = () => {
    const lines = settlements.map(
      (s) => `${s.from} → ${s.to}: ${fmt(s.amount)}`
    );
    navigator.clipboard.writeText(lines.join('\n')).catch(() => {
      // clipboard may not be available
    });
  };

  return (
    <Card className="border-border">
      <CardContent className="pt-5 pb-5 h-fit">
        {/* Balances: how much each person paid vs. consumed */}
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Balances</h3>
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

        {/* Settlements: minimal transfers to zero out balances */}
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Settlement</h3>
        <div className="rounded-lg border border-border divide-y divide-border mb-4">
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

        <Button variant="outline" onClick={copySummary} className="w-full">
          📋 Copy summary
        </Button>
      </CardContent>
    </Card>
  );
}
