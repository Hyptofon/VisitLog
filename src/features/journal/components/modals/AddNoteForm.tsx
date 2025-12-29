import React, { memo, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";

interface AddNoteFormProps {
  onAdd: (text: string) => void;
}

export const AddNoteForm = memo(function AddNoteForm({
  onAdd,
}: AddNoteFormProps) {
  const [newNote, setNewNote] = useState("");

  const handleAdd = useCallback(() => {
    if (newNote.trim()) {
      onAdd(newNote);
      setNewNote("");
    }
  }, [newNote, onAdd]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNewNote(e.target.value);
    },
    [],
  );

  return (
    <div className="space-y-2">
      <Label htmlFor="newNote">Додати нову примітку</Label>
      <Textarea
        id="newNote"
        value={newNote}
        onChange={handleChange}
        placeholder="Наприклад: має академзаборгованість, потребує індивідуальної консультації..."
        rows={3}
        className="resize-none"
      />
      <Button onClick={handleAdd} className="w-full" disabled={!newNote.trim()}>
        <Plus className="h-4 w-4 mr-2" />
        Додати примітку
      </Button>
    </div>
  );
});
