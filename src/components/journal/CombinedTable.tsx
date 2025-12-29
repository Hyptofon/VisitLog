import { useCallback } from 'react';
import { Student, Lesson, Grade } from '@/types';
import { Card } from '../ui/card';
import { getHeaderColor } from './utils';
import { useIndividualPlans } from './useIndividualPlans';
import { useStudentNotes } from './useStudentNotes';
import { useGradeEditing } from './useGradeEditing';
import { DesktopJournalTable } from './DesktopJournalTable';
import { MobileJournalList } from './MobileJournalList';
import { JournalHeader } from './JournalHeader';
import { JournalModals } from './JournalModals';
import { useJournalData } from './useJournalData';
import { useQuickMode } from './useQuickMode';

interface CombinedTableProps {
    students: Student[];
    lessons: Lesson[];
    grades: Grade[];
    onGradeUpdate: (grade: Grade) => void;
    searchQuery: string;
    type: 'lecture' | 'practical' | 'laboratory' | 'all';
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
        currentDate
    } = useJournalData({ students, lessons, searchQuery, type });

    const { quickMode, setQuickMode, handleQuickToggle } = useQuickMode({ onGradeUpdate });

    const { individualPlans, toggleIndividualPlan } = useIndividualPlans(students);

    const {
        studentNotes,
        setShowNotesDialog,
        addStudentNote,
        deleteStudentNote,
        currentStudentForNotes
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
        adjustScore
    } = useGradeEditing({ onGradeUpdate });

    const getGrade = useCallback((studentId: number, lessonId: number): Grade | undefined => {
        return grades.find(g => g.studentId === studentId && g.lessonId === lessonId);
    }, [grades]);

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