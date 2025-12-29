import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { students, lessons, initialGrades } from "@/data/mockData";
import { Grade, JournalType } from "@/types";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";

export function useJournalApp() {
  const [selectedType, setSelectedType] = useState<JournalType | null>(null);
  const [grades, setGrades] = useState<Grade[]>(initialGrades);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<JournalType>("all");

  const handleGradeUpdate = useCallback((updatedGrade: Grade) => {
    setGrades((prevGrades) =>
      prevGrades.map((g) =>
        g.studentId === updatedGrade.studentId &&
        g.lessonId === updatedGrade.lessonId
          ? updatedGrade
          : g,
      ),
    );
  }, []);

  const handleSelectType = useCallback((type: JournalType) => {
    setSelectedType(type);
    setActiveTab(type);
  }, []);

  const handleResetType = useCallback(() => {
    setSelectedType(null);
  }, []);

  const filteredLessons = useMemo(() => {
    return activeTab === "all"
      ? lessons
      : lessons.filter((l) => l.type === activeTab);
  }, [activeTab]);

  const handleExportExcel = useCallback(() => {
    exportToExcel(students, filteredLessons, grades, activeTab);
    toast.success("Дані успішно експортовано в Excel", { duration: 3000 });
  }, [filteredLessons, grades, activeTab]);

  const handleExportPDF = useCallback(() => {
    exportToPDF(students, filteredLessons, grades, activeTab);
    toast.success("Документ підготовлено до друку", { duration: 3000 });
  }, [filteredLessons, grades, activeTab]);

  return {
    selectedType,
    grades,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    students,
    filteredLessons,
    handleGradeUpdate,
    handleSelectType,
    handleResetType,
    handleExportExcel,
    handleExportPDF,
  };
}
