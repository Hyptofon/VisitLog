import { useState } from 'react';
import { Grade, GradeHistory } from '@/types';

export const useGradeHistory = () => {
    const [gradeHistory, setGradeHistory] = useState<Record<string, GradeHistory[]>>({});
    const [showHistoryDialog, setShowHistoryDialog] = useState(false);
    const [currentHistory, setCurrentHistory] = useState<GradeHistory[]>([]);

    const addToHistory = (grade: Grade, oldGrade: Grade) => {
        const historyKey = `${grade.studentId}-${grade.lessonId}`;
        const newHistoryEntry: GradeHistory = {
            timestamp: new Date().toLocaleString('uk-UA'),
            oldValue: {
                attended: oldGrade.attended,
                score: oldGrade.score,
                comment: (oldGrade as any).comment
            },
            newValue: {
                attended: grade.attended,
                score: grade.score,
                comment: (grade as any).comment
            },
            changedBy: 'Викладач' // Можна замінити на реального користувача
        };

        setGradeHistory(prev => ({
            ...prev,
            [historyKey]: [...(prev[historyKey] || []), newHistoryEntry]
        }));
    };

    const showHistory = (studentId: number, lessonId: number) => {
        const historyKey = `${studentId}-${lessonId}`;
        setCurrentHistory(gradeHistory[historyKey] || []);
        setShowHistoryDialog(true);
    };

    return {
        gradeHistory,
        showHistoryDialog,
        currentHistory,
        addToHistory,
        showHistory,
        setShowHistoryDialog
    };
};