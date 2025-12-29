import { memo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Student, Lesson, Grade, StudentNote } from "@/types";
import { DesktopJournalRow } from "./DesktopJournalRow.tsx";
import { JournalTableHeader } from "./JournalTableHeader.tsx";

interface DesktopJournalTableProps {
  type: "lecture" | "practical" | "laboratory" | "all";
  students: Student[];
  lessons: Lesson[];
  getGrade: (studentId: number, lessonId: number) => Grade | undefined;
  headerColor: string;
  studentNotes: Record<number, StudentNote[]>;
  individualPlans: Record<number, boolean>;
  fullGrades: Grade[];
  fullLessons: Lesson[];
  onCellClick: (student: Student, lesson: Lesson, grade: Grade) => void;
  onShowNotes: (studentId: number) => void;
  onToggleIndividualPlan: (studentId: number) => void;
  quickMode?: boolean;
  onQuickToggle?: (student: Student, lesson: Lesson, grade: Grade) => boolean;
  currentDate: string;
}

export const DesktopJournalTable = memo(function DesktopJournalTable({
  type,
  students,
  lessons,
  getGrade,
  headerColor,
  studentNotes,
  individualPlans,
  fullGrades,
  fullLessons,
  onCellClick,
  onShowNotes,
  onToggleIndividualPlan,
  quickMode = false,
  onQuickToggle,
  currentDate,
}: DesktopJournalTableProps) {
  return (
    <div className="hidden md:block">
      <ScrollArea className="w-full rotate-x-180">
        <div className="min-w-max rotate-x-180">
          <table className="w-full border-collapse">
            <JournalTableHeader
              headerColor={headerColor}
              lessons={lessons}
              type={type}
              currentDate={currentDate}
            />
            <tbody>
              {students.map((student, idx) => (
                <DesktopJournalRow
                  key={student.id}
                  student={student}
                  index={idx}
                  type={type}
                  lessons={lessons}
                  getGrade={getGrade}
                  studentNotes={studentNotes}
                  individualPlans={individualPlans}
                  fullGrades={fullGrades}
                  fullLessons={fullLessons}
                  onCellClick={onCellClick}
                  onShowNotes={onShowNotes}
                  onToggleIndividualPlan={onToggleIndividualPlan}
                  quickMode={quickMode}
                  onQuickToggle={onQuickToggle}
                  currentDate={currentDate}
                />
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </div>
  );
});
