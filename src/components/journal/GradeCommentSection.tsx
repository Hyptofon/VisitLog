import { MessageSquare, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface GradeCommentSectionProps {
    comment: string;
    setComment: (value: string) => void;
}

export function GradeCommentSection({ comment, setComment }: GradeCommentSectionProps) {
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
                    onClick={() => setComment('')}
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
                onChange={(e) => setComment(e.target.value)}
                placeholder="Наприклад: здав роботу пізно, відпрацював пропуск, виконав додаткове завдання..."
                rows={3}
                className="resize-none"
            />
            <p className="text-xs text-gray-500">
                Коментар буде відображатися біля оцінки з іконкою
            </p>
        </div>
    );
}