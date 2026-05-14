import { useState } from 'react';
import type { Expense } from './types';
import SetupPanel from './components/SetupPanel';
import AddExpenseForm from './components/AddExpenseForm';
import ExpensesTable from './components/ExpensesTable';
import ResultsPanel from './components/ResultsPanel';

const SAMPLE_EXPENSES: Expense[] = [
  {
    id: '1',
    description: 'khách sạn',
    amount: 3334878,
    paidBy: 'Trâm',
    splitAmong: ['Trâm', 'Mai', 'Phương', 'Loan'],
    date: '2026-08-07',
  },
  {
    id: '2',
    description: 'hủ tiếu',
    amount: 90000,
    paidBy: 'Trâm',
    splitAmong: ['Mai', 'Loan'],
    date: '2026-08-07',
  },
  {
    id: '3',
    description: 'bánh mì chảo',
    amount: 100000,
    paidBy: 'Mai',
    splitAmong: ['Mai'],
    date: '2026-08-07',
  },
  {
    id: '4',
    description: 'nước',
    amount: 56000,
    paidBy: 'Trâm',
    splitAmong: ['Trâm', 'Mai', 'Phương', 'Loan'],
    date: '2026-08-07',
  },
  {
    id: '5',
    description: 'Soho',
    amount: 308880,
    paidBy: 'Loan',
    splitAmong: ['Trâm', 'Mai', 'Phương', 'Loan'],
    date: '2026-08-08',
  },
  {
    id: '6',
    description: 'xăng',
    amount: 200000,
    paidBy: 'Trâm',
    splitAmong: ['Trâm', 'Mai', 'Phương', 'Loan'],
    date: '2026-08-08',
  },
];

export default function App() {
  const [label, setLabel] = useState('Mũi Né 07-08');
  const [participants, setParticipants] = useState<string[]>(['Trâm', 'Mai', 'Phương', 'Loan']);
  const [expenses, setExpenses] = useState<Expense[]>(SAMPLE_EXPENSES);

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
          <ResultsPanel participants={participants} />
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
