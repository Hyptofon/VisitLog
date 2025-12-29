import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Grade, Lesson, Student } from "@/types";

interface EditingCell {
  grade: Grade;
  student: Student;
  lesson: Lesson;
}

interface UseGradeEditingProps {
  onGradeUpdate: (grade: Grade) => void;
}

export const useGradeEditing = ({ onGradeUpdate }: UseGradeEditingProps) => {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [attended, setAttended] = useState(true);
  const [score, setScore] = useState("");
  const [comment, setComment] = useState("");

  const handleCellClick = useCallback(
    (student: Student, lesson: Lesson, grade: Grade) => {
      setEditingCell({
        grade,
        student,
        lesson,
      });
      setAttended(grade.attended);
      setScore(grade.score !== null ? grade.score.toString() : "");
      setComment((grade as any).comment || "");
    },
    [],
  );

  const handleCloseDialog = useCallback(() => {
    setEditingCell(null);
    setAttended(true);
    setScore("");
    setComment("");
  }, []);

  const handleSave = useCallback(() => {
    if (!editingCell) return;

    const scoreValue = score === "" ? null : parseFloat(score);
    const oldGrade = editingCell.grade;
    const studentName = `${editingCell.student.lastName} ${editingCell.student.firstName}`;
    const oldComment = (oldGrade as any).comment || "";

    const hasChanged =
      oldGrade.attended !== attended ||
      oldGrade.score !== scoreValue ||
      oldComment !== comment;

    if (!hasChanged) {
      handleCloseDialog();
      return;
    }

    const updatedGrade: Grade = {
      ...oldGrade,
      attended: attended,
      score: scoreValue,
      comment: comment,
    } as any;

    let message = "";
    if (!attended && scoreValue !== null) {
      message = `️ ${studentName} - відсутній, але оцінка ${scoreValue} збережена`;
    } else if (!attended && scoreValue === null) {
      message = `${studentName} - відсутність відмічено`;
    } else if (attended && scoreValue !== null) {
      message = `${studentName} - присутній, оцінка: ${scoreValue}`;
    } else {
      message = `${studentName} - присутність відмічено`;
    }

    if (oldComment && !comment) {
      message += " (коментар видалено)";
    } else if (!oldComment && comment) {
      message += ` (додано коментар)`;
    } else if (oldComment !== comment) {
      message += ` (коментар змінено)`;
    }

    if (!attended && scoreValue !== null) {
      toast.warning(message, { duration: 3000 });
    } else if (!attended) {
      toast.error(message, { duration: 2500 });
    } else {
      toast.success(message, { duration: 2500 });
    }

    onGradeUpdate(updatedGrade);
    handleCloseDialog();
  }, [editingCell, attended, score, comment, onGradeUpdate, handleCloseDialog]);

  const adjustScore = useCallback((delta: number) => {
    setScore((prevScore) => {
      const currentScore = prevScore === "" ? 0 : parseFloat(prevScore);
      const newScore = Math.max(0, currentScore + delta);
      return newScore.toString();
    });
  }, []);

  return {
    editingCell,
    attended,
    setAttended,
    score,
    setScore,
    comment,
    setComment,
    handleCellClick,
    handleCloseDialog,
    handleSave,
    adjustScore,
  };
};
