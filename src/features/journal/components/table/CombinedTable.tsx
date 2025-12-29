import { useCallback, useMemo } from "react";
import { Student, Lesson, Grade } from "@/types";
import { Card } from "@/components/ui/card.tsx";
import { getHeaderColor } from "../../utils/utils.ts";
import { useIndividualPlans } from "../../hooks/useIndividualPlans.ts";
import { useStudentNotes } from "../../hooks/useStudentNotes.ts";
import { useGradeEditing } from "../../hooks/useGradeEditing.ts";
import { DesktopJournalTable } from "./DesktopJournalTable.tsx";
import { MobileJournalList } from "./MobileJournalList.tsx";
import { JournalHeader } from "../controls/JournalHeader.tsx";
import { JournalModals } from "../modals/JournalModals.tsx";
import { useJournalData } from "../../hooks/useJournalData.ts";
import { useQuickMode } from "../../hooks/useQuickMode.ts";

interface CombinedTableProps {
  students: Student[];
  lessons: Lesson[];
  grades: Grade[];
  onGradeUpdate: (grade: Grade) => void;
  searchQuery: string;
  type: "lecture" | "practical" | "laboratory" | "all";
}

export function CombinedTable({
  students,
  lessons,
  grades,
  onGradeUpdate,
  searchQuery,
  type,
}: CombinedTableProps) {
  const {
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
  } = useJournalData({ students, lessons, searchQuery, type });

  const { quickMode, setQuickMode, handleQuickToggle } = useQuickMode({
    onGradeUpdate,
  });

  const { individualPlans, toggleIndividualPlan } =
    useIndividualPlans(students);

  const {
    studentNotes,
    setShowNotesDialog,
    addStudentNote,
    deleteStudentNote,
    currentStudentForNotes,
  } = useStudentNotes(students);

  const {
    editingCell,
    attended,
    setAttended,
    score,
    setScore,
    comment,
    setComment,
    handleCellClick,
    handleCloseDialog: handleCloseEditDialog,
    handleSave,
    adjustScore,
  } = useGradeEditing({ onGradeUpdate });

  const gradesMap = useMemo(() => {
    const map = new Map<string, Grade>();
    grades.forEach((g) => map.set(`${g.studentId}-${g.lessonId}`, g));
    return map;
  }, [grades]);

  const getGrade = useCallback(
    (studentId: number, lessonId: number): Grade | undefined => {
      return gradesMap.get(`${studentId}-${lessonId}`);
    },
    [gradesMap],
  );

  const headerColor = getHeaderColor(type);

  return (
    <>
      <Card className="overflow-hidden dark:bg-gray-800/20 dark:border-gray-700">
        <JournalHeader
          type={type}
          quickMode={quickMode}
          setQuickMode={setQuickMode}
          viewMode={viewMode}
          setViewMode={setViewMode}
          lessonsPerPage={lessonsPerPage}
          setLessonsPerPage={setLessonsPerPage}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />

        <DesktopJournalTable
          type={type}
          students={filteredStudents}
          lessons={displayLessons}
          getGrade={getGrade}
          headerColor={headerColor}
          studentNotes={studentNotes}
          individualPlans={individualPlans}
          fullGrades={grades}
          fullLessons={sortedLessons}
          onCellClick={handleCellClick}
          onShowNotes={setShowNotesDialog}
          onToggleIndividualPlan={toggleIndividualPlan}
          quickMode={quickMode}
          onQuickToggle={handleQuickToggle}
          currentDate={currentDate}
        />

        <MobileJournalList
          type={type}
          students={filteredStudents}
          lessons={displayLessons}
          getGrade={getGrade}
          fullGrades={grades}
          fullLessons={sortedLessons}
          onCellClick={handleCellClick}
          onShowNotes={setShowNotesDialog}
          quickMode={quickMode}
          onQuickToggle={handleQuickToggle}
          currentDate={currentDate}
        />
      </Card>

      <JournalModals
        editingCell={editingCell}
        attended={attended}
        setAttended={setAttended}
        score={score}
        setScore={setScore}
        comment={comment}
        setComment={setComment}
        handleSave={handleSave}
        handleCloseEditDialog={handleCloseEditDialog}
        adjustScore={adjustScore}
        currentStudentForNotes={currentStudentForNotes}
        studentNotes={studentNotes}
        setShowNotesDialog={setShowNotesDialog}
        addStudentNote={addStudentNote}
        deleteStudentNote={deleteStudentNote}
      />
    </>
  );
}
