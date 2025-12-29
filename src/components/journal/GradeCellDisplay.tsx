import { memo } from "react";
import { Check, X } from "lucide-react";
import { Grade } from "@/types";

interface GradeCellDisplayProps {
  grade: Grade;
}

export const GradeCellDisplay = memo(function GradeCellDisplay({
  grade,
}: GradeCellDisplayProps) {
  if (!grade.attended && grade.score === null) {
    return <X className="h-5 w-5 text-red-600" />;
  }

  if (grade.score !== null) {
    return (
      <div className="flex flex-col items-center">
        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
          {grade.score}
        </span>
        {!grade.attended && <X className="h-3 w-3 text-red-500 -mt-1" />}
      </div>
    );
  }

  return <Check className="h-5 w-5 text-green-600" />;
});
