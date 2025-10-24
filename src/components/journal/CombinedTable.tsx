import { useState, useMemo, useCallback } from 'react';
import { Student, Lesson, Grade } from '@/types';
import { Card } from '../ui/card';
import { DatePagination } from '../DatePagination';
import { getHeaderColor } from './utils';
import { useIndividualPlans } from './useIndividualPlans';
import { useStudentNotes } from './useStudentNotes';
import { useGradeEditing } from './useGradeEditing';
import { EditGradeDialog } from './EditGradeDialog';
import { StudentNotesDialog } from './StudentNotesDialog';
import { DesktopJournalTable } from './DesktopJournalTable';
import { MobileJournalList } from './MobileJournalList';
import { Label } from '../ui/label';
import { Zap } from 'lucide-react';
import { toast } from 'sonner';

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
    const [quickMode, setQuickMode] = useState(false);

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

    // Швидке переключення присутності (тільки для лекцій)
    const handleQuickToggle = useCallback((student: Student, _lesson: Lesson, grade: Grade) => {
        if (!quickMode || type !== 'lecture') return false;

        const updatedGrade: Grade = {
            ...grade,
            attended: !grade.attended,
            score: null,
        };

        onGradeUpdate(updatedGrade);

        if (updatedGrade.attended) {
            toast.success(`${student.lastName} ${student.firstName} відмічений як присутній.`);
        } else {
            toast.error(`${student.lastName} ${student.firstName} відмічений як відсутній.`);
        }

        return true;
    }, [quickMode, type, onGradeUpdate]);

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
                        <div className="flex items-center gap-4 flex-wrap">
                            <h3 className="text-lg font-semibold">{getTitle()}</h3>

                            {type === 'lecture' && (
                                <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-green-200">
                                    <input
                                        type="checkbox"
                                        id="quickMode"
                                        checked={quickMode}
                                        onChange={(e) => setQuickMode(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                                    />
                                    <Label
                                        htmlFor="quickMode"
                                        className="text-sm font-medium cursor-pointer flex items-center gap-1.5 select-none"
                                    >
                                        <Zap className={`h-4 w-4 ${quickMode ? 'text-green-600' : 'text-gray-500'}`} />
                                        Швидкий режим
                                    </Label>
                                </div>
                            )}
                        </div>
                        <DatePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>

                    {type === 'lecture' && quickMode && (
                        <div className="mt-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded border border-green-200">
                            <span className="font-semibold">Підказка:</span> Один клік - переключити присутність/відсутність.
                            Для балів та коментарів вимкніть швидкий режим.
                        </div>
                    )}
                </div>

                <DesktopJournalTable
                    type={type}
                    students={filteredStudents}
                    lessons={paginatedLessons}
                    getGrade={getGrade}
                    headerColor={headerColor}
                    studentNotes={studentNotes}
                    individualPlans={individualPlans}
                    fullGrades={grades}
                    fullLessons={lessons}
                    onCellClick={handleCellClick}
                    onShowNotes={setShowNotesDialog}
                    onToggleIndividualPlan={toggleIndividualPlan}
                    quickMode={quickMode}
                    onQuickToggle={handleQuickToggle}
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
                    quickMode={quickMode}
                    onQuickToggle={handleQuickToggle}
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
        </>
    );
}