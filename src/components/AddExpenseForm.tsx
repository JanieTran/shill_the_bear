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

/** Whether to split the expense evenly or by custom weights. */
type SplitMode = 'equal' | 'weighted';

/** Form for adding a new expense — collects date, description, amount, payer, and split recipients. */
export default function AddExpenseForm({ participants, onAdd }: AddExpenseFormProps) {
  const today = new Date().toISOString().slice(0, 10);

  // --- Form state ---
  const [date, setDate] = useState(today);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(participants[0] ?? '');
  const [splitAmong, setSplitAmong] = useState<string[]>([...participants]);
  const [splitMode, setSplitMode] = useState<SplitMode>('equal');
  // Weights keyed by participant name — default weight is 1 for all
  const [splitWeights, setSplitWeights] = useState<Record<string, number>>(
    Object.fromEntries(participants.map((p) => [p, 1])),
  );

  /** Clear description, amount, and split selection while keeping date and payer. */
  const resetForm = () => {
    setDesc('');
    setAmount('');
    setPaidBy(participants[0] ?? '');
    setSplitAmong([...participants]);
    setSplitMode('equal');
    setSplitWeights(Object.fromEntries(participants.map((p) => [p, 1])));
  };

  /** Validate fields and emit the new expense, then reset the form. */
  const handleSubmit = () => {
    if (!desc.trim() || !amount || !paidBy || splitAmong.length === 0) return;
    const expense: Expense = {
      id: crypto.randomUUID(),
      description: desc.trim(),
      amount: Number(amount),
      paidBy,
      splitAmong: [...splitAmong],
      date,
    };
    // Only include weights when in weighted mode
    if (splitMode === 'weighted') {
      // Narrow weights to only the selected participants
      const weights: Record<string, number> = {};
      for (const name of splitAmong) {
        weights[name] = splitWeights[name] ?? 1;
      }
      expense.splitWeights = weights;
    }
    onAdd(expense);
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

  /** Update a participant's weight in weighted mode. */
  const setPersonWeight = (name: string, weight: number) => {
    setSplitWeights((prev) => ({ ...prev, [name]: weight }));
  };

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

          {/* Split-among section with equal/weighted toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <label className="block text-xs font-medium text-muted-foreground">
                  Split among
                </label>
                {/* Segmented control: Equal vs Weighted */}
                <div className="flex items-center rounded-lg border border-border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setSplitMode('equal')}
                    className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                      splitMode === 'equal'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Equal
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitMode('weighted')}
                    className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                      splitMode === 'weighted'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Weighted
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="xs" onClick={selectAll}>
                  Select all
                </Button>
                <Button variant="outline" size="xs" onClick={deselectAll}>
                  Select none
                </Button>
              </div>
            </div>

            {/* Equal mode: simple checkboxes */}
            {splitMode === 'equal' && (
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
            )}

            {/* Weighted mode: checkboxes with weight inputs — auto-flowing grid */}
            {splitMode === 'weighted' && (
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {participants.map((p) => {
                  const isSelected = splitAmong.includes(p);
                  return (
                    <div key={p} className="flex items-center gap-1">
                      <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer min-w-0">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSplitPerson(p)}
                        />
                        <span className="truncate">{p}</span>
                      </label>
                      {isSelected && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">×</span>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            value={splitWeights[p] ?? 1}
                            onChange={(e) =>
                              setPersonWeight(p, Math.max(0, Number(e.target.value)))
                            }
                            className="w-12 h-6 text-xs px-1.5"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Button onClick={handleSubmit} className="w-full mt-2">
            + Add expense
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
