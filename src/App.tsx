import { useState } from 'react';
import type { Expense } from './types';
import SetupPanel from './components/SetupPanel';
import AddExpenseForm from './components/AddExpenseForm';
import ExpensesTable from './components/ExpensesTable';
import ResultsPanel from './components/ResultsPanel';

export default function App() {
  const [label, setLabel] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const addExpense = (expense: Expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Row 1: session setup — label + participants */}
        <SetupPanel
          label={label}
          participants={participants}
          onLabelChange={setLabel}
          onParticipantsChange={setParticipants}
        />

        {/* Row 2: add expense form + results side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          <AddExpenseForm participants={participants} onAdd={addExpense} />
          <ResultsPanel participants={participants} expenses={expenses} />
        </div>

        {/* Row 3: full-width expenses table */}
        <ExpensesTable
          expenses={expenses}
          participants={participants}
          onDelete={deleteExpense}
        />
      </div>
    </div>
  );
}
