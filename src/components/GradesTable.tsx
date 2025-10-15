import { useState, useMemo } from 'react';
import { Student, Lesson, Grade } from '@/types';
import { DatePagination } from './DatePagination';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Minus, Plus } from 'lucide-react';

interface GradesTableProps {
    students: Student[];
    lessons: Lesson[];
    grades: Grade[];
    onGradeUpdate: (grade: Grade) => void;
    searchQuery: string;
}

const LESSONS_PER_PAGE = 10;

export function GradesTable({
                                students,
                                lessons,
                                grades,
                                onGradeUpdate,
                                searchQuery,
                            }: GradesTableProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [editingCell, setEditingCell] = useState<{
        grade: Grade;
        studentName: string;
        lessonDate: string;
    } | null>(null);
    const [score, setScore] = useState('');
    const [extraPoints, setExtraPoints] = useState(0);

    // Filter students by search query
    const filteredStudents = useMemo(() => {
        if (!searchQuery) return students;
        const query = searchQuery.toLowerCase();
        return students.filter(student =>
            `${student.lastName} ${student.firstName} ${student.patronymic}`.toLowerCase().includes(query)
        );
    }, [students, searchQuery]);

    // Paginate lessons
    const totalPages = Math.ceil(lessons.length / LESSONS_PER_PAGE);
    const paginatedLessons = lessons.slice(
        currentPage * LESSONS_PER_PAGE,
        (currentPage + 1) * LESSONS_PER_PAGE
    );

    const getGrade = (studentId: number, lessonId: number): Grade | undefined => {
        return grades.find(g => g.studentId === studentId && g.lessonId === lessonId);
    };

    const calculateAverageGrade = (studentId: number): string => {
        const studentGrades = grades.filter(g =>
            g.studentId === studentId &&
            g.attended &&
            g.score !== null
        );

        if (studentGrades.length === 0) return '-';

        const sum = studentGrades.reduce((acc, g) => acc + (g.score || 0) + g.extraPoints, 0);
        return (sum / studentGrades.length).toFixed(1);
    };

    const handleCellClick = (studentId: number, lessonId: number) => {
        const grade = getGrade(studentId, lessonId);
        if (!grade || !grade.attended) return;

        const student = students.find(s => s.id === studentId);
        const lesson = lessons.find(l => l.id === lessonId);

        if (student && lesson) {
            setEditingCell({
                grade,
                studentName: `${student.lastName} ${student.firstName} ${student.patronymic}`,
                lessonDate: lesson.date,
            });
            setScore(grade.score !== null ? grade.score.toString() : '');
            setExtraPoints(grade.extraPoints);
        }
    };

    const handleSave = () => {
        if (editingCell) {
            const scoreValue = score === '' ? null : parseInt(score);
            onGradeUpdate({
                ...editingCell.grade,
                score: scoreValue,
                extraPoints,
            });
            setEditingCell(null);
        }
    };

    const adjustScore = (delta: number) => {
        const currentScore = score === '' ? 0 : parseInt(score);
        const newScore = Math.max(0, currentScore + delta);
        setScore(newScore.toString());
    };

    const adjustExtraPoints = (delta: number) => {
        setExtraPoints(Math.max(0, extraPoints + delta));
    };

    return (
        <>
            <Card className="overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h3>Журнал оцінок</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Натисніть на комірку для редагування оцінки
                            </p>
                        </div>
                        <DatePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block">
                    <ScrollArea className="w-full">
                        <div className="min-w-max">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className="bg-gray-100 border-b">
                                    <th className="sticky left-0 bg-gray-100 z-20 px-4 py-3 text-left border-r">
                                        <div className="text-sm">№</div>
                                    </th>
                                    <th className="sticky left-12 bg-gray-100 z-20 px-4 py-3 text-left border-r min-w-[280px]">
                                        <div className="text-sm">Студент</div>
                                    </th>
                                    <th className="px-3 py-3 border-r bg-gray-100">
                                        <div className="text-sm">Індивідуальний план</div>
                                    </th>
                                    <th className="px-3 py-3 border-r bg-gray-100">
                                        <div className="text-sm">Сума</div>
                                    </th>
                                    <th className="px-3 py-3 border-r bg-gray-100">
                                        <div className="text-sm">Дод. оцінка</div>
                                    </th>
                                    {paginatedLessons.map((lesson) => (
                                        <th key={lesson.id} className="px-3 py-3 border-r bg-blue-50">
                                            <div className="text-sm whitespace-nowrap">{lesson.date}</div>
                                        </th>
                                    ))}
                                    <th className="sticky right-0 bg-gray-100 z-10 px-4 py-3 border-l">
                                        <div className="text-sm">Середній бал</div>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredStudents.map((student, idx) => (
                                    <tr
                                        key={student.id}
                                        className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50/30 transition-colors`}
                                    >
                                        <td className="sticky left-0 z-10 px-4 py-3 border-r bg-inherit">
                                            <div className="text-sm">{idx + 1}</div>
                                        </td>
                                        <td className="sticky left-12 z-10 px-4 py-3 border-r bg-inherit min-w-[280px]">
                                            <div className="text-sm">
                                                {student.lastName} {student.firstName} {student.patronymic}
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 border-r text-center bg-inherit">
                                            <div className="text-sm text-gray-400">0</div>
                                        </td>
                                        <td className="px-3 py-3 border-r text-center bg-inherit">
                                            <div className="text-sm">
                                                {grades
                                                    .filter(g => g.studentId === student.id && g.attended && g.score !== null)
                                                    .reduce((sum, g) => sum + (g.score || 0) + g.extraPoints, 0)}
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 border-r text-center bg-inherit">
                                            <div className="text-sm">
                                                {grades
                                                    .filter(g => g.studentId === student.id)
                                                    .reduce((sum, g) => sum + g.extraPoints, 0)}
                                            </div>
                                        </td>
                                        {paginatedLessons.map((lesson) => {
                                            const grade = getGrade(student.id, lesson.id);
                                            const canEdit = grade?.attended;
                                            return (
                                                <td
                                                    key={lesson.id}
                                                    className={`px-3 py-3 border-r text-center bg-inherit ${
                                                        canEdit ? 'cursor-pointer hover:bg-blue-100/50 transition-colors' : ''
                                                    }`}
                                                    onClick={() => canEdit && handleCellClick(student.id, lesson.id)}
                                                >
                                                    {grade && grade.attended && (
                                                        <div className="text-sm">
                                                            {grade.score !== null ? (
                                                                <span>
                                                                    {grade.score}
                                                                        {grade.extraPoints > 0 && (
                                                                            <span className="text-xs text-green-600 ml-1">
                                                                                +{grade.extraPoints}
                                                                            </span>
                                                                    )   }
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400">0</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {grade && !grade.attended && (
                                                        <div className="text-gray-400 text-sm">н/б</div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="sticky right-0 z-10 px-4 py-3 border-l text-center bg-inherit">
                                            <div className="text-sm">
                                                {calculateAverageGrade(student.id)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </ScrollArea>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden p-4 space-y-4">
                    {filteredStudents.map((student, idx) => (
                        <Card key={student.id} className="p-4">
                            <div className="mb-3 pb-3 border-b">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="text-sm text-muted-foreground">#{idx + 1}</div>
                                        <div className="text-sm mt-1">
                                            {student.lastName} {student.firstName} {student.patronymic}
                                        </div>
                                    </div>
                                    <div className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-700">
                                        Сер: {calculateAverageGrade(student.id)}
                                    </div>
                                </div>
                            </div>

                            <ScrollArea className="w-full">
                                <div className="flex gap-2 pb-2">
                                    {paginatedLessons.map((lesson) => {
                                        const grade = getGrade(student.id, lesson.id);
                                        const canEdit = grade?.attended;
                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => canEdit && handleCellClick(student.id, lesson.id)}
                                                disabled={!canEdit}
                                                className="flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded border hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                <div className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {lesson.date}
                                                </div>
                                                {grade && grade.attended && (
                                                    <div className="text-sm">
                                                        {grade.score !== null ? (
                                                            <div>
                                                                {grade.score}
                                                                {grade.extraPoints > 0 && (
                                                                    <span className="text-xs text-green-600">+{grade.extraPoints}</span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">0</span>
                                                        )}
                                                    </div>
                                                )}
                                                {grade && !grade.attended && (
                                                    <div className="text-gray-400 text-sm">н/б</div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </Card>
                    ))}
                </div>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={editingCell !== null} onOpenChange={() => setEditingCell(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Редагування оцінки</DialogTitle>
                        <p className="text-sm text-muted-foreground mt-2">
                            {editingCell?.studentName} - {editingCell?.lessonDate}
                        </p>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Score */}
                        <div className="space-y-2">
                            <Label>Оцінка</Label>
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
                                    value={score}
                                    onChange={(e) => setScore(e.target.value)}
                                    className="text-center"
                                    placeholder="Введіть оцінку"
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
                                {[0, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((value) => (
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
                            <Label>Додаткові бали</Label>
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
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingCell(null)}>
                            Скасувати
                        </Button>
                        <Button onClick={handleSave}>
                            Зберегти
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
