import { useState } from 'react';
import { StickyNote, Plus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';
import { Student, StudentNote } from '@/types';

interface StudentNotesDialogProps {
    student: Student | undefined;
    notes: StudentNote[];
    onClose: () => void;
    onAddNote: (studentId: number, text: string) => void;
    onDeleteNote: (studentId: number, noteId: number) => void;
}

export function StudentNotesDialog({
                                       student,
                                       notes,
                                       onClose,
                                       onAddNote,
                                       onDeleteNote
                                   }: StudentNotesDialogProps) {
    const [newNote, setNewNote] = useState('');

    const handleAddNote = () => {
        if (student) {
            onAddNote(student.id, newNote);
            setNewNote('');
        }
    };

    return (
        <Dialog open={!!student} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <StickyNote className="h-5 w-5" />
                        Примітки студента
                    </DialogTitle>
                    {student && (
                        <p className="text-sm text-gray-500 mt-2">
                            {student.lastName} {student.firstName}
                        </p>
                    )}
                </DialogHeader>

                <div className="space-y-4 py-4">
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
                        <Button onClick={handleAddNote} className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Додати примітку
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label>Всі примітки ({notes.length || 0})</Label>
                        <ScrollArea className="h-[300px] border rounded-lg p-4">
                            {notes.length > 0 ? (
                                <div className="space-y-3">
                                    {notes.map((note) => (
                                        <Card key={note.id} className="p-3">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex-1">
                                                    <p className="text-sm">{note.text}</p>
                                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                        <span>{note.author}</span>
                                                        <span>•</span>
                                                        <span>{note.timestamp}</span>
                                                    </div>
                                                </div>
                                                {student && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onDeleteNote(student.id, note.id)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <StickyNote className="h-12 w-12 mb-2" />
                                    <p className="text-sm">Приміток ще немає</p>
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={onClose}>
                        Закрити
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}