import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Grade, Lesson, Student } from '@/types';
import { ScoreInput } from './ScoreInput';
import { GradeCommentSection } from './GradeCommentSection';

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
                        <ScoreInput
                            score={score}
                            setScore={setScore}
                            adjustScore={adjustScore}
                        />
                    </div>

                    <GradeCommentSection
                        comment={comment}
                        setComment={setComment}
                    />
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