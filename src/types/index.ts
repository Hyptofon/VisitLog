export interface Student {
    id: number;
    firstName: string;
    lastName: string;
    patronymic: string;
}

export interface Lesson {
    id: number;
    date: string;
    type: 'lecture' | 'practical' | 'laboratory';
    number: number;
}

export interface Grade {
    studentId: number;
    lessonId: number;
    score: number | null;
    extraPoints: number;
    attended: boolean;
}

export interface StudentStats {
    studentId: number;
    averageGrade: number;
    attendanceRate: number;
    totalAbsences: number;
}

export interface GradeHistory {
    timestamp: string;
    oldValue: {
        attended: boolean;
        score: number | null;
        comment?: string;
    };
    newValue: {
        attended: boolean;
        score: number | null;
        comment?: string;
    };
    changedBy: string;
}

export interface StudentNote {
    id: number;
    text: string;
    timestamp: string;
    author: string;
}