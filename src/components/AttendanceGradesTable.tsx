import { useState, useMemo } from 'react';
import { Student, Lesson, Grade } from '@/types';
import { Check, X } from 'lucide-react';
import { EditGradeDialog } from './EditGradeDialog';
import { DatePagination } from './DatePagination';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';

interface AttendanceGradesTableProps {
    students: Student[];
    lessons: Lesson[];
    grades: Grade[];
    onGradeUpdate: (grade: Grade) => void;
    searchQuery: string;
}

const LESSONS_PER_PAGE = 10;

export function AttendanceGradesTable({
                                          students,
                                          lessons,
                                          grades,
                                          onGradeUpdate,
                                          searchQuery,
                                      }: AttendanceGradesTableProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [editingGrade, setEditingGrade] = useState<{
        grade: Grade;
        studentName: string;
        lessonDate: string;
    } | null>(null);

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

    const handleCellClick = (studentId: number, lessonId: number) => {
        const grade = getGrade(studentId, lessonId);
        if (!grade) return;

        const student = students.find(s => s.id === studentId);
        const lesson = lessons.find(l => l.id === lessonId);

        if (student && lesson) {
            setEditingGrade({
                grade,
                studentName: `${student.lastName} ${student.firstName} ${student.patronymic}`,
                lessonDate: lesson.date,
            });
        }
    };

    const handleSaveGrade = (score: number | null, extraPoints: number, attended: boolean) => {
        if (editingGrade) {
            onGradeUpdate({
                ...editingGrade.grade,
                score,
                extraPoints,
                attended,
            });
        }
    };

    return (
        <>
            <Card className="overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                    <div>
                        <h3>Журнал оцінок та відвідування</h3>
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
                                    <td className="px-3 py-3 border-r text-center bg-inherit">
                                        <div className="text-sm">0</div>
                                    </td>
                                    <td className="px-3 py-3 border-r text-center bg-inherit">
                                        <div className="text-sm">0</div>
                                    </td>
                                    <td className="px-3 py-3 border-r text-center bg-inherit">
                                        <div className="text-sm">0</div>
                                    </td>
                                    {paginatedLessons.map((lesson) => {
                                        const grade = getGrade(student.id, lesson.id);
                                        return (
                                            <td
                                                key={lesson.id}
                                                className="px-3 py-3 border-r text-center cursor-pointer hover:bg-blue-100/50 transition-colors bg-inherit"
                                                onClick={() => handleCellClick(student.id, lesson.id)}
                                            >
                                                {grade && (
                                                    <div className="flex items-center justify-center">
                                                        {grade.attended ? (
                                                            grade.score !== null ? (
                                                                <span className="text-sm">{grade.score}</span>
                                                            ) : (
                                                                <Check className="h-5 w-5 text-green-500" />
                                                            )
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
            </Card>

            <EditGradeDialog
                open={editingGrade !== null}
                onClose={() => setEditingGrade(null)}
                grade={editingGrade?.grade || null}
                studentName={editingGrade?.studentName || ''}
                lessonDate={editingGrade?.lessonDate || ''}
                onSave={handleSaveGrade}
            />
        </>
    );
}
