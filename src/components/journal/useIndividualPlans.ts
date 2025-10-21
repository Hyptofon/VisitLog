import { useState } from 'react';
import { toast } from 'sonner';
import { Student } from '@/types';

export const useIndividualPlans = (students: Student[]) => {
    const [individualPlans, setIndividualPlans] = useState<Record<number, boolean>>({});

    const toggleIndividualPlan = (studentId: number) => {
        setIndividualPlans(prev => ({ ...prev, [studentId]: !prev[studentId] }));

        const student = students.find(s => s.id === studentId);
        if (student) {
            const newStatus = !individualPlans[studentId];
            toast.success(
                newStatus
                    ? `${student.lastName} ${student.firstName} - індивідуальний план активовано`
                    : `${student.lastName} ${student.firstName} - індивідуальний план деактивовано`,
                { duration: 2000 }
            );
        }
    };

    return { individualPlans, toggleIndividualPlan };
};