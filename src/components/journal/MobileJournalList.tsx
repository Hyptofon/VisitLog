import { memo } from "react";
import { Student, Lesson, Grade } from "@/types";
import { MobileStudentCard } from "./MobileStudentCard";

interface MobileJournalListProps {
  type: "lecture" | "practical" | "laboratory" | "all";
  students: Student[];
  lessons: Lesson[];
  getGrade: (studentId: number, lessonId: number) => Grade | undefined;
  fullGrades: Grade[];
  fullLessons: Lesson[];
  onCellClick: (student: Student, lesson: Lesson, grade: Grade) => void;
  onShowNotes: (studentId: number) => void;
  quickMode?: boolean;
  onQuickToggle?: (student: Student, lesson: Lesson, grade: Grade) => boolean;
  currentDate: string;
}

export const MobileJournalList = memo(function MobileJournalList({
  type,
  students,
  lessons,
  getGrade,
  fullGrades,
  fullLessons,
  onCellClick,
  onShowNotes,
  quickMode = false,
  onQuickToggle,
  currentDate,
}: MobileJournalListProps) {
  return (
    <div className="md:hidden p-4 space-y-4">
      {students.map((student, idx) => (
        <MobileStudentCard
          key={student.id}
          student={student}
          idx={idx}
          type={type}
          lessons={lessons}
          getGrade={getGrade}
          fullGrades={fullGrades}
          fullLessons={fullLessons}
          onCellClick={onCellClick}
          onShowNotes={onShowNotes}
          quickMode={quickMode}
          onQuickToggle={onQuickToggle}
          currentDate={currentDate}
        />
      ))}
    </div>
  );
});
