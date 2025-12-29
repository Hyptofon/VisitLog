import { StickyNote } from "lucide-react";

interface StudentNotesButtonProps {
  noteCount: number;
  onClick: () => void;
}

export function StudentNotesButton({
  noteCount,
  onClick,
}: StudentNotesButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-full h-full transition-transform hover:scale-110 relative"
    >
      <StickyNote className="h-5 w-5 text-blue-600" />
      {noteCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {noteCount}
        </span>
      )}
    </button>
  );
}
