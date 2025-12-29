import { useState, useMemo, useEffect, useRef } from "react";
import { Student, Lesson } from "@/types";
import { getCurrentDate, calculatePageForTodayLesson } from "@/utils/dateUtils";
import { toast } from "sonner";

interface UseJournalDataProps {
  students: Student[];
  lessons: Lesson[];
  searchQuery: string;
  type: "lecture" | "practical" | "laboratory" | "all";
}

export function useJournalData({
  students,
  lessons,
  searchQuery,
  type,
}: UseJournalDataProps) {
  const [viewMode, setViewMode] = useState<"pagination" | "scroll">(
    "pagination",
  );
  const [lessonsPerPage, setLessonsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(0);

  const hasJumpedToTodayRef = useRef(false);

  const sortedLessons = useMemo(() => {
    if (type === "all") {
      return [...lessons].sort((a, b) => {
        const dateA = new Date(a.date.split(".").reverse().join("-")).getTime();
        const dateB = new Date(b.date.split(".").reverse().join("-")).getTime();
        return dateA - dateB;
      });
    }
    return lessons;
  }, [lessons, type]);

  useEffect(() => {
    if (viewMode === "pagination" && !hasJumpedToTodayRef.current) {
      const todayPage = calculatePageForTodayLesson(lessons, lessonsPerPage);

      if (todayPage !== null) {
        setCurrentPage(todayPage);
        toast.success("Перехід до поточної дати", { id: "jump-to-date-toast" });
      }

      hasJumpedToTodayRef.current = true;
    }

    if (viewMode !== "pagination") {
      hasJumpedToTodayRef.current = false;
    }
  }, [viewMode, lessons, lessonsPerPage]);

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;
    const query = searchQuery.toLowerCase();
    return students.filter((student) =>
      `${student.lastName} ${student.firstName} ${student.patronymic}`
        .toLowerCase()
        .includes(query),
    );
  }, [students, searchQuery]);

  const { displayLessons, totalPages, currentDate } = useMemo(() => {
    const today = getCurrentDate();

    if (viewMode === "scroll") {
      return {
        displayLessons: sortedLessons,
        totalPages: 1,
        currentDate: today,
      };
    }

    const total = Math.ceil(sortedLessons.length / lessonsPerPage);
    const safeCurrentPage = Math.max(
      0,
      Math.min(currentPage, total > 0 ? total - 1 : 0),
    );

    const start = safeCurrentPage * lessonsPerPage;
    const end = start + lessonsPerPage;

    return {
      displayLessons: sortedLessons.slice(start, end),
      totalPages: total,
      currentDate: today,
    };
  }, [sortedLessons, viewMode, lessonsPerPage, currentPage]);

  return {
    viewMode,
    setViewMode,
    lessonsPerPage,
    setLessonsPerPage,
    currentPage,
    setCurrentPage,
    sortedLessons,
    filteredStudents,
    displayLessons,
    totalPages,
    currentDate,
  };
}
