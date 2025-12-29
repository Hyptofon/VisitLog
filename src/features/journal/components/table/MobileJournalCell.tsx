import { memo, useCallback } from "react";
import { MessageSquare, Calendar } from "lucide-react";
import { Student, Lesson, Grade } from "@/types";
import {
  getCellHoverColor,
  getHeaderColor,
} from "@/features/journal/utils/utils";
import { isSameDate, getTodayHighlightColors } from "@/utils/dateUtils.ts";
import { GradeCellDisplay } from "./GradeCellDisplay.tsx";

interface MobileJournalCellProps {
  student: Student;
  lesson: Lesson;
  grade: Grade | undefined;
  type: "lecture" | "practical" | "laboratory" | "all";
  quickMode: boolean;
  currentDate: string;
  onCellClick: (student: Student, lesson: Lesson, grade: Grade) => void;
  onQuickToggle?: (student: Student, lesson: Lesson, grade: Grade) => boolean;
}

export const MobileJournalCell = memo(function MobileJournalCell({
  student,
  lesson,
  grade,
  type,
  quickMode,
  currentDate,
  onCellClick,
  onQuickToggle,
}: MobileJournalCellProps) {
  const handleCellClickWrapper = useCallback(() => {
    if (!grade) return;

    if (quickMode && lesson.type === "lecture" && onQuickToggle) {
      const handled = onQuickToggle(student, lesson, grade);
      if (handled) return;
    }
    onCellClick(student, lesson, grade);
  }, [grade, quickMode, lesson, onQuickToggle, student, onCellClick]);

  const hasComment = grade && grade.comment;
  const isToday = isSameDate(lesson.date, currentDate);

  const lessonCellHover = getCellHoverColor(lesson.type);
  const lessonTodayColors = getTodayHighlightColors(lesson.type);
  const lessonBgColor = getHeaderColor(lesson.type).replace("bg-", "border-");

  return (
    <button
      onClick={handleCellClickWrapper}
      className={`flex-shrink-0 flex flex-col items-center justify-center gap-1 p-2 rounded-lg ${lessonCellHover} disabled:opacity-50 w-24 h-20 transition-all relative ${
        quickMode && lesson.type === "lecture" ? "ring-1 ring-green-300" : ""
      } ${
        isToday
          ? `${lessonTodayColors.cell} ${lessonTodayColors.cellBorder}`
          : `border dark:border-gray-600 ${type === "all" ? lessonBgColor.replace("100", "200") : ""}`
      }`}
    >
      <div
        className={`text-xs whitespace-nowrap font-medium flex items-center gap-1 ${
          isToday
            ? `${lessonTodayColors.textColor} font-bold`
            : "text-gray-600 dark:text-gray-400"
        }`}
      >
        {isToday && <Calendar className="h-3 w-3" />}
        {lesson.date}
      </div>
      {type === "all" && (
        <div className="text-[10px] opacity-75 capitalize">
          {lesson.type === "lecture"
            ? "Лекція"
            : lesson.type === "practical"
              ? "Практ."
              : "Лаб."}
        </div>
      )}
      <div className="flex-grow flex items-center justify-center">
        {grade ? (
          <GradeCellDisplay grade={grade} />
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )}
      </div>
      {hasComment && (
        <MessageSquare className="absolute top-1 right-1 h-3 w-3 text-blue-500" />
      )}
    </button>
  );
});
