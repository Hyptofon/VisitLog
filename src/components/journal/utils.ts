import { Grade, Lesson } from '@/types';

/**
 * Розраховує відсоток відвідуваності для студента за певним типом занять.
 */
export const calculateAttendanceRate = (
    studentId: number,
    grades: Grade[],
    lessons: Lesson[],
    type: 'lecture' | 'practical' | 'laboratory'
): string => {
    const studentGrades = grades.filter(g =>
        g.studentId === studentId && lessons.some(l => l.id === g.lessonId && l.type === type)
    );
    if (studentGrades.length === 0) return '0%';
    const attendedCount = studentGrades.filter(g => g.attended).length;
    return `${Math.round((attendedCount / studentGrades.length) * 100)}%`;
};

/**
 * Розраховує загальну суму балів для студента за певним типом занять.
 */
export const getTotalScore = (
    studentId: number,
    grades: Grade[],
    lessons: Lesson[],
    type: 'lecture' | 'practical' | 'laboratory'
): number => {
    return grades
        .filter(g => g.studentId === studentId && lessons.some(l => l.id === g.lessonId && l.type === type))
        .reduce((sum, g) => sum + (g.score || 0), 0);
};

// --- Функції для кольорів ---

export const getHeaderColor = (type: string) => {
    switch(type) {
        case 'lecture': return 'bg-green-100';
        case 'practical': return 'bg-blue-100';
        case 'laboratory': return 'bg-purple-100';
        default: return 'bg-blue-100';
    }
};

export const getCellHoverColor = (type: string) => {
    switch(type) {
        case 'lecture': return 'hover:bg-green-50';
        case 'practical': return 'hover:bg-blue-50';
        case 'laboratory': return 'hover:bg-purple-50';
        default: return 'hover:bg-blue-50';
    }
};

export const getRowColor = (idx: number, type: string) => {
    if (idx % 2 === 0) {
        switch(type) {
            case 'lecture': return 'bg-green-50/30';
            case 'practical': return 'bg-blue-50/30';
            case 'laboratory': return 'bg-purple-50/30';
            default: return 'bg-white';
        }
    } else {
        switch(type) {
            case 'lecture': return 'bg-green-50/50';
            case 'practical': return 'bg-blue-50/50';
            case 'laboratory': return 'bg-purple-50/50';
            default: return 'bg-gray-50';
        }
    }
};