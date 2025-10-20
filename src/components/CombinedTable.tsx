import { useState, useMemo } from 'react';
import { Check, X, Minus, Plus, MessageSquare, History, StickyNote } from 'lucide-react';
import { Student, Lesson, Grade, GradeHistory, StudentNote } from '@/types';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { DatePagination } from './DatePagination';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface CombinedTableProps {
    students: Student[];
    lessons: Lesson[];
    grades: Grade[];
    onGradeUpdate: (grade: Grade) => void;
    searchQuery: string;
    type: 'lecture' | 'practical' | 'laboratory';
}

const LESSONS_PER_PAGE = 6;

export function CombinedTable({
                                  students,
                                  lessons,
                                  grades,
                                  onGradeUpdate,
                                  searchQuery,
                                  type,
                              }: CombinedTableProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [editingCell, setEditingCell] = useState<{
        grade: Grade;
        studentName: string;
        lessonDate: string;
    } | null>(null);

    const [attended, setAttended] = useState(true);
    const [score, setScore] = useState('');
    const [comment, setComment] = useState('');
    const [individualPlans, setIndividualPlans] = useState<Record<number, boolean>>({});

    const [gradeHistory, setGradeHistory] = useState<Record<string, GradeHistory[]>>({});
    const [studentNotes, setStudentNotes] = useState<Record<number, StudentNote[]>>({});
    const [showNotesDialog, setShowNotesDialog] = useState<number | null>(null);
    const [newNote, setNewNote] = useState('');

    const [showHistoryDialog, setShowHistoryDialog] = useState(false);
    const [currentHistory, setCurrentHistory] = useState<GradeHistory[]>([]);

    const filteredStudents = useMemo(() => {
        if (!searchQuery) return students;
        const query = searchQuery.toLowerCase();
        return students.filter(student =>
            `${student.lastName} ${student.firstName} ${student.patronymic}`.toLowerCase().includes(query)
        );
    }, [students, searchQuery]);

    const totalPages = Math.ceil(lessons.length / LESSONS_PER_PAGE);
    const paginatedLessons = lessons.slice(
        currentPage * LESSONS_PER_PAGE,
        (currentPage + 1) * LESSONS_PER_PAGE
    );

    const getGrade = (studentId: number, lessonId: number): Grade | undefined => {
        return grades.find(g => g.studentId === studentId && g.lessonId === lessonId);
    };

    const calculateAttendanceRate = (studentId: number): string => {
        const studentGrades = grades.filter(g => g.studentId === studentId && lessons.some(l => l.id === g.lessonId && l.type === type));
        if (studentGrades.length === 0) return '0%';
        const attendedCount = studentGrades.filter(g => g.attended).length;
        return `${Math.round((attendedCount / studentGrades.length) * 100)}%`;
    };

    const getTotalScore = (studentId: number): number => {
        return grades
            .filter(g => g.studentId === studentId && lessons.some(l => l.id === g.lessonId && l.type === type))
            .reduce((sum, g) => {
                return sum + (g.score || 0);
            }, 0);
    };

    const toggleIndividualPlan = (studentId: number) => {
        setIndividualPlans(prev => ({ ...prev, [studentId]: !prev[studentId] }));
        const student = students.find(s => s.id === studentId);
        if (student) {
            const newStatus = !individualPlans[studentId];
            toast.success(
                newStatus
                    ? `✅ ${student.lastName} ${student.firstName} - індивідуальний план активовано`
                    : `❌ ${student.lastName} ${student.firstName} - індивідуальний план деактивовано`,
                { duration: 2000 }
            );
        }
    };

    const handleCellClick = (studentId: number, lessonId: number) => {
        const grade = getGrade(studentId, lessonId);
        if (!grade) return;

        const student = students.find(s => s.id === studentId);
        const lesson = lessons.find(l => l.id === lessonId);

        if (student && lesson) {
            setEditingCell({
                grade,
                studentName: `${student.lastName} ${student.firstName} ${student.patronymic}`,
                lessonDate: lesson.date,
            });
            setAttended(grade.attended);
            setScore(grade.score !== null ? grade.score.toString() : '');
            setComment((grade as any).comment || '');
        }
    };

    const addToHistory = (grade: Grade, oldGrade: Grade) => {
        const historyKey = `${grade.studentId}-${grade.lessonId}`;
        const newHistoryEntry: GradeHistory = {
            timestamp: new Date().toLocaleString('uk-UA'),
            oldValue: {
                attended: oldGrade.attended,
                score: oldGrade.score,
                comment: (oldGrade as any).comment
            },
            newValue: {
                attended: grade.attended,
                score: grade.score,
                comment: (grade as any).comment
            },
            changedBy: 'Викладач'
        };

        setGradeHistory(prev => ({
            ...prev,
            [historyKey]: [...(prev[historyKey] || []), newHistoryEntry]
        }));
    };

    const handleSave = () => {
        if (!editingCell) return;

        const scoreValue = score === '' ? null : parseFloat(score);
        const oldGrade = editingCell.grade;

        const updatedGrade: Grade = {
            ...editingCell.grade,
            attended: attended,
            score: scoreValue,
            extraPoints: 0,
            ...(comment && { comment })
        } as any;

        addToHistory(updatedGrade, oldGrade);

        let message = '';
        if (!attended && scoreValue !== null) {
            message = `⚠️ ${editingCell.studentName} - відсутній, але оцінка ${scoreValue} збережена`;
        } else if (!attended && scoreValue === null) {
            message = `❌ ${editingCell.studentName} - відсутність відмічено`;
        } else if (attended && scoreValue !== null) {
            message = `✅ ${editingCell.studentName} - присутній, оцінка: ${scoreValue}`;
        } else {
            message = `✅ ${editingCell.studentName} - присутність відмічено`;
        }

        if (comment) {
            message += ` 💬 "${comment}"`;
        }

        if (!attended && scoreValue !== null) {
            toast.warning(message, { duration: 3000 });
        } else if (!attended) {
            toast.error(message, { duration: 2500 });
        } else {
            toast.success(message, { duration: 2500 });
        }

        onGradeUpdate(updatedGrade);
        setEditingCell(null);
        setComment('');
    };

    const adjustScore = (delta: number) => {
        const currentScore = score === '' ? 0 : parseFloat(score);
        const newScore = Math.max(0, currentScore + delta);
        setScore(newScore.toString());
    };

    const showHistory = (studentId: number, lessonId: number) => {
        const historyKey = `${studentId}-${lessonId}`;
        setCurrentHistory(gradeHistory[historyKey] || []);
        setShowHistoryDialog(true);
    };

    const addStudentNote = (studentId: number) => {
        if (!newNote.trim()) return;

        const note: StudentNote = {
            id: Date.now(),
            text: newNote,
            timestamp: new Date().toLocaleString('uk-UA'),
            author: 'Викладач'
        };

        setStudentNotes(prev => ({
            ...prev,
            [studentId]: [...(prev[studentId] || []), note]
        }));

        const student = students.find(s => s.id === studentId);
        toast.success(`📝 Примітку додано для ${student?.lastName} ${student?.firstName}`);
        setNewNote('');
    };

    const deleteStudentNote = (studentId: number, noteId: number) => {
        setStudentNotes(prev => ({
            ...prev,
            [studentId]: (prev[studentId] || []).filter(n => n.id !== noteId)
        }));
        toast.success('🗑️ Примітку видалено');
    };

    const getHeaderColor = () => {
        switch(type) {
            case 'lecture': return 'bg-green-100';
            case 'practical': return 'bg-blue-100';
            case 'laboratory': return 'bg-purple-100';
            default: return 'bg-blue-100';
        }
    };

    const getCellHoverColor = () => {
        switch(type) {
            case 'lecture': return 'hover:bg-green-50';
            case 'practical': return 'hover:bg-blue-50';
            case 'laboratory': return 'hover:bg-purple-50';
            default: return 'hover:bg-blue-50';
        }
    };

    const getRowColor = (idx: number) => {
        if (idx % 2 === 0) {
            switch(type) {
                case 'lecture': return 'bg-green-50/30';
                case 'practical': return 'bg-blue-50/30';
                case 'laboratory': return 'bg-purple-50/30';
                default: return 'bg-white';
            }
        } else {
            switch(type) {
                case 'lecture': return 'bg-green-50/50';
                case 'practical': return 'bg-blue-50/50';
                case 'laboratory': return 'bg-purple-50/50';
                default: return 'bg-gray-50';
            }
        }
    };

    return (
        <>
            <Card className="overflow-hidden">
                <div className={`p-4 border-b ${getHeaderColor()}`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold">
                                {type === 'lecture' ? '📚 Журнал відвідування - Лекції' :
                                    type === 'practical' ? '💻 Журнал відвідування та оцінок - Практичні' :
                                        '🔬 Журнал відвідування та оцінок - Лабораторні'}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Натисніть на комірку для редагування • 💬 Коментарі • 📝 Примітки • 📊 Історія
                            </p>
                        </div>
                        <DatePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>

                <div className="hidden md:block">
                    <ScrollArea className="w-full">
                        <div className="min-w-max">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className={getHeaderColor()}>
                                    <th className={`sticky left-0 ${getHeaderColor()} z-20 px-3 py-3 text-left border-r border-b w-[50px]`}>
                                        <div className="text-sm font-semibold">#</div>
                                    </th>
                                    <th className={`sticky left-[50px] ${getHeaderColor()} z-20 px-4 py-3 text-left border-r border-b min-w-[280px]`}>
                                        <div className="text-sm font-semibold">Студент</div>
                                    </th>
                                    <th className={`px-3 py-3 border-r border-b ${getHeaderColor()} min-w-[80px] text-center`}>
                                        <div className="text-xs font-semibold">Примітки</div>
                                    </th>
                                    <th className={`px-3 py-3 border-r border-b ${getHeaderColor()} min-w-[80px] text-center`}>
                                        <div className="text-xs font-semibold">Інд. план</div>
                                    </th>
                                    <th className={`px-3 py-3 border-r border-b ${getHeaderColor()} min-w-[70px] text-center`}>
                                        <div className="text-sm font-semibold">Сума</div>
                                    </th>
                                    {paginatedLessons.map((lesson) => (
                                        <th key={lesson.id} className={`px-3 py-3 border-r border-b ${getHeaderColor()} min-w-[100px] text-center`}>
                                            <div className="text-sm font-semibold whitespace-nowrap">{lesson.date}</div>
                                        </th>
                                    ))}
                                    <th className={`sticky right-0 ${getHeaderColor()} z-10 px-4 py-3 border-l border-b min-w-[138px] shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] text-center`}>
                                        <div className="text-sm font-semibold">Відвідування</div>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredStudents.map((student, idx) => (
                                    <tr
                                        key={student.id}
                                        className={`border-b ${getRowColor(idx)} transition-colors`}
                                    >
                                        <td className={`sticky left-0 z-10 px-3 py-3 border-r ${getRowColor(idx)} w-[50px]`}>
                                            <div className="text-sm">{idx + 1}</div>
                                        </td>
                                        <td className={`sticky left-[50px] z-10 px-4 py-3 border-r ${getRowColor(idx)} min-w-[280px]`}>
                                            <div className="text-sm font-medium">
                                                {student.lastName} {student.firstName} {student.patronymic}
                                            </div>
                                        </td>
                                        <td className={`px-3 py-3 border-r text-center ${getRowColor(idx)} min-w-[80px]`}>
                                            <button
                                                onClick={() => setShowNotesDialog(student.id)}
                                                className="flex items-center justify-center w-full h-full transition-transform hover:scale-110 relative"
                                            >
                                                <StickyNote className="h-5 w-5 text-blue-600" />
                                                {studentNotes[student.id]?.length > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                                        {studentNotes[student.id].length}
                                                    </span>
                                                )}
                                            </button>
                                        </td>
                                        <td className={`px-3 py-3 border-r text-center ${getRowColor(idx)} min-w-[80px]`}>
                                            <button
                                                onClick={() => toggleIndividualPlan(student.id)}
                                                className="flex items-center justify-center w-full h-full transition-transform hover:scale-110"
                                            >
                                                {individualPlans[student.id] ? (
                                                    <Plus className="h-5 w-5 text-green-600" />
                                                ) : (
                                                    <Minus className="h-5 w-5 text-red-600" />
                                                )}
                                            </button>
                                        </td>
                                        <td className={`px-3 py-3 border-r text-center ${getRowColor(idx)} min-w-[70px]`}>
                                            <div className="text-sm font-bold">
                                                {getTotalScore(student.id).toFixed(1)}
                                            </div>
                                        </td>
                                        {paginatedLessons.map((lesson) => {
                                            const grade = getGrade(student.id, lesson.id);
                                            const hasComment = grade && (grade as any).comment;
                                            const historyKey = `${student.id}-${lesson.id}`;
                                            const hasHistory = gradeHistory[historyKey]?.length > 0;

                                            return (
                                                <td
                                                    key={lesson.id}
                                                    className={`px-3 py-3 border-r text-center cursor-pointer ${getCellHoverColor()} transition-all ${getRowColor(idx)} min-w-[120px] relative`}
                                                    onClick={() => handleCellClick(student.id, lesson.id)}
                                                >
                                                    {grade && (
                                                        <div className="flex flex-col items-center justify-center gap-1">
                                                            <div className="flex items-center justify-center">
                                                                {!grade.attended && grade.score === null ? (
                                                                    <X className="h-5 w-5 text-red-600" />
                                                                ) : grade.score !== null ? (
                                                                    <div className="flex flex-col items-center">
                                                                        <span className="text-sm font-bold text-gray-800">
                                                                            {grade.score}
                                                                        </span>
                                                                        {!grade.attended && (
                                                                            <X className="h-3 w-3 text-red-500 -mt-1" />
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <Check className="h-5 w-5 text-green-600" />
                                                                )}
                                                            </div>
                                                            <div className="flex gap-1">
                                                                {hasComment && (
                                                                    <MessageSquare className="h-3 w-3 text-blue-500" />
                                                                )}
                                                                {hasHistory && (
                                                                    <button
                                                                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                                            e.stopPropagation();
                                                                            showHistory(student.id, lesson.id);
                                                                        }}
                                                                        className="hover:scale-125 transition-transform"
                                                                    >
                                                                        <History className="h-3 w-3 text-orange-500" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className={`sticky right-0 z-10 px-4 py-3 border-l text-center min-w-[120px] shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] ${getRowColor(idx)}`}>
                                            <div className={`text-sm font-bold ${
                                                parseInt(calculateAttendanceRate(student.id)) >= 80
                                                    ? 'text-green-700'
                                                    : parseInt(calculateAttendanceRate(student.id)) >= 60
                                                        ? 'text-yellow-700'
                                                        : 'text-red-700'
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

                <div className="md:hidden p-4 space-y-4">
                    {filteredStudents.map((student, idx) => (
                        <Card key={student.id} className={`p-4 ${getRowColor(idx)}`}>
                            <div className="mb-3 pb-3 border-b">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="text-sm text-gray-500">#{idx + 1}</div>
                                        <div className="font-medium mt-1">
                                            {student.lastName} {student.firstName} {student.patronymic}
                                        </div>
                                        <div className="text-sm font-semibold text-gray-700 mt-1">
                                            Сума: {getTotalScore(student.id).toFixed(1)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className={`text-sm font-semibold px-2 py-1 rounded ${
                                            parseInt(calculateAttendanceRate(student.id)) >= 80
                                                ? 'bg-green-100 text-green-700'
                                                : parseInt(calculateAttendanceRate(student.id)) >= 60
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                        }`}>
                                            {calculateAttendanceRate(student.id)}
                                        </div>
                                        <button
                                            onClick={() => setShowNotesDialog(student.id)}
                                            className="text-blue-600"
                                        >
                                            <StickyNote className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <ScrollArea className="w-full">
                                <div className="flex gap-2 pb-2">
                                    {paginatedLessons.map((lesson) => {
                                        const grade = getGrade(student.id, lesson.id);
                                        const hasComment = grade && (grade as any).comment;

                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => handleCellClick(student.id, lesson.id)}
                                                className={`flex-shrink-0 flex flex-col items-center justify-center gap-1 p-2 rounded border ${getCellHoverColor()} disabled:opacity-50 w-24 h-20 transition-all relative`}
                                            >
                                                <div className="text-xs text-gray-600 whitespace-nowrap font-medium">
                                                    {lesson.date}
                                                </div>
                                                <div className="flex-grow flex items-center justify-center">
                                                    {grade ? (
                                                        !grade.attended && grade.score === null ? (
                                                            <X className="h-5 w-5 text-red-600" />
                                                        ) : grade.score !== null ? (
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-sm font-bold text-gray-800">
                                                                    {grade.score}
                                                                </span>
                                                                {!grade.attended && (
                                                                    <X className="h-3 w-3 text-red-500 -mt-1" />
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <Check className="h-5 w-5 text-green-600" />
                                                        )
                                                    ) : (
                                                        <span className="text-xs text-gray-400">-</span>
                                                    )}
                                                </div>
                                                {hasComment && (
                                                    <MessageSquare className="absolute top-1 right-1 h-3 w-3 text-blue-500" />
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

            <Dialog open={editingCell !== null} onOpenChange={() => setEditingCell(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Редагування даних</DialogTitle>
                        <p className="text-sm text-gray-500 mt-2">
                            {editingCell?.studentName} - {editingCell?.lessonDate}
                        </p>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="attended"
                                checked={attended}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAttended(e.target.checked)}
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
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScore(e.target.value)}
                                    className="text-center"
                                    placeholder="-"
                                />
                                <Button type="button" variant="outline" size="icon" onClick={() => adjustScore(0.5)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {[5, 6, 7, 8, 9, 10, 12, 15, 20].map((value) => (
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
                                {[4.5, 5.5, 6.5, 7.5, 8.5, 9.5].map((value) => (
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
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                                placeholder="Наприклад: здав роботу пізно, відпрацював пропуск, виконав додаткове завдання..."
                                rows={3}
                                className="resize-none"
                            />
                            <p className="text-xs text-gray-500">
                                💡 Коментар буде відображатися біля оцінки з іконкою 💬
                            </p>
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

            <Dialog open={showNotesDialog !== null} onOpenChange={() => setShowNotesDialog(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <StickyNote className="h-5 w-5" />
                            Примітки студента
                        </DialogTitle>
                        {showNotesDialog && (
                            <p className="text-sm text-gray-500 mt-2">
                                {students.find(s => s.id === showNotesDialog)?.lastName} {students.find(s => s.id === showNotesDialog)?.firstName}
                            </p>
                        )}
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="newNote">Додати нову примітку</Label>
                            <Textarea
                                id="newNote"
                                value={newNote}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewNote(e.target.value)}
                                placeholder="Наприклад: має академзаборгованість, потребує індивідуальної консультації..."
                                rows={3}
                                className="resize-none"
                            />
                            <Button
                                onClick={() => showNotesDialog && addStudentNote(showNotesDialog)}
                                className="w-full"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Додати примітку
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label>Всі примітки ({showNotesDialog ? (studentNotes[showNotesDialog]?.length || 0) : 0})</Label>
                            <ScrollArea className="h-[300px] border rounded-lg p-4">
                                {showNotesDialog && studentNotes[showNotesDialog]?.length > 0 ? (
                                    <div className="space-y-3">
                                        {studentNotes[showNotesDialog].map((note) => (
                                            <Card key={note.id} className="p-3">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="flex-1">
                                                        <p className="text-sm">{note.text}</p>
                                                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                            <span>{note.author}</span>
                                                            <span>•</span>
                                                            <span>{note.timestamp}</span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteStudentNote(showNotesDialog, note.id)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <StickyNote className="h-12 w-12 mb-2" />
                                        <p className="text-sm">Приміток ще немає</p>
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowNotesDialog(null)}>
                            Закрити
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <History className="h-5 w-5" />
                            Історія змін оцінки
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        {currentHistory.length > 0 ? (
                            <ScrollArea className="h-[400px]">
                                <div className="space-y-4">
                                    {currentHistory.map((entry, idx) => (
                                        <Card key={idx} className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <History className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-sm">{entry.changedBy}</span>
                                                        <span className="text-xs text-gray-500">{entry.timestamp}</span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div className="space-y-1">
                                                            <p className="text-xs text-gray-500 font-medium">Було:</p>
                                                            <div className="pl-3 border-l-2 border-red-300">
                                                                <p>
                                                                    <span className="text-gray-600">Присутність:</span>{' '}
                                                                    <span className={entry.oldValue.attended ? 'text-green-600' : 'text-red-600'}>
                                                                        {entry.oldValue.attended ? '✓ Так' : '✗ Ні'}
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    <span className="text-gray-600">Оцінка:</span>{' '}
                                                                    <span className="font-medium">
                                                                        {entry.oldValue.score !== null ? entry.oldValue.score : '-'}
                                                                    </span>
                                                                </p>
                                                                {entry.oldValue.comment && (
                                                                    <p className="mt-1">
                                                                        <span className="text-gray-600">Коментар:</span>{' '}
                                                                        <span className="text-gray-700 italic">"{entry.oldValue.comment}"</span>
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-xs text-gray-500 font-medium">Стало:</p>
                                                            <div className="pl-3 border-l-2 border-green-300">
                                                                <p>
                                                                    <span className="text-gray-600">Присутність:</span>{' '}
                                                                    <span className={entry.newValue.attended ? 'text-green-600' : 'text-red-600'}>
                                                                        {entry.newValue.attended ? '✓ Так' : '✗ Ні'}
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    <span className="text-gray-600">Оцінка:</span>{' '}
                                                                    <span className="font-medium">
                                                                        {entry.newValue.score !== null ? entry.newValue.score : '-'}
                                                                    </span>
                                                                </p>
                                                                {entry.newValue.comment && (
                                                                    <p className="mt-1">
                                                                        <span className="text-gray-600">Коментар:</span>{' '}
                                                                        <span className="text-gray-700 italic">"{entry.newValue.comment}"</span>
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                                <History className="h-12 w-12 mb-2" />
                                <p className="text-sm">Історія змін порожня</p>
                                <p className="text-xs mt-1">Змін ще не було</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowHistoryDialog(false)}>
                            Закрити
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}