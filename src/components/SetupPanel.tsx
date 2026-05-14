import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import mascotSvg from '@/assets/mascot.svg';

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
      <CardContent className="py-0">
        {/* Two-column layout: mascot on the left, form on the right */}
        <div className="flex gap-5">
          {/* Mascot logo */}
          <img
            src={mascotSvg}
            alt="Shill the Bear mascot"
            className="h-45 shrink-0 self-center"
          />

          {/* Form content */}
          <div className="flex-1 min-w-0">
            {/* App title */}
            <h1 className="text-xl font-bold text-foreground mb-4">
              Shill the Bear
            </h1>

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
