import React, { useState, useMemo, forwardRef } from 'react';
import { Check, X, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Student, Lesson, Grade } from '@/types';

// --- UI COMPONENT STUBS ---
// Since the original UI components are not available in this context,
// we are recreating basic versions of them here.

const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
        {...props}
    />
));
Card.displayName = "Card";

const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline', size?: 'default' | 'sm' | 'icon' }>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
        const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
        const variantClasses = {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        };
        const sizeClasses = {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            icon: "h-10 w-10",
        };
        return (
            <button
                className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
    return (
        <input
            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
        {...props}
    />
));
Label.displayName = "Label";


const Dialog = ({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children?: React.ReactNode }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={() => onOpenChange(false)}>
            {children}
        </div>
    );
};

const DialogContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        className={`fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg ${className}`}
        {...props}
    >
        {children}
    </div>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
    <h2 ref={ref} className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />
));
DialogTitle.displayName = "DialogTitle";


const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const ScrollArea = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={`overflow-x-auto ${className}`}>
        {children}
    </div>
);

// --- DATE PAGINATION COMPONENT ---
interface DatePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function DatePagination({ currentPage, totalPages, onPageChange }: DatePaginationProps) {
    return (
        <div className="flex items-center justify-center space-x-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
            >
                <ChevronLeft className="h-4 w-4" />
                <span>Попередні</span>
            </Button>
            <span className="text-sm">
                Сторінка {currentPage + 1} з {totalPages}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
            >
                <span>Наступні</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}

// --- MAIN COMPONENT ---
interface CombinedTableProps {
    students: Student[];
    lessons: Lesson[];
    grades: Grade[];
    onGradeUpdate: (grade: Grade) => void;
    searchQuery: string;
    type: 'lecture' | 'practical';
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
    const [extraPoints, setExtraPoints] = useState(0);
    const [individualPlans, setIndividualPlans] = useState<Record<number, boolean>>({});

    const filteredStudents = useMemo(() => {
        if (!searchQuery) return students;
        const query = searchQuery.toLowerCase();
        return students.filter(student =>
            `${student.lastName} ${student.firstName} ${student.patronymic}`.toLowerCase().includes(query)
        );
    }, [students, searchQuery]);

    const lessonTypeMap = useMemo(() => {
        const map = new Map<number, 'lecture' | 'practical'>();
        lessons.forEach(lesson => map.set(lesson.id, lesson.type));
        return map;
    }, [lessons]);

    const totalPages = Math.ceil(lessons.length / LESSONS_PER_PAGE);
    const paginatedLessons = lessons.slice(
        currentPage * LESSONS_PER_PAGE,
        (currentPage + 1) * LESSONS_PER_PAGE
    );

    const getGrade = (studentId: number, lessonId: number): Grade | undefined => {
        return grades.find(g => g.studentId === studentId && g.lessonId === lessonId);
    };

    const calculateAttendanceRate = (studentId: number): string => {
        const studentGrades = grades.filter(g => g.studentId === studentId && lessonTypeMap.get(g.lessonId) === type);
        if (studentGrades.length === 0) return '0%';
        const attendedCount = studentGrades.filter(g => g.attended).length;
        return `${Math.round((attendedCount / studentGrades.length) * 100)}%`;
    };

    const getTotalExtraPointsAllTypes = (studentId: number): number => {
        return grades
            .filter(g => g.studentId === studentId)
            .reduce((sum, g) => sum + g.extraPoints, 0);
    };

    const getTotalScore = (studentId: number): number => {
        const relevantGrades = grades.filter(
            g => g.studentId === studentId && lessonTypeMap.get(g.lessonId) === type
        );

        return relevantGrades.reduce((sum, g) => {
            if (!g.attended) return sum;
            const baseScore = type === 'lecture' ? 0 : g.score || 0;
            return sum + baseScore + (g.extraPoints || 0);
        }, 0);
    };

    const toggleIndividualPlan = (studentId: number) => {
        setIndividualPlans(prev => ({ ...prev, [studentId]: !prev[studentId] }));
    };

    const handleCellClick = (studentId: number, lessonId: number) => {
        const grade = getGrade(studentId, lessonId);
        if (!grade) {
            // If no grade exists, you might want to create a new one.
            // For now, we just return to avoid errors.
            console.error(`No grade found for student ${studentId} and lesson ${lessonId}`);
            return;
        };
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
            setExtraPoints(grade.extraPoints);
        }
    };

    const handleSave = () => {
        if (editingCell) {
            let updatedGrade: Grade;
            if (!attended) {
                updatedGrade = {
                    ...editingCell.grade,
                    attended: false,
                    score: null,
                    extraPoints: 0,
                };
            } else {
                const scoreValue = score === '' ? null : parseInt(score, 10);
                updatedGrade = {
                    ...editingCell.grade,
                    attended: true,
                    score: type === 'practical' ? scoreValue : null,
                    extraPoints: extraPoints,
                };
            }
            onGradeUpdate(updatedGrade);
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
                            <h3 className="text-lg font-semibold">
                                {type === 'lecture' ? 'Журнал відвідування' : 'Журнал відвідування та оцінок'}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
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

                <div className="hidden md:block">
                    <ScrollArea className="w-full">
                        <div className="min-w-max">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="sticky left-0 bg-gray-100 z-20 px-3 py-3 text-left border-r border-b w-[50px]">
                                        <div className="text-sm">№</div>
                                    </th>
                                    <th className="sticky left-[50px] bg-gray-100 z-20 px-4 py-3 text-left border-r border-b min-w-[280px]">
                                        <div className="text-sm">Студент</div>
                                    </th>
                                    <th className="px-3 py-3 border-r border-b bg-gray-100 min-w-[80px] text-center">
                                        <div className="text-xs">Індивідуальний план</div>
                                    </th>
                                    <th className="px-3 py-3 border-r border-b bg-gray-100 min-w-[70px] text-center">
                                        <div className="text-sm">Сума</div>
                                    </th>
                                    <th className="px-3 py-3 border-r border-b bg-gray-100 min-w-[80px] text-center">
                                        <div className="text-xs">Дод. оцінка</div>
                                    </th>
                                    {paginatedLessons.map((lesson) => (
                                        <th key={lesson.id} className="px-3 py-3 border-r border-b bg-blue-50 min-w-[100px] text-center">
                                            <div className="text-sm whitespace-nowrap">{lesson.date}</div>
                                        </th>
                                    ))}
                                    <th className="sticky right-0 bg-gray-100 z-10 px-4 py-3 border-l border-b min-w-[138px] shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] text-center">
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
                                        <td className="sticky left-0 z-10 px-3 py-3 border-r bg-inherit w-[50px]">
                                            <div className="text-sm">{idx + 1}</div>
                                        </td>
                                        <td className="sticky left-[50px] z-10 px-4 py-3 border-r bg-inherit min-w-[280px]">
                                            <div className="text-sm">
                                                {student.lastName} {student.firstName} {student.patronymic}
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 border-r text-center bg-inherit min-w-[80px]">
                                            <button
                                                onClick={() => toggleIndividualPlan(student.id)}
                                                className="flex items-center justify-center w-full h-full"
                                            >
                                                {individualPlans[student.id] ? (
                                                    <Plus className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <Minus className="h-5 w-5 text-red-500" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-3 py-3 border-r text-center bg-inherit min-w-[70px]">
                                            <div className="text-sm">
                                                {getTotalScore(student.id)}
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 border-r text-center bg-inherit min-w-[80px]">
                                            <div className="text-sm">
                                                {getTotalExtraPointsAllTypes(student.id)}
                                            </div>
                                        </td>
                                        {paginatedLessons.map((lesson) => {
                                            const grade = getGrade(student.id, lesson.id);
                                            return (
                                                <td
                                                    key={lesson.id}
                                                    className="px-3 py-3 border-r text-center cursor-pointer hover:bg-blue-100/50 transition-colors bg-inherit min-w-[120px]"
                                                    onClick={() => handleCellClick(student.id, lesson.id)}
                                                >
                                                    {grade && (
                                                        <div className="flex items-center justify-center">
                                                            {grade.attended ? (
                                                                type === 'lecture' ? (
                                                                    grade.extraPoints > 0 ? (
                                                                        <span className="text-sm text-green-600">
                                                                            +{grade.extraPoints}
                                                                         </span>
                                                                    ) : (
                                                                        <Check className="h-5 w-5 text-green-500" />
                                                                    )
                                                                ) : (
                                                                    <div className="flex flex-col items-center">
                                                                        {grade.score !== null ? (
                                                                            <span className="text-sm">
                                                                                {grade.score}
                                                                                {grade.extraPoints > 0 && (
                                                                                    <span className="text-xs text-green-600 ml-1">
                                                                                        +{grade.extraPoints}
                                                                                    </span>
                                                                                )}
                                                                            </span>
                                                                        ) : (
                                                                            <Check className="h-5 w-5 text-green-500" />
                                                                        )}
                                                                    </div>
                                                                )
                                                            ) : (
                                                                <X className="h-5 w-5 text-red-500" />
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className={`sticky right-0 z-10 px-4 py-3 border-l text-center min-w-[120px] shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
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
                                        <div className="text-sm text-gray-500">#{idx + 1}</div>
                                        <div className="font-medium mt-1">
                                            {student.lastName} {student.firstName} {student.patronymic}
                                        </div>
                                    </div>
                                    <div className={`text-sm font-semibold px-2 py-1 rounded ${
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
                                                onClick={() => handleCellClick(student.id, lesson.id)}
                                                className="flex-shrink-0 flex flex-col items-center justify-center gap-1 p-2 rounded border hover:bg-gray-50 disabled:opacity-50 w-24 h-20"
                                            >
                                                <div className="text-xs text-gray-500 whitespace-nowrap">
                                                    {lesson.date}
                                                </div>
                                                <div className="flex-grow flex items-center justify-center">
                                                    {grade ? (
                                                        <>
                                                            {grade.attended ? (
                                                                type === 'lecture' ? (
                                                                    grade.extraPoints > 0 ? (
                                                                        <span className="text-sm font-bold text-green-600">
                                                                            +{grade.extraPoints}
                                                                         </span>
                                                                    ) : (
                                                                        <Check className="h-5 w-5 text-green-500" />
                                                                    )
                                                                ) : (
                                                                    <div className="flex flex-col items-center">
                                                                        {grade.score !== null ? (
                                                                            <span className="text-sm font-bold">
                                                                                {grade.score}
                                                                                {grade.extraPoints > 0 && (
                                                                                    <span className="text-xs text-green-600 ml-1">
                                                                                        +{grade.extraPoints}
                                                                                    </span>
                                                                                )}
                                                                            </span>
                                                                        ) : (
                                                                            <Check className="h-5 w-5 text-green-500" />
                                                                        )}
                                                                    </div>
                                                                )
                                                            ) : (
                                                                <X className="h-5 w-5 text-red-500" />
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">немає даних</span>
                                                    )}
                                                </div>
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Редагування даних
                        </DialogTitle>
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
                                onChange={(e) => setAttended(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="attended">Студент був присутній</Label>
                        </div>

                        {attended && (
                            <>
                                {type === 'practical' && (
                                    <div className="space-y-2">
                                        <Label>Оцінка</Label>
                                        <div className="flex items-center gap-2">
                                            <Button type="button" variant="outline" size="icon" onClick={() => adjustScore(-1)}>
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
                                            <Button type="button" variant="outline" size="icon" onClick={() => adjustScore(1)}>
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
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
                                )}
                                <div className="space-y-2">
                                    <Label>Додаткові бали</Label>
                                    <div className="flex items-center gap-2">
                                        <Button type="button" variant="outline" size="icon" onClick={() => adjustExtraPoints(-1)}>
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={extraPoints}
                                            onChange={(e) => setExtraPoints(parseInt(e.target.value) || 0)}
                                            className="text-center"
                                        />
                                        <Button type="button" variant="outline" size="icon" onClick={() => adjustExtraPoints(1)}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </>
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

