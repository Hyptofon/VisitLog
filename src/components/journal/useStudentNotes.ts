import { useState } from 'react';
import { toast } from 'sonner';
import { Student, StudentNote } from '@/types';

export const useStudentNotes = (students: Student[]) => {
    const [studentNotes, setStudentNotes] = useState<Record<number, StudentNote[]>>({});
    const [showNotesDialog, setShowNotesDialog] = useState<number | null>(null);

    const addStudentNote = (studentId: number, text: string) => {
        if (!text.trim()) return;

        const note: StudentNote = {
            id: Date.now(),
            text,
            timestamp: new Date().toLocaleString('uk-UA'),
            author: 'Зубенко Ігор Ростиславович'
        };

        setStudentNotes(prev => ({
            ...prev,
            [studentId]: [...(prev[studentId] || []), note]
        }));

        const student = students.find(s => s.id === studentId);
        toast.success(`Примітку додано для ${student?.lastName} ${student?.firstName}`);
    };

    const deleteStudentNote = (studentId: number, noteId: number) => {
        setStudentNotes(prev => ({
            ...prev,
            [studentId]: (prev[studentId] || []).filter(n => n.id !== noteId)
        }));
        toast.success('️Примітку видалено');
    };

    const currentStudentForNotes = students.find(s => s.id === showNotesDialog);

    return {
        studentNotes,
        showNotesDialog,
        setShowNotesDialog,
        addStudentNote,
        deleteStudentNote,
        currentStudentForNotes
    };
};