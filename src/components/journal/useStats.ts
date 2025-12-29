import { useMemo } from "react";
import {
  Users,
  BookOpen,
  AlertCircle,
  TrendingUp,
  Award,
  Sigma,
} from "lucide-react";
import { Grade, Lesson } from "@/types";

interface UseStatsProps {
  grades: Grade[];
  lessons: Lesson[];
  studentCount: number;
  type: "lecture" | "practical" | "laboratory" | "all";
}

export function useStats({
  grades,
  lessons,
  studentCount,
  type,
}: UseStatsProps) {
  return useMemo(() => {
    const lessonIdsSet = new Set(lessons.map((l) => l.id));
    const totalPossibleAttendances = studentCount * lessons.length;
    const actualAttendances = grades.filter(
      (g) => g.attended && lessonIdsSet.has(g.lessonId),
    ).length;

    const attendanceRate =
      totalPossibleAttendances > 0
        ? Math.round((actualAttendances / totalPossibleAttendances) * 100)
        : 0;

    switch (type) {
      case "lecture": {
        const totalAbsences = grades.filter(
          (g) => !g.attended && lessonIdsSet.has(g.lessonId),
        ).length;
        return [
          {
            title: "Відвідуваність",
            value: `${attendanceRate}%`,
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-50",
          },
          {
            title: "Кількість занять",
            value: lessons.length,
            icon: BookOpen,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
          },
          {
            title: "Всього пропусків",
            value: totalAbsences,
            icon: AlertCircle,
            color: "text-red-600",
            bgColor: "bg-red-50",
          },
          {
            title: "Студентів",
            value: studentCount,
            icon: Users,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
          },
        ];
      }
      case "practical":
      case "laboratory": {
        const totalSumOfScores = grades
          .filter((g) => lessonIdsSet.has(g.lessonId))
          .reduce((sum, g) => sum + (g.score || 0), 0);

        const averageGrade =
          studentCount > 0
            ? (totalSumOfScores / studentCount).toFixed(1)
            : "0.0";

        return [
          {
            title: "Середній бал",
            value: averageGrade,
            icon: TrendingUp,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
          },
          {
            title: "Відвідуваність",
            value: `${attendanceRate}%`,
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-50",
          },
          {
            title: "Кількість занять",
            value: lessons.length,
            icon: BookOpen,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
          },
          {
            title: "Сума балів",
            value: totalSumOfScores.toFixed(1),
            icon: Award,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
          },
        ];
      }
      case "all": {
        const practicalAndLabLessons = lessons.filter(
          (l) => l.type === "practical" || l.type === "laboratory",
        );
        const practicalAndLabLessonIds = new Set(
          practicalAndLabLessons.map((l) => l.id),
        );

        const totalSumOfScores = grades
          .filter((g) => practicalAndLabLessonIds.has(g.lessonId))
          .reduce((sum, g) => sum + (g.score || 0), 0);

        const averageGrade =
          studentCount > 0 && practicalAndLabLessons.length > 0
            ? (totalSumOfScores / studentCount).toFixed(1)
            : "0.0";

        return [
          {
            title: "Заг. відвідуваність",
            value: `${attendanceRate}%`,
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-50",
          },
          {
            title: "Всього занять",
            value: lessons.length,
            icon: BookOpen,
            color: "text-gray-600",
            bgColor: "bg-gray-50",
          },
          {
            title: "Середній бал (П, Лаб)",
            value: averageGrade,
            icon: TrendingUp,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
          },
          {
            title: "Загальна сума балів",
            value: totalSumOfScores.toFixed(1),
            icon: Sigma,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
          },
        ];
      }
      default:
        return [];
    }
  }, [grades, lessons, studentCount, type]);
}
