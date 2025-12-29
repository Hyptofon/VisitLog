import { memo, useCallback } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";

interface GradeCommentSectionProps {
  comment: string;
  setComment: (value: string) => void;
}

export const GradeCommentSection = memo(function GradeCommentSection({
  comment,
  setComment,
}: GradeCommentSectionProps) {
  const handleClearComment = useCallback(() => {
    setComment("");
  }, [setComment]);

  const handleCommentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setComment(e.target.value);
    },
    [setComment],
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="comment" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Коментар до оцінки
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClearComment}
          disabled={!comment}
          className="text-xs text-gray-500 hover:text-gray-800 h-7 px-2"
        >
          <X className="h-3 w-3 mr-1" />
          Очистити
        </Button>
      </div>
      <Textarea
        id="comment"
        value={comment}
        onChange={handleCommentChange}
        placeholder="Наприклад: здав роботу пізно, відпрацював пропуск, виконав додаткове завдання..."
        rows={3}
        className="resize-none"
      />
      <p className="text-xs text-gray-500">
        Коментар буде відображатися біля оцінки з іконкою
      </p>
    </div>
  );
});
