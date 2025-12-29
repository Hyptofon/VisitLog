import { Grade, Lesson, Student, StudentNote } from "@/types";
import { EditGradeDialog } from "./EditGradeDialog.tsx";
import { StudentNotesDialog } from "./StudentNotesDialog.tsx";

interface EditingCellInfo {
  grade: Grade;
  student: Student;
  lesson: Lesson;
}

interface JournalModalsProps {
  editingCell: EditingCellInfo | null;
  attended: boolean;
  setAttended: (value: boolean) => void;
  score: string;
  setScore: (value: string) => void;
  comment: string;
  setComment: (value: string) => void;
  handleSave: () => void;
  handleCloseEditDialog: () => void;
  adjustScore: (delta: number) => void;

  currentStudentForNotes: Student | undefined;
  studentNotes: Record<number, StudentNote[]>;
  setShowNotesDialog: (id: number | null) => void;
  addStudentNote: (studentId: number, text: string) => void;
  deleteStudentNote: (studentId: number, noteId: number) => void;
}

export function JournalModals({
  editingCell,
  attended,
  setAttended,
  score,
  setScore,
  comment,
  setComment,
  handleSave,
  handleCloseEditDialog,
  adjustScore,
  currentStudentForNotes,
  studentNotes,
  setShowNotesDialog,
  addStudentNote,
  deleteStudentNote,
}: JournalModalsProps) {
  return (
    <>
      <EditGradeDialog
        editingCell={editingCell}
        attended={attended}
        setAttended={setAttended}
        score={score}
        setScore={setScore}
        comment={comment}
        setComment={setComment}
        onSave={handleSave}
        onClose={handleCloseEditDialog}
        adjustScore={adjustScore}
      />

      <StudentNotesDialog
        student={currentStudentForNotes}
        notes={
          currentStudentForNotes
            ? studentNotes[currentStudentForNotes.id] || []
            : []
        }
        onClose={() => setShowNotesDialog(null)}
        onAddNote={addStudentNote}
        onDeleteNote={deleteStudentNote}
      />
    </>
  );
}
