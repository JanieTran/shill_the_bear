import { useState } from 'react';
import type { Expense } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddExpenseFormProps {
  participants: string[];
  onAdd: (expense: Expense) => void;
}

/** Form for adding a new expense — collects date, description, amount, payer, and split recipients. */
export default function AddExpenseForm({ participants, onAdd }: AddExpenseFormProps) {
  const today = new Date().toISOString().slice(0, 10);

  // --- Form state ---
  const [date, setDate] = useState(today);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(participants[0] ?? '');
  const [splitAmong, setSplitAmong] = useState<string[]>([...participants]);

  /** Clear description, amount, and split selection while keeping date and payer. */
  const resetForm = () => {
    setDesc('');
    setAmount('');
    setPaidBy(participants[0] ?? '');
    setSplitAmong([...participants]);
  };

  /** Validate fields and emit the new expense, then reset the form. */
  const handleSubmit = () => {
    if (!desc.trim() || !amount || !paidBy || splitAmong.length === 0) return;
    onAdd({
      id: crypto.randomUUID(),
      description: desc.trim(),
      amount: Number(amount),
      paidBy,
      splitAmong: [...splitAmong],
      date,
    });
    resetForm();
  };

  /** Toggle a single participant in/out of the split list. */
  const toggleSplitPerson = (name: string) => {
    setSplitAmong((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const selectAll = () => setSplitAmong([...participants]);
  const deselectAll = () => setSplitAmong([]);

  return (
    <Card className="border-border">
      <CardContent className="py-2">
        <h2 className="text-lg font-semibold text-foreground mb-4">Add expense</h2>

        <div className="space-y-3">
          {/* Date picker */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Free-text description of the expense */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Description
            </label>
            <Input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="What was this?"
            />
          </div>

          {/* Amount and Paid by share a row to save vertical space */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Amount
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Paid by
              </label>
              <Select value={paidBy} onValueChange={(v) => setPaidBy(v ?? '')}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {participants.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Split-among checkboxes with bulk-select helpers */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-muted-foreground">
                Split among
              </label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="xs" onClick={selectAll}>
                  Select all
                </Button>
                <Button variant="outline" size="xs" onClick={deselectAll}>
                  Select none
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {participants.map((p) => (
                <label
                  key={p}
                  className="inline-flex items-center gap-1.5 text-sm cursor-pointer"
                >
                  <Checkbox
                    checked={splitAmong.includes(p)}
                    onCheckedChange={() => toggleSplitPerson(p)}
                  />
                  {p}
                </label>
              ))}
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full mt-2">
            + Add expense
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
