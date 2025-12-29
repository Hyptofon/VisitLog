import { Calendar } from 'lucide-react';
import { Lesson } from '@/types';
import { getLessonSpecificHeaderColor, getLessonSpecificTodayHighlightColors } from './utils';
import { isSameDate, getTodayHighlightColors } from '@/utils/dateUtils';

interface JournalHeaderCellProps {
    lesson: Lesson;
    type: 'lecture' | 'practical' | 'laboratory' | 'all';
    headerColor: string;
    currentDate: string;
}

export function JournalHeaderCell({ lesson, type, headerColor, currentDate }: JournalHeaderCellProps) {
    const isToday = isSameDate(lesson.date, currentDate);
    const lessonHeaderColor = type === 'all' ? getLessonSpecificHeaderColor(lesson.type) : headerColor;
    const lessonTodayColors = type === 'all' ? getLessonSpecificTodayHighlightColors(lesson.type) : getTodayHighlightColors(type);

    return (
        <th
            className={`px-3 py-3 border-r border-b min-w-[100px] text-center relative transition-colors ${
                isToday
                    ? `${lessonTodayColors.header} ${lessonTodayColors.headerRing}`
                    : lessonHeaderColor
            }`}
        >
            <div className="text-sm font-semibold whitespace-nowrap flex items-center justify-center gap-1.5">
                {isToday && <Calendar className={`h-4 w-4 ${lessonTodayColors.iconColor}`} />}
                {lesson.date}
            </div>
            {type === 'all' && (
                <div className="text-xs font-normal opacity-75 capitalize mt-1">
                    {lesson.type === 'lecture' ? 'Л' : lesson.type === 'practical' ? 'П' : 'Лаб'}
                </div>
            )}
            {isToday && (
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${lessonTodayColors.indicator}`}></div>
            )}
        </th>
    );
}