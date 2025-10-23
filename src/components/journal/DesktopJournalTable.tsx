import { Check, X, Minus, Plus, MessageSquare, StickyNote } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Student, Lesson, Grade, StudentNote } from '@/types';
import { getRowColor, getCellHoverColor, getTotalScore, calculateAttendanceRate } from './utils';

interface DesktopJournalTableProps {
    type: 'lecture' | 'practical' | 'laboratory';
    students: Student[];
    lessons: Lesson[];
    getGrade: (studentId: number, lessonId: number) => Grade | undefined;
    headerColor: string;
    studentNotes: Record<number, StudentNote[]>;
    individualPlans: Record<number, boolean>;
    fullGrades: Grade[];
    fullLessons: Lesson[];
    onCellClick: (student: Student, lesson: Lesson, grade: Grade) => void;
    onShowNotes: (studentId: number) => void;
    onToggleIndividualPlan: (studentId: number) => void;
    quickMode?: boolean;
    onQuickToggle?: (student: Student, lesson: Lesson, grade: Grade) => boolean;
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

export function DesktopJournalTable({
                                        type,
                                        students,
                                        lessons,
                                        getGrade,
                                        headerColor,
                                        studentNotes,
                                        individualPlans,
                                        fullGrades,
                                        fullLessons,
                                        onCellClick,
                                        onShowNotes,
                                        onToggleIndividualPlan,
                                        quickMode = false,
                                        onQuickToggle
                                    }: DesktopJournalTableProps) {
    const cellHoverColor = getCellHoverColor(type);

    const handleCellClickWrapper = (student: Student, lesson: Lesson, grade: Grade) => {
        // В швидкому режимі для лекцій - просто переключаємо
        if (quickMode && type === 'lecture' && onQuickToggle) {
            const handled = onQuickToggle(student, lesson, grade);
            if (handled) return;
        }
        // Інакше відкриваємо модалку
        onCellClick(student, lesson, grade);
    };

    return (
        <div className="hidden md:block">
            <ScrollArea className="w-full">
                <div className="min-w-max">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className={headerColor}>
                            <th className={`sticky left-0 ${headerColor} z-20 px-3 py-3 text-left border-r border-b w-[50px]`}>
                                <div className="text-sm font-semibold">#</div>
                            </th>
                            <th className={`sticky left-[50px] ${headerColor} z-20 px-4 py-3 text-left border-r border-b min-w-[280px]`}>
                                <div className="text-sm font-semibold">Студент</div>
                            </th>
                            <th className={`px-3 py-3 border-r border-b ${headerColor} min-w-[80px] text-center`}>
                                <div className="text-xs font-semibold">Примітки</div>
                            </th>
                            <th className={`px-3 py-3 border-r border-b ${headerColor} min-w-[80px] text-center`}>
                                <div className="text-xs font-semibold">Інд. план</div>
                            </th>
                            <th className={`px-3 py-3 border-r border-b ${headerColor} min-w-[70px] text-center`}>
                                <div className="text-sm font-semibold">Сума</div>
                            </th>
                            {lessons.map((lesson) => (
                                <th key={lesson.id} className={`px-3 py-3 border-r border-b ${headerColor} min-w-[100px] text-center`}>
                                    <div className="text-sm font-semibold whitespace-nowrap">{lesson.date}</div>
                                </th>
                            ))}
                            <th className={`sticky right-0 ${headerColor} z-10 px-4 py-3 border-l border-b min-w-[138px] shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] text-center`}>
                                <div className="text-sm font-semibold">Відвідування</div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((student, idx) => {
                            const rowColor = getRowColor(idx, type);
                            const attendanceRate = calculateAttendanceRate(student.id, fullGrades, fullLessons, type);
                            const attendanceRateValue = parseInt(attendanceRate);

                            return (
                                <tr
                                    key={student.id}
                                    className={`border-b ${rowColor} transition-colors`}
                                >
                                    <td className={`sticky left-0 z-10 px-3 py-3 border-r ${rowColor} w-[50px]`}>
                                        <div className="text-sm">{idx + 1}</div>
                                    </td>
                                    <td className={`sticky left-[50px] z-10 px-4 py-3 border-r ${rowColor} min-w-[280px]`}>
                                        <div className="text-sm font-medium">
                                            {student.lastName} {student.firstName} {student.patronymic}
                                        </div>
                                    </td>
                                    <td className={`px-3 py-3 border-r text-center ${rowColor} min-w-[80px]`}>
                                        <button
                                            onClick={() => onShowNotes(student.id)}
                                            className="flex items-center justify-center w-full h-full transition-transform hover:scale-110 relative"
                                        >
                                            <StickyNote className="h-5 w-5 text-blue-600" />
                                            {studentNotes[student.id]?.length > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                                    {studentNotes[student.id].length}
                                                </span>
                                            )}
                                        </button>
                                    </td>
                                    <td className={`px-3 py-3 border-r text-center ${rowColor} min-w-[80px]`}>
                                        <button
                                            onClick={() => onToggleIndividualPlan(student.id)}
                                            className="flex items-center justify-center w-full h-full transition-transform hover:scale-110"
                                        >
                                            {individualPlans[student.id] ? (
                                                <Plus className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <Minus className="h-5 w-5 text-red-600" />
                                            )}
                                        </button>
                                    </td>
                                    <td className={`px-3 py-3 border-r text-center ${rowColor} min-w-[70px]`}>
                                        <div className="text-sm font-bold">
                                            {getTotalScore(student.id, fullGrades, fullLessons, type).toFixed(1)}
                                        </div>
                                    </td>
                                    {lessons.map((lesson) => {
                                        const grade = getGrade(student.id, lesson.id);
                                        const hasComment = grade && (grade as any).comment;

                                        return (
                                            <td
                                                key={lesson.id}
                                                className={`px-3 py-3 border-r text-center cursor-pointer ${cellHoverColor} transition-all ${rowColor} min-w-[120px] relative ${
                                                    quickMode && type === 'lecture' ? 'cursor-pointer ring-1 ring-green-300/50' : ''
                                                }`}
                                                onClick={() => grade && handleCellClickWrapper(student, lesson, grade)}
                                            >
                                                {grade && (
                                                    <div className="flex flex-col items-center justify-center gap-1">
                                                        <div className="flex items-center justify-center">
                                                            <GradeCellDisplay grade={grade} />
                                                        </div>
                                                        <div className="flex gap-1">
                                                            {hasComment && (
                                                                <MessageSquare className="h-3 w-3 text-blue-500" />
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td className={`sticky right-0 z-10 px-4 py-3 border-l text-center min-w-[120px] shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] ${rowColor}`}>
                                        <div className={`text-sm font-bold ${
                                            attendanceRateValue >= 80 ? 'text-green-700' :
                                                attendanceRateValue >= 60 ? 'text-yellow-700' : 'text-red-700'
                                        }`}>
                                            {attendanceRate}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </ScrollArea>
        </div>
    );
}