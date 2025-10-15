export interface Student {
    id: number;
    firstName: string;
    lastName: string;
    patronymic: string;
}

export interface Lesson {
    id: number;
    date: string;
    type: 'lecture' | 'practical';
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
