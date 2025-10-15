import { useState, useMemo } from 'react';
import { Student, Lesson, Grade } from '@/types';
import { Check, X } from 'lucide-react';
import { DatePagination } from './DatePagination';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Minus, Plus } from 'lucide-react';

interface AttendanceTableProps {
    students: Student[];
    lessons: Lesson[];
    grades: Grade[];
    onGradeUpdate: (grade: Grade) => void;
    searchQuery: string;
    type: 'lecture' | 'practical';
}

const LESSONS_PER_PAGE = 6;

export function AttendanceTable({
                                    students,
                                    lessons,
                                    grades,
                                    onGradeUpdate,
                                    searchQuery,
                                    type,
                                }: AttendanceTableProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [editingCell, setEditingCell] = useState<{
        grade: Grade;
        studentName: string;
        lessonDate: string;
        isExtraPoints: boolean;
    } | null>(null);
    const [attended, setAttended] = useState(true);
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

    const calculateAttendanceRate = (studentId: number): string => {
        const studentGrades = grades.filter(g => g.studentId === studentId);
        const attended = studentGrades.filter(g => g.attended).length;
        const total = studentGrades.length;
        return total > 0 ? `${Math.round((attended / total) * 100)}%` : '0%';
    };

    const handleCellClick = (studentId: number, lessonId: number, isExtraPoints: boolean = false) => {
        const grade = getGrade(studentId, lessonId);
        if (!grade) return;

        const student = students.find(s => s.id === studentId);
        const lesson = lessons.find(l => l.id === lessonId);

        if (student && lesson) {
            setEditingCell({
                grade,
                studentName: `${student.lastName} ${student.firstName} ${student.patronymic}`,
                lessonDate: lesson.date,
                isExtraPoints,
            });
            setAttended(grade.attended);
            setExtraPoints(grade.extraPoints);
        }
    };

    const handleSave = () => {
        if (editingCell) {
            if (editingCell.isExtraPoints) {
                // Only update extra points for lectures
                onGradeUpdate({
                    ...editingCell.grade,
                    extraPoints,
                });
            } else {
                // Update attendance
                onGradeUpdate({
                    ...editingCell.grade,
                    attended,
                });
            }
            setEditingCell(null);
        }
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
                            <h3>Журнал відвідування</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Натисніть на комірку для редагування
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
                                    {type === 'lecture' && (
                                        <>
                                            <th className="px-3 py-3 border-r bg-gray-100">
                                                <div className="text-sm">Індивідуальний план</div>
                                            </th>
                                            <th className="px-3 py-3 border-r bg-gray-100">
                                                <div className="text-sm">Сума</div>
                                            </th>
                                            <th className="px-3 py-3 border-r bg-gray-100">
                                                <div className="text-sm">Дод. оцінка</div>
                                            </th>
                                        </>
                                    )}
                                    {paginatedLessons.map((lesson) => (
                                        <th key={lesson.id} className="px-3 py-3 border-r bg-blue-50">
                                            <div className="text-sm whitespace-nowrap">{lesson.date}</div>
                                        </th>
                                    ))}
                                    <th className="sticky right-0 bg-gray-100 z-10 px-4 py-3 border-l">
                                        <div className="text-sm">Відвідування</div>
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
                                        {type === 'lecture' && (
                                            <>
                                                <td className="px-3 py-3 border-r text-center bg-inherit">
                                                    <div className="text-sm">0</div>
                                                </td>
                                                <td className="px-3 py-3 border-r text-center bg-inherit">
                                                    <div className="text-sm">
                                                        {grades
                                                            .filter(g => g.studentId === student.id)
                                                            .reduce((sum, g) => sum + g.extraPoints, 0)}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-3 py-3 border-r text-center bg-inherit cursor-pointer hover:bg-blue-100/50"
                                                    onClick={() => handleCellClick(student.id, paginatedLessons[0]?.id, true)}
                                                >
                                                    <div className="text-sm">
                                                        {grades
                                                            .filter(g => g.studentId === student.id)
                                                            .reduce((sum, g) => sum + g.extraPoints, 0)}
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                        {paginatedLessons.map((lesson) => {
                                            const grade = getGrade(student.id, lesson.id);
                                            return (
                                                <td
                                                    key={lesson.id}
                                                    className="px-3 py-3 border-r text-center cursor-pointer hover:bg-blue-100/50 transition-colors bg-inherit"
                                                    onClick={() => handleCellClick(student.id, lesson.id, false)}
                                                >
                                                    {grade && (
                                                        <div className="flex items-center justify-center">
                                                            {grade.attended ? (
                                                                <Check className="h-5 w-5 text-green-500" />
                                                            ) : (
                                                                <X className="h-5 w-5 text-red-500" />
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="sticky right-0 z-10 px-4 py-3 border-l text-center bg-inherit">
                                            <div className={`text-sm ${
                                                parseInt(calculateAttendanceRate(student.id)) >= 80
                                                    ? 'text-green-600'
                                                    : parseInt(calculateAttendanceRate(student.id)) >= 60
                                                        ? 'text-yellow-600'
                                                        : 'text-red-600'
                                            }`}>
                                                {calculateAttendanceRate(student.id)}
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
                                    <div className={`text-sm px-2 py-1 rounded ${
                                        parseInt(calculateAttendanceRate(student.id)) >= 80
                                            ? 'bg-green-100 text-green-700'
                                            : parseInt(calculateAttendanceRate(student.id)) >= 60
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                    }`}>
                                        {calculateAttendanceRate(student.id)}
                                    </div>
                                </div>
                            </div>

                            <ScrollArea className="w-full">
                                <div className="flex gap-2 pb-2">
                                    {paginatedLessons.map((lesson) => {
                                        const grade = getGrade(student.id, lesson.id);
                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => handleCellClick(student.id, lesson.id, false)}
                                                className="flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded border hover:bg-gray-50"
                                            >
                                                <div className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {lesson.date}
                                                </div>
                                                {grade && (
                                                    <div>
                                                        {grade.attended ? (
                                                            <Check className="h-5 w-5 text-green-500" />
                                                        ) : (
                                                            <X className="h-5 w-5 text-red-500" />
                                                        )}
                                                    </div>
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
                        <DialogTitle>
                            {editingCell?.isExtraPoints ? 'Редагування додаткових балів' : 'Редагування відвідування'}
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-2">
                            {editingCell?.studentName} - {editingCell?.lessonDate}
                        </p>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {editingCell?.isExtraPoints ? (
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
                        ) : (
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
                        )}
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
