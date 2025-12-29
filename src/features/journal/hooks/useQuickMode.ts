import { useState, useCallback } from "react";
import { Student, Lesson, Grade } from "@/types";
import { toast } from "sonner";

interface UseQuickModeProps {
  onGradeUpdate: (grade: Grade) => void;
}

export function useQuickMode({ onGradeUpdate }: UseQuickModeProps) {
  const [quickMode, setQuickMode] = useState(false);

  const handleQuickToggle = useCallback(
    (student: Student, lesson: Lesson, grade: Grade) => {
      if (!quickMode || lesson.type !== "lecture") return false;

      const updatedGrade: Grade = {
        ...grade,
        attended: !grade.attended,
        score: grade.score,
      };

      onGradeUpdate(updatedGrade);

      const studentName = `${student.lastName} ${student.firstName}`;

      if (updatedGrade.attended) {
        let message = `${studentName} відмічений як присутній.`;
        if (updatedGrade.score !== null) {
          message += ` Оцінка: ${updatedGrade.score}`;
        }
        toast.success(message);
      } else {
        if (updatedGrade.score !== null) {
          toast.warning(
            `${studentName} відмічений як відсутній, але оцінка ${updatedGrade.score} збережена.`,
          );
        } else {
          toast.error(`${studentName} відмічений як відсутній.`);
        }
      }

      return true;
    },
    [quickMode, onGradeUpdate],
  );

  return {
    quickMode,
    setQuickMode,
    handleQuickToggle,
  };
}
