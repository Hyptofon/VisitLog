import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
import { ViewOptions } from './ViewOptions';
import { getCurrentDate, calculatePageForTodayLesson } from '@/utils/dateUtils'

interface CombinedTableProps {
    students: Student[];
    lessons: Lesson[];
    grades: Grade[];
    onGradeUpdate: (grade: Grade) => void;
    searchQuery: string;
    type: 'lecture' | 'practical' | 'laboratory';
}

export function CombinedTable({
                                  students,
                                  lessons,
                                  grades,
                                  onGradeUpdate,
                                  searchQuery,
                                  type,
                              }: CombinedTableProps) {
    const [viewMode, setViewMode] = useState<'pagination' | 'scroll'>('pagination');
    const [lessonsPerPage, setLessonsPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(0);
    const [quickMode, setQuickMode] = useState(false);

    const hasJumpedToTodayRef = useRef(false);

    useEffect(() => {
        if (viewMode === 'pagination' && !hasJumpedToTodayRef.current) {
            const todayPage = calculatePageForTodayLesson(lessons, lessonsPerPage);

            if (todayPage !== null) {
                setCurrentPage(todayPage);
                toast.success('Перехід до поточної дати', { id: 'jump-to-date-toast' });
            }

            hasJumpedToTodayRef.current = true;
        }

        if (viewMode !== 'pagination') {
            hasJumpedToTodayRef.current = false;
        }

    }, [viewMode, lessons, lessonsPerPage]);

    const filteredStudents = useMemo(() => {
        if (!searchQuery) return students;
        const query = searchQuery.toLowerCase();
        return students.filter(student =>
            `${student.lastName} ${student.firstName} ${student.patronymic}`.toLowerCase().includes(query)
        );
    }, [students, searchQuery]);

    const { displayLessons, totalPages, currentDate } = useMemo(() => {
        const today = getCurrentDate();

        if (viewMode === 'scroll') {
            return { displayLessons: lessons, totalPages: 1, currentDate: today };
        }

        const total = Math.ceil(lessons.length / lessonsPerPage);

        if (currentPage >= total && total > 0) {
            setCurrentPage(total - 1);
        }

        const start = currentPage * lessonsPerPage;
        const end = start + lessonsPerPage;
        return {
            displayLessons: lessons.slice(start, end),
            totalPages: total,
            currentDate: today
        };
    }, [lessons, viewMode, lessonsPerPage, currentPage]);

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

    const handleQuickToggle = useCallback((student: Student, _lesson: Lesson, grade: Grade) => {
        if (!quickMode || type !== 'lecture') return false;

        const updatedGrade: Grade = {
            ...grade,
            attended: !grade.attended,
            score: grade.score,
        };

        onGradeUpdate(updatedGrade);

        const studentName = `${student.lastName} ${student.firstName}`;

        if (updatedGrade.attended) {
            let message = `${studentName} відмічений як присутній.`;
            if (updatedGrade.score !== null) {
                message += ` Оцінка: ${updatedGrade.score}`;
            }
            toast.success(message);
        } else {
            if (updatedGrade.score !== null) {
                toast.warning(`${studentName} відмічений як відсутній, але оцінка ${updatedGrade.score} збережена.`);
            } else {
                toast.error(`${studentName} відмічений як відсутній.`);
            }
        }

        return true;
    }, [quickMode, type, onGradeUpdate]);

    const headerColor = getHeaderColor(type);

    const getTitle = () => {
        switch(type) {
            case 'lecture':
                return 'Журнал відвідування - Лекції';
            case 'practical':
                return 'Журнал відвідування та оцінок - Практичні';
            case 'laboratory':
                return 'Журнал відвідування та оцінок - Лабораторні';
            default:
                return 'Журнал';
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
                                <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800">
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

                        <div className="flex items-center gap-2">
                            <ViewOptions
                                viewMode={viewMode}
                                setViewMode={setViewMode}
                                lessonsPerPage={lessonsPerPage}
                                setLessonsPerPage={setLessonsPerPage}
                            />
                            {viewMode === 'pagination' && totalPages > 1 && (
                                <DatePagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            )}
                        </div>
                    </div>

                    {type === 'lecture' && quickMode && (
                        <div className="mt-2 text-xs text-green-700 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded border border-green-200 dark:border-green-800">
                            <span className="font-semibold">Підказка:</span> Один клік - переключити
                            присутність/відсутність. Для балів та коментарів вимкніть швидкий режим.
                        </div>
                    )}
                </div>

                <DesktopJournalTable
                    type={type}
                    students={filteredStudents}
                    lessons={displayLessons}
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
                    currentDate={currentDate}
                />

                <MobileJournalList
                    type={type}
                    students={filteredStudents}
                    lessons={displayLessons}
                    getGrade={getGrade}
                    fullGrades={grades}
                    fullLessons={lessons}
                    onCellClick={handleCellClick}
                    onShowNotes={setShowNotesDialog}
                    quickMode={quickMode}
                    onQuickToggle={handleQuickToggle}
                    currentDate={currentDate}
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