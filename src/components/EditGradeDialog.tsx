import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Minus, Plus } from 'lucide-react';
import { Grade } from '@/types';

interface EditGradeDialogProps {
    open: boolean;
    onClose: () => void;
    grade: Grade | null;
    studentName: string;
    lessonDate: string;
    onSave: (score: number | null, extraPoints: number, attended: boolean) => void;
}

export function EditGradeDialog({
                                    open,
                                    onClose,
                                    grade,
                                    studentName,
                                    lessonDate,
                                    onSave,
                                }: EditGradeDialogProps) {
    const [score, setScore] = useState<string>('');
    const [extraPoints, setExtraPoints] = useState<number>(0);
    const [attended, setAttended] = useState<boolean>(true);

    // Update local state when grade changes
    useState(() => {
        if (grade) {
            setScore(grade.score !== null ? grade.score.toString() : '');
            setExtraPoints(grade.extraPoints);
            setAttended(grade.attended);
        }
    });

    const handleSave = () => {
        const scoreValue = score === '' ? null : parseInt(score);
        onSave(scoreValue, extraPoints, attended);
        onClose();
    };

    const adjustScore = (delta: number) => {
        const currentScore = score === '' ? 0 : parseInt(score);
        const newScore = Math.max(0, Math.min(10, currentScore + delta));
        setScore(newScore.toString());
    };

    const adjustExtraPoints = (delta: number) => {
        setExtraPoints(Math.max(0, Math.min(10, extraPoints + delta)));
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Редагування оцінки</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                        {studentName} - {lessonDate}
                    </p>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Attendance */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="attended"
                            checked={attended}
                            onChange={(e) => setAttended(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="attended">Студент був присутній</Label>
                    </div>

                    {attended && (
                        <>
                            {/* Score */}
                            <div className="space-y-2">
                                <Label>Оцінка (0-10)</Label>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => adjustScore(-1)}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={score}
                                        onChange={(e) => setScore(e.target.value)}
                                        className="text-center"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => adjustScore(1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Quick select */}
                                <div className="flex flex-wrap gap-2">
                                    {[0, 5, 6, 7, 8, 9, 10].map((value) => (
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

                            {/* Extra Points */}
                            <div className="space-y-2">
                                <Label>Додаткові бали (0-10)</Label>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => adjustExtraPoints(-1)}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={extraPoints}
                                        onChange={(e) => setExtraPoints(parseInt(e.target.value) || 0)}
                                        className="text-center"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => adjustExtraPoints(1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Скасувати
                    </Button>
                    <Button onClick={handleSave}>
                        Зберегти
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
