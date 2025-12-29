import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useState } from 'react';

interface AddNoteFormProps {
    onAdd: (text: string) => void;
}

export function AddNoteForm({ onAdd }: AddNoteFormProps) {
    const [newNote, setNewNote] = useState('');

    const handleAdd = () => {
        if (newNote.trim()) {
            onAdd(newNote);
            setNewNote('');
        }
    };

    return (
        <div className="space-y-2">
            <Label htmlFor="newNote">Додати нову примітку</Label>
            <Textarea
                id="newNote"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
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
}