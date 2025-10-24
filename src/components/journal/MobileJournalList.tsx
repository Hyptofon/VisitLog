import { Check, X, MessageSquare, StickyNote, Calendar } from 'lucide-react';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Student, Lesson, Grade } from '@/types';
import { getRowColor, getCellHoverColor, getTotalScore, calculateAttendanceRate, getHeaderColor } from './utils';
import { isSameDate, getTodayHighlightColors } from '@/utils/dateUtils'

interface MobileJournalListProps {
    type: 'lecture' | 'practical' | 'laboratory' | 'all';
    students: Student[];
    lessons: Lesson[];
    getGrade: (studentId: number, lessonId: number) => Grade | undefined;
    fullGrades: Grade[];
    fullLessons: Lesson[];
    onCellClick: (student: Student, lesson: Lesson, grade: Grade) => void;
    onShowNotes: (studentId: number) => void;
    quickMode?: boolean;
    onQuickToggle?: (student: Student, lesson: Lesson, grade: Grade) => boolean;
    currentDate: string;
}

const GradeCellDisplay = ({ grade }: { grade: Grade }) => {
    if (!grade.attended && grade.score === null) {
        return <X className="h-5 w-5 text-red-600" />;
    }
    if (grade.score !== null) {
        return (
            <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {grade.score}
                </span>
                {!grade.attended && (
                    <X className="h-3 w-3 text-red-500 -mt-1" />
                )}
            </div>
        );
    }
    return <Check className="h-5 w-5 text-green-600" />;
};

export function MobileJournalList({
                                      type,
                                      students,
                                      lessons,
                                      getGrade,
                                      fullGrades,
                                      fullLessons,
                                      onCellClick,
                                      onShowNotes,
                                      quickMode = false,
                                      onQuickToggle,
                                      currentDate
                                  }: MobileJournalListProps) {

    const handleCellClickWrapper = (student: Student, lesson: Lesson, grade: Grade) => {
        if (quickMode && lesson.type === 'lecture' && onQuickToggle) {
            const handled = onQuickToggle(student, lesson, grade);
            if (handled) return;
        }
        onCellClick(student, lesson, grade);
    };

    return (
        <div className="md:hidden p-4 space-y-4">
            {students.map((student, idx) => {
                const rowColor = getRowColor(idx, type);
                const attendanceRate = calculateAttendanceRate(student.id, fullGrades, fullLessons, type);
                const attendanceRateValue = parseInt(attendanceRate);

                return (
                    <Card key={student.id} className={`p-4 ${rowColor} dark:bg-gray-800/50`}>
                        <div className="mb-3 pb-3 border-b dark:border-gray-700">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">#{idx + 1}</div>
                                    <div className="font-medium mt-1">
                                        {student.lastName} {student.firstName} {student.patronymic}
                                    </div>
                                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">
                                        Сума: {getTotalScore(student.id, fullGrades, fullLessons, type).toFixed(1)}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    <div className={`text-sm font-semibold px-2 py-1 rounded ${
                                        attendanceRateValue >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                                            attendanceRateValue >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                                    }`}>
                                        {attendanceRate}
                                    </div>
                                    <button
                                        onClick={() => onShowNotes(student.id)}
                                        className="text-blue-600"
                                    >
                                        <StickyNote className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <ScrollArea className="w-full">
                            <div className="flex gap-2 pb-2">
                                {lessons.map((lesson) => {
                                    const grade = getGrade(student.id, lesson.id);
                                    const hasComment = grade && grade.comment;
                                    const isToday = isSameDate(lesson.date, currentDate);

                                    const lessonCellHover = getCellHoverColor(lesson.type);
                                    const lessonTodayColors = getTodayHighlightColors(lesson.type);
                                    const lessonBgColor = getHeaderColor(lesson.type).replace('bg-', 'border-');

                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => grade && handleCellClickWrapper(student, lesson, grade)}
                                            className={`flex-shrink-0 flex flex-col items-center justify-center gap-1 p-2 rounded-lg ${lessonCellHover} disabled:opacity-50 w-24 h-20 transition-all relative ${
                                                quickMode && lesson.type === 'lecture' ? 'ring-1 ring-green-300' : ''
                                            } ${
                                                isToday ? `${lessonTodayColors.cell} ${lessonTodayColors.cellBorder}` : `border dark:border-gray-600 ${type === 'all' ? lessonBgColor.replace('100', '200') : ''}`
                                            }`}
                                        >
                                            <div className={`text-xs whitespace-nowrap font-medium flex items-center gap-1 ${
                                                isToday ? `${lessonTodayColors.textColor} font-bold` : 'text-gray-600 dark:text-gray-400'
                                            }`}>
                                                {isToday && <Calendar className="h-3 w-3" />}
                                                {lesson.date}
                                            </div>
                                            {type === 'all' && (
                                                <div className="text-[10px] opacity-75 capitalize">
                                                    {lesson.type === 'lecture' ? 'Лекція' : lesson.type === 'practical' ? 'Практ.' : 'Лаб.'}
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
                                })}
                            </div>
                        </ScrollArea>
                    </Card>
                );
            })}
        </div>
    );
}