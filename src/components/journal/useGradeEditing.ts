import { useState } from 'react';
import { toast } from 'sonner';
import { Grade, Lesson, Student } from '@/types';

interface EditingCell {
    grade: Grade;
    student: Student;
    lesson: Lesson;
}

interface UseGradeEditingProps {
    onGradeUpdate: (grade: Grade) => void;
    addToHistory: (newGrade: Grade, oldGrade: Grade) => void;
}

export const useGradeEditing = ({ onGradeUpdate, addToHistory }: UseGradeEditingProps) => {
    const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
    const [attended, setAttended] = useState(true);
    const [score, setScore] = useState('');
    const [comment, setComment] = useState('');

    const handleCellClick = (student: Student, lesson: Lesson, grade: Grade) => {
        setEditingCell({
            grade,
            student,
            lesson,
        });
        setAttended(grade.attended);
        setScore(grade.score !== null ? grade.score.toString() : '');
        setComment((grade as any).comment || '');
    };

    const handleCloseDialog = () => {
        setEditingCell(null);
        setComment(''); // Скидаємо коментар при закритті
    };

    const handleSave = () => {
        if (!editingCell) return;

        const scoreValue = score === '' ? null : parseFloat(score);
        const oldGrade = editingCell.grade;
        const studentName = `${editingCell.student.lastName} ${editingCell.student.firstName}`;

        // --- ВАША ПЕРЕВІРКА ---
        // Нормалізуємо старий коментар (undefined/null стає порожнім рядком)
        const oldComment = (oldGrade as any).comment || '';

        const hasChanged =
            oldGrade.attended !== attended ||
            oldGrade.score !== scoreValue ||
            oldComment !== comment;

        // Якщо нічого не змінилося, просто закриваємо діалог і нічого не робимо
        if (!hasChanged) {
            handleCloseDialog();
            return;
        }
        // --- КІНЕЦЬ ПЕРЕВІРКИ ---

        const updatedGrade: Grade = {
            ...oldGrade,
            attended: attended,
            score: scoreValue,
            ...(comment && { comment })
        } as any; // `as any` через `comment`

        // Викликаємо історію та оновлення ЛИШЕ ЯКЩО були зміни
        addToHistory(updatedGrade, oldGrade);

        // Логіка сповіщень
        let message = '';
        if (!attended && scoreValue !== null) {
            message = `️ ${studentName} - відсутній, але оцінка ${scoreValue} збережена`;
        } else if (!attended && scoreValue === null) {
            message = `${studentName} - відсутність відмічено`;
        } else if (attended && scoreValue !== null) {
            message = `${studentName} - присутній, оцінка: ${scoreValue}`;
        } else {
            message = `${studentName} - присутність відмічено`;
        }

        if (comment) {
            message += ` "${comment}"`;
        }

        if (!attended && scoreValue !== null) {
            toast.warning(message, { duration: 3000 });
        } else if (!attended) {
            toast.error(message, { duration: 2500 });
        } else {
            toast.success(message, { duration: 2500 });
        }

        onGradeUpdate(updatedGrade);
        handleCloseDialog();
    };

    const adjustScore = (delta: number) => {
        const currentScore = score === '' ? 0 : parseFloat(score);
        const newScore = Math.max(0, currentScore + delta);
        setScore(newScore.toString());
    };

    return {
        editingCell,
        attended,
        setAttended,
        score,
        setScore,
        comment,
        setComment,
        handleCellClick,
        handleCloseDialog,
        handleSave,
        adjustScore
    };
};