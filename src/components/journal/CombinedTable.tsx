import { useState, useMemo, useCallback } from 'react';
import { Student, Lesson, Grade } from '@/types';
import { Card } from '../ui/card';
import { DatePagination } from '../DatePagination';
import { getHeaderColor } from './utils';
import { useIndividualPlans } from './useIndividualPlans';
import { useGradeHistory } from './useGradeHistory';
import { useStudentNotes } from './useStudentNotes';
import { useGradeEditing } from './useGradeEditing';
import { EditGradeDialog } from './EditGradeDialog';
import { StudentNotesDialog } from './StudentNotesDialog';
import { GradeHistoryDialog } from './GradeHistoryDialog';
import { DesktopJournalTable } from './DesktopJournalTable';
import { MobileJournalList } from './MobileJournalList';

interface CombinedTableProps {
    students: Student[];
    lessons: Lesson[];
    grades: Grade[];
    onGradeUpdate: (grade: Grade) => void;
    searchQuery: string;
    type: 'lecture' | 'practical' | 'laboratory';
}

const LESSONS_PER_PAGE = 6;

export function CombinedTable({
                                  students,
                                  lessons,
                                  grades,
                                  onGradeUpdate,
                                  searchQuery,
                                  type,
                              }: CombinedTableProps) {

    const [currentPage, setCurrentPage] = useState(0);

    const filteredStudents = useMemo(() => {
        if (!searchQuery) return students;
        const query = searchQuery.toLowerCase();
        return students.filter(student =>
            `${student.lastName} ${student.firstName} ${student.patronymic}`.toLowerCase().includes(query)
        );
    }, [students, searchQuery]);

    const totalPages = Math.ceil(lessons.length / LESSONS_PER_PAGE);
    const paginatedLessons = lessons.slice(
        currentPage * LESSONS_PER_PAGE,
        (currentPage + 1) * LESSONS_PER_PAGE
    );

    const { individualPlans, toggleIndividualPlan } = useIndividualPlans(students);

    const {
        gradeHistory,
        showHistoryDialog,
        currentHistory,
        addToHistory,
        showHistory,
        setShowHistoryDialog
    } = useGradeHistory();

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
    } = useGradeEditing({ onGradeUpdate, addToHistory });

    const getGrade = useCallback((studentId: number, lessonId: number): Grade | undefined => {
        return grades.find(g => g.studentId === studentId && g.lessonId === lessonId);
    }, [grades]);

    const headerColor = getHeaderColor(type);

    const getTitle = () => {
        switch(type) {
            case 'lecture': return 'Журнал відвідування - Лекції';
            case 'practical': return 'Журнал відвідування та оцінок - Практичні';
            case 'laboratory': return 'Журнал відвідування та оцінок - Лабораторні';
            default: return 'Журнал';
        }
    };

    return (
        <>
            <Card className="overflow-hidden">
                <div className={`p-4 border-b ${headerColor}`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold">{getTitle()}</h3>
                        </div>
                        <DatePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>

                <DesktopJournalTable
                    type={type}
                    students={filteredStudents}
                    lessons={paginatedLessons}
                    getGrade={getGrade}
                    headerColor={headerColor}
                    studentNotes={studentNotes}
                    individualPlans={individualPlans}
                    gradeHistory={gradeHistory}
                    fullGrades={grades}
                    fullLessons={lessons}
                    onCellClick={handleCellClick}
                    onShowNotes={setShowNotesDialog}
                    onToggleIndividualPlan={toggleIndividualPlan}
                    onShowHistory={showHistory}
                />

                <MobileJournalList
                    type={type}
                    students={filteredStudents}
                    lessons={paginatedLessons}
                    getGrade={getGrade}
                    fullGrades={grades}
                    fullLessons={lessons}
                    onCellClick={handleCellClick}
                    onShowNotes={setShowNotesDialog}
                />
            </Card>

            <EditGradeDialog
                editingCell={editingCell}
                attended={attended}
                setAttended={setAttended}
                score={score}
                setScore={setScore}
                comment={comment}
                setComment={setComment}
                onSave={handleSave}
                onClose={handleCloseEditDialog}
                adjustScore={adjustScore}
            />

            <StudentNotesDialog
                student={currentStudentForNotes}
                notes={currentStudentForNotes ? studentNotes[currentStudentForNotes.id] || [] : []}
                onClose={() => setShowNotesDialog(null)}
                onAddNote={addStudentNote}
                onDeleteNote={deleteStudentNote}
            />

            <GradeHistoryDialog
                history={currentHistory}
                isOpen={showHistoryDialog}
                onClose={() => setShowHistoryDialog(false)}
            />
        </>
    );
}