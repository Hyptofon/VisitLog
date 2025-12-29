import { memo, useMemo } from "react";
import { Student, Lesson, Grade, StudentNote } from "@/types";
import {
  getRowColor,
  getTotalScore,
  calculateAttendanceRate,
} from "../../utils/utils.ts";
import { DesktopJournalCell } from "./DesktopJournalCell.tsx";
import { StudentNotesButton } from "./StudentNotesButton.tsx";
import { IndividualPlanButton } from "./IndividualPlanButton.tsx";

interface DesktopJournalRowProps {
  student: Student;
  index: number;
  type: "lecture" | "practical" | "laboratory" | "all";
  lessons: Lesson[];
  getGrade: (studentId: number, lessonId: number) => Grade | undefined;
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

export const DesktopJournalRow = memo(function DesktopJournalRow({
  student,
  index,
  type,
  lessons,
  getGrade,
  studentNotes,
  individualPlans,
  fullGrades,
  fullLessons,
  onCellClick,
  onShowNotes,
  onToggleIndividualPlan,
  quickMode,
  onQuickToggle,
  currentDate,
}: DesktopJournalRowProps) {
  const rowColor = getRowColor(index, type);
  const attendanceRate = useMemo(
    () => calculateAttendanceRate(student.id, fullGrades, fullLessons, type),
    [student.id, fullGrades, fullLessons, type],
  );

  const totalScore = useMemo(
    () => getTotalScore(student.id, fullGrades, fullLessons, type),
    [student.id, fullGrades, fullLessons, type],
  );

  const attendanceRateValue = parseInt(attendanceRate);
  const baseBg = "bg-background dark:bg-gray-900";

  return (
    <tr className="border-b dark:border-gray-700 transition-colors">
      <td
        className={`sticky left-0 z-20 px-3 py-3 border-r dark:border-gray-700 w-[50px] ${baseBg} ${rowColor}`}
      >
        <div className="text-sm">{index + 1}</div>
      </td>

      <td
        className={`sticky left-[50px] z-20 px-4 py-3 border-r dark:border-gray-700 min-w-[280px] ${baseBg} ${rowColor}`}
      >
        <div className="text-sm font-medium">
          {student.lastName} {student.firstName} {student.patronymic}
        </div>
      </td>

      <td
        className={`px-3 py-3 border-r dark:border-gray-700 text-center min-w-[80px] ${baseBg} ${rowColor}`}
      >
        <StudentNotesButton
          noteCount={studentNotes[student.id]?.length || 0}
          onClick={() => onShowNotes(student.id)}
        />
      </td>

      <td
        className={`px-3 py-3 border-r dark:border-gray-700 text-center min-w-[80px] ${baseBg} ${rowColor}`}
      >
        <IndividualPlanButton
          hasPlan={!!individualPlans[student.id]}
          onToggle={() => onToggleIndividualPlan(student.id)}
        />
      </td>

      <td
        className={`px-3 py-3 border-r dark:border-gray-700 text-center min-w-[70px] ${baseBg} ${rowColor}`}
      >
        <div className="text-sm font-bold">{totalScore.toFixed(1)}</div>
      </td>

      {lessons.map((lesson) => (
        <DesktopJournalCell
          key={lesson.id}
          student={student}
          lesson={lesson}
          grade={getGrade(student.id, lesson.id)}
          type={type}
          rowColor={rowColor}
          quickMode={!!quickMode}
          currentDate={currentDate}
          onCellClick={onCellClick}
          onQuickToggle={onQuickToggle}
        />
      ))}

      <td
        className={`sticky right-0 z-20 px-4 py-3 border-l dark:border-gray-700 text-center min-w-[120px] shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[-4px_0_6px_-1px_rgba(255,255,255,0.05)] ${baseBg} ${rowColor}`}
      >
        <div
          className={`text-sm font-bold ${
            attendanceRateValue >= 80
              ? "text-green-700 dark:text-green-400"
              : attendanceRateValue >= 60
                ? "text-yellow-700 dark:text-yellow-400"
                : "text-red-700 dark:text-red-400"
          }`}
        >
          {attendanceRate}
        </div>
      </td>
    </tr>
  );
});
