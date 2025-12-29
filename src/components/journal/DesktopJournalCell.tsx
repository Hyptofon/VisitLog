import { MessageSquare } from 'lucide-react';
import { Student, Lesson, Grade } from '@/types';
import { getCellHoverColor } from './utils';
import { isSameDate, getTodayHighlightColors } from '@/utils/dateUtils';
import { GradeCellDisplay } from './GradeCellDisplay';

interface DesktopJournalCellProps {
    student: Student;
    lesson: Lesson;
    grade: Grade | undefined;
    type: 'lecture' | 'practical' | 'laboratory' | 'all';
    rowColor: string;
    quickMode: boolean;
    currentDate: string;
    onCellClick: (student: Student, lesson: Lesson, grade: Grade) => void;
    onQuickToggle?: (student: Student, lesson: Lesson, grade: Grade) => boolean;
}

export function DesktopJournalCell({
                                       student,
                                       lesson,
                                       grade,
                                       type,
                                       rowColor,
                                       quickMode,
                                       currentDate,
                                       onCellClick,
                                       onQuickToggle
                                   }: DesktopJournalCellProps) {

    const handleCellClickWrapper = () => {
        if (!grade) return;

        if (quickMode && lesson.type === 'lecture' && onQuickToggle) {
            const handled = onQuickToggle(student, lesson, grade);
            if (handled) return;
        }
        onCellClick(student, lesson, grade);
    };

    const hasComment = grade && grade.comment;
    const isToday = isSameDate(lesson.date, currentDate);
    const lessonCellHover = getCellHoverColor(lesson.type);
    const lessonTodayColors = getTodayHighlightColors(lesson.type);
    const baseBg = 'bg-background dark:bg-gray-900';

    return (
        <td
            className={`px-3 py-3 border-r dark:border-gray-700 text-center cursor-pointer transition-all min-w-[120px] relative ${
                type === 'all' ? lessonCellHover : getCellHoverColor(type)
            } ${baseBg} ${rowColor} ${
                quickMode && lesson.type === 'lecture'
                    ? 'cursor-pointer'
                    : ''
            } ${
                isToday
                    ? `${lessonTodayColors.cell} ${lessonTodayColors.cellRing}`
                    : ''
            }`}
            onClick={handleCellClickWrapper}
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
            {isToday && (
                <div className={`absolute inset-0 ${lessonTodayColors.cellBorder} pointer-events-none rounded-md`}></div>
            )}
        </td>
    );
}