import { Minus, Plus, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Grade, Lesson, Student } from '@/types';

interface EditingCellInfo {
    grade: Grade;
    student: Student;
    lesson: Lesson;
}

interface EditGradeDialogProps {
    editingCell: EditingCellInfo | null;
    attended: boolean;
    setAttended: (value: boolean) => void;
    score: string;
    setScore: (value: string) => void;
    comment: string;
    setComment: (value: string) => void;
    onSave: () => void;
    onClose: () => void;
    adjustScore: (delta: number) => void;
}

const PRESET_SCORES_MAIN = [5, 6, 7, 8, 9, 10, 12, 15, 20];
const PRESET_SCORES_HALF = [4.5, 5.5, 6.5, 7.5, 8.5, 9.5];

export function EditGradeDialog({
                                    editingCell,
                                    attended,
                                    setAttended,
                                    score,
                                    setScore,
                                    comment,
                                    setComment,
                                    onSave,
                                    onClose,
                                    adjustScore
                                }: EditGradeDialogProps) {

    const studentName = editingCell ? `${editingCell.student.lastName} ${editingCell.student.firstName} ${editingCell.student.patronymic}` : '';
    const lessonDate = editingCell ? editingCell.lesson.date : '';

    return (
        <Dialog open={editingCell !== null} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Редагування даних</DialogTitle>
                    <p className="text-sm text-gray-500 mt-2">
                        {studentName} - {lessonDate}
                    </p>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="attended"
                            checked={attended}
                            onChange={(e) => setAttended(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="attended">Студент був присутній</Label>
                    </div>

                    <div className="space-y-2">
                        <Label>Оцінка {!attended && '(можна поставити навіть якщо відсутній)'}</Label>
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" size="icon" onClick={() => adjustScore(-0.5)}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                                type="number"
                                min="0"
                                step="0.5"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                                className="text-center"
                                placeholder="-"
                            />
                            <Button type="button" variant="outline" size="icon" onClick={() => adjustScore(0.5)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {PRESET_SCORES_MAIN.map((value) => (
                                <Button
                                    key={value}
                                    type="button"
                                    variant={score === value.toString() ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setScore(value.toString())}
                                >
                                    {value}
                                </Button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {PRESET_SCORES_HALF.map((value) => (
                                <Button
                                    key={value}
                                    type="button"
                                    variant={score === value.toString() ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setScore(value.toString())}
                                >
                                    {value}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment" className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Коментар до оцінки
                        </Label>
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
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Скасувати
                    </Button>
                    <Button onClick={onSave}>
                        Зберегти
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}