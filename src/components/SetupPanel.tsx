import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Eraser } from 'lucide-react';
import mascotSvg from '@/assets/mascot.svg';

interface SetupPanelProps {
  label: string;
  participants: string[];
  onLabelChange: (label: string) => void;
  onParticipantsChange: (participants: string[]) => void;
  onClear: () => void;
}

export default function SetupPanel({
  label,
  participants,
  onLabelChange,
  onParticipantsChange,
  onClear,
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
      <CardContent className="py-2">
        {/* Outer: vertical on mobile, horizontal on desktop */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-5">
          {/* Mascot — small on mobile, big on desktop */}
          <img
            src={mascotSvg}
            alt="Shill the Bear mascot"
            className="h-14 md:h-45 shrink-0 self-center"
          />

          {/* Right side: title+clear on one row, then label, then participants */}
          <div className="flex flex-col w-full min-w-0 flex-1">
            {/* Title row */}
            <div className="flex items-center gap-10">
              <h1 className="text-lg md:text-xl font-bold text-foreground shrink">
                Shill the Bear
              </h1>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                    onClear();
                  }
                }}
                className="py-2 px-4 text-muted-foreground hover:text-destructive gap-1.5"
                title="Clear all data"
              >
                <Eraser className="size-4" />
                <span className="hidden sm:inline">Clear Data</span>
              </Button>
            </div>

            {/* Label */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Label
              </label>
              <Input
                value={label}
                onChange={(e) => onLabelChange(e.target.value)}
                placeholder="Dinner, Trip, Rent…"
              />
            </div>

            {/* Participants */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Participants
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                {participants.map((p, i) => (
                  <Badge key={i} variant="secondary" className="pl-4 pr-3.5 py-4 gap-1 text-md">
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
                    className="w-fit rounded-full"
                    placeholder="+ Add person..."
                  />
                  <Button
                    size="icon-sm"
                    onClick={addPerson}
                    className="rounded-full text-md"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
