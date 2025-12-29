import { memo } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { StudentNote } from "@/types";

interface NoteItemProps {
  note: StudentNote;
  onDelete: (noteId: number) => void;
  showDelete: boolean;
}

export const NoteItem = memo(function NoteItem({
  note,
  onDelete,
  showDelete,
}: NoteItemProps) {
  return (
    <Card className="p-3">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <p className="text-sm">{note.text}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <span>{note.author}</span>
            <span>•</span>
            <span>{note.timestamp}</span>
          </div>
        </div>
        {showDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(note.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
});
