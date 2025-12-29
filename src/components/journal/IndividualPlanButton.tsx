import { Minus, Plus } from "lucide-react";

interface IndividualPlanButtonProps {
  hasPlan: boolean;
  onToggle: () => void;
}

export function IndividualPlanButton({
  hasPlan,
  onToggle,
}: IndividualPlanButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-center w-full h-full transition-transform hover:scale-110"
    >
      {hasPlan ? (
        <Plus className="h-5 w-5 text-green-600" />
      ) : (
        <Minus className="h-5 w-5 text-red-600" />
      )}
    </button>
  );
}
