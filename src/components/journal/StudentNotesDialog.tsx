import { memo } from "react";
import { StickyNote } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Student, StudentNote } from "@/types";
import { NoteItem } from "./NoteItem";
import { AddNoteForm } from "./AddNoteForm";

interface StudentNotesDialogProps {
  student: Student | undefined;
  notes: StudentNote[];
  onClose: () => void;
  onAddNote: (studentId: number, text: string) => void;
  onDeleteNote: (studentId: number, noteId: number) => void;
}

export const StudentNotesDialog = memo(function StudentNotesDialog({
  student,
  notes,
  onClose,
  onAddNote,
  onDeleteNote,
}: StudentNotesDialogProps) {
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
          <AddNoteForm
            onAdd={(text) => student && onAddNote(student.id, text)}
          />

          <div className="space-y-2">
            <Label>Всі примітки ({notes.length || 0})</Label>
            <ScrollArea className="h-[300px] border rounded-lg p-4">
              {notes.length > 0 ? (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <NoteItem
                      key={note.id}
                      note={note}
                      onDelete={(noteId) =>
                        student && onDeleteNote(student.id, noteId)
                      }
                      showDelete={!!student}
                    />
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
          <Button onClick={onClose}>Закрити</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
