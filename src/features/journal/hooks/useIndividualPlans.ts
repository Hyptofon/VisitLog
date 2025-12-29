import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Student } from "@/types";

export const useIndividualPlans = (students: Student[]) => {
  const [individualPlans, setIndividualPlans] = useState<
    Record<number, boolean>
  >({});

  const toggleIndividualPlan = useCallback(
    (studentId: number) => {
      setIndividualPlans((prev) => {
        const newStatus = !prev[studentId];
        const updated = { ...prev, [studentId]: newStatus };

        const student = students.find((s) => s.id === studentId);
        if (student) {
          toast.success(
            newStatus
              ? `${student.lastName} ${student.firstName} - індивідуальний план активовано`
              : `${student.lastName} ${student.firstName} - індивідуальний план деактивовано`,
            { duration: 2000 },
          );
        }
        return updated;
      });
    },
    [students],
  );

  return { individualPlans, toggleIndividualPlan };
};
