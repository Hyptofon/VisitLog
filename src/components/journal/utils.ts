import { Grade, Lesson } from '@/types';
import { getTodayHighlightColors } from '@/utils/dateUtils'

export const calculateAttendanceRate = (
    studentId: number,
    grades: Grade[],
    lessons: Lesson[],
    type: 'lecture' | 'practical' | 'laboratory' | 'all'
): string => {
    const relevantLessons = type === 'all'
        ? lessons
        : lessons.filter(l => l.type === type);

    const relevantLessonIds = new Set(relevantLessons.map(l => l.id));

    const studentGrades = grades.filter(g =>
        g.studentId === studentId && relevantLessonIds.has(g.lessonId)
    );

    if (studentGrades.length === 0) return '0%';
    const attendedCount = studentGrades.filter(g => g.attended).length;
    return `${Math.round((attendedCount / studentGrades.length) * 100)}%`;
};

export const getTotalScore = (
    studentId: number,
    grades: Grade[],
    lessons: Lesson[],
    type: 'lecture' | 'practical' | 'laboratory' | 'all'
): number => {
    const relevantLessonIds = type === 'all'
        ? new Set(lessons.map(l => l.id))
        : new Set(lessons.filter(l => l.type === type).map(l => l.id));

    return grades
        .filter(g => g.studentId === studentId && relevantLessonIds.has(g.lessonId))
        .reduce((sum, g) => sum + (g.score || 0), 0);
};

export const getHeaderColor = (type: string) => {
    switch(type) {
        case 'lecture': return 'bg-green-100 dark:bg-green-900/50';
        case 'practical': return 'bg-blue-100 dark:bg-blue-900/50';
        case 'laboratory': return 'bg-purple-100 dark:bg-purple-900/50';
        case 'all': return 'bg-gray-100 dark:bg-gray-800/50'; // Колір для загального режиму
        default: return 'bg-gray-100 dark:bg-gray-800/50';
    }
};

export const getCellHoverColor = (type: string) => {
    switch(type) {
        case 'lecture': return 'hover:bg-green-50 dark:hover:bg-green-900/30';
        case 'practical': return 'hover:bg-blue-50 dark:hover:bg-blue-900/30';
        case 'laboratory': return 'hover:bg-purple-50 dark:hover:bg-purple-900/30';
        default: return 'hover:bg-gray-50 dark:hover:bg-gray-900/20';
    }
};

export const getRowColor = (idx: number, type: string) => {
    if (idx % 2 !== 0) {
        switch(type) {
            case 'lecture': return 'bg-green-50 dark:bg-gray-800';
            case 'practical': return 'bg-blue-50 dark:bg-gray-800';
            case 'laboratory': return 'bg-purple-50 dark:bg-gray-800';
            case 'all': return 'bg-gray-100 dark:bg-gray-800';
            default: return 'bg-gray-100 dark:bg-gray-800';
        }
    }
    return 'bg-background dark:bg-gray-900';
};

export const getLessonSpecificHeaderColor = (lessonType: 'lecture' | 'practical' | 'laboratory') => {
    return getHeaderColor(lessonType);
};

export const getLessonSpecificTodayHighlightColors = (lessonType: 'lecture' | 'practical' | 'laboratory') => {
    return getTodayHighlightColors(lessonType);
}