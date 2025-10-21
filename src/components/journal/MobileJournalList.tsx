import { Check, X, MessageSquare, StickyNote } from 'lucide-react';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Student, Lesson, Grade } from '@/types';
import { getRowColor, getCellHoverColor, getTotalScore, calculateAttendanceRate } from './utils';

interface MobileJournalListProps {
    type: 'lecture' | 'practical' | 'laboratory';
    students: Student[];
    lessons: Lesson[];
    getGrade: (studentId: number, lessonId: number) => Grade | undefined;
    fullGrades: Grade[]; // Для розрахунків
    fullLessons: Lesson[]; // Для розрахунків
    onCellClick: (student: Student, lesson: Lesson, grade: Grade) => void;
    onShowNotes: (studentId: number) => void;
}

const GradeCellDisplay = ({ grade }: { grade: Grade }) => {
    if (!grade.attended && grade.score === null) {
        return <X className="h-5 w-5 text-red-600" />;
    }
    if (grade.score !== null) {
        return (
            <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-gray-800">
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
                                      onShowNotes
                                  }: MobileJournalListProps) {
    const cellHoverColor = getCellHoverColor(type);

    return (
        <div className="md:hidden p-4 space-y-4">
            {students.map((student, idx) => {
                const rowColor = getRowColor(idx, type);
                const attendanceRate = calculateAttendanceRate(student.id, fullGrades, fullLessons, type);
                const attendanceRateValue = parseInt(attendanceRate);

                return (
                    <Card key={student.id} className={`p-4 ${rowColor}`}>
                        <div className="mb-3 pb-3 border-b">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-sm text-gray-500">#{idx + 1}</div>
                                    <div className="font-medium mt-1">
                                        {student.lastName} {student.firstName} {student.patronymic}
                                    </div>
                                    <div className="text-sm font-semibold text-gray-700 mt-1">
                                        Сума: {getTotalScore(student.id, fullGrades, fullLessons, type).toFixed(1)}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className={`text-sm font-semibold px-2 py-1 rounded ${
                                        attendanceRateValue >= 80 ? 'bg-green-100 text-green-700' :
                                            attendanceRateValue >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {attendanceRate}
                                    </div>
                                    <button
                                        onClick={() => onShowNotes(student.id)}
                                        className="text-blue-600 self-end"
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
                                    const hasComment = grade && (grade as any).comment;

                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => grade && onCellClick(student, lesson, grade)}
                                            className={`flex-shrink-0 flex flex-col items-center justify-center gap-1 p-2 rounded border ${cellHoverColor} disabled:opacity-50 w-24 h-20 transition-all relative`}
                                        >
                                            <div className="text-xs text-gray-600 whitespace-nowrap font-medium">
                                                {lesson.date}
                                            </div>
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