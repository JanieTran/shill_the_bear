import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface SetupPanelProps {
  label: string;
  participants: string[];
  onLabelChange: (label: string) => void;
  onParticipantsChange: (participants: string[]) => void;
}

export default function SetupPanel({
  label,
  participants,
  onLabelChange,
  onParticipantsChange,
}: SetupPanelProps) {
  const [newPerson, setNewPerson] = useState('');

  const addPerson = () => {
    const name = newPerson.trim();
    if (name && !participants.includes(name)) {
      onParticipantsChange([...participants, name]);
      setNewPerson('');
    }
  };

  const removePerson = (index: number) => {
    onParticipantsChange(participants.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-border">
      <CardContent className="pt-5 pb-5">
        {/* App header with export action */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">
            Share the Bill with 🐻 Shill the Bear
          </h1>
          <Button variant="outline" size="sm">
            Export JSON
          </Button>
        </div>

        {/* Row 1: session label */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Label
          </label>
          <Input
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
            placeholder="Dinner, Trip, Rent…"
          />
        </div>

        {/* Row 2: participant badges with inline add */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Participants
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            {participants.map((p, i) => (
              <Badge key={i} variant="secondary" className="pl-2.5 pr-1.5 py-0.5 gap-1">
                {p}
                <button
                  onClick={() => removePerson(i)}
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
            <div className="flex items-center gap-1">
              <Input
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addPerson();
                }}
                className="w-28 rounded-full"
                placeholder="+ Add…"
              />
              <Button
                size="icon-xs"
                onClick={addPerson}
                className="rounded-full"
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
