import { StickyNote } from 'lucide-react';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Student, Lesson, Grade } from '@/types';
import { getRowColor, getTotalScore, calculateAttendanceRate } from './utils';
import { MobileJournalCell } from './MobileJournalCell';

interface MobileStudentCardProps {
    student: Student;
    idx: number;
    type: 'lecture' | 'practical' | 'laboratory' | 'all';
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

export function MobileStudentCard({
                                      student,
                                      idx,
                                      type,
                                      lessons,
                                      getGrade,
                                      fullGrades,
                                      fullLessons,
                                      onCellClick,
                                      onShowNotes,
                                      quickMode,
                                      onQuickToggle,
                                      currentDate
                                  }: MobileStudentCardProps) {

    const rowColor = getRowColor(idx, type);
    const attendanceRate = calculateAttendanceRate(student.id, fullGrades, fullLessons, type);
    const attendanceRateValue = parseInt(attendanceRate);

    return (
        <Card className={`p-4 ${rowColor} dark:bg-gray-800/50`}>
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
                    {lessons.map((lesson) => (
                        <MobileJournalCell
                            key={lesson.id}
                            student={student}
                            lesson={lesson}
                            grade={getGrade(student.id, lesson.id)}
                            type={type}
                            quickMode={!!quickMode}
                            currentDate={currentDate}
                            onCellClick={onCellClick}
                            onQuickToggle={onQuickToggle}
                        />
                    ))}
                </div>
            </ScrollArea>
        </Card>
    );
}