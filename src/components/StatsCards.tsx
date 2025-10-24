import { Grade, Lesson } from '@/types';
import { Card } from './ui/card';
import { TrendingUp, Users, BookOpen, AlertCircle, Award, Sigma } from 'lucide-react';

interface StatsCardsProps {
    grades: Grade[];
    lessons: Lesson[];
    studentCount: number;
    type: 'lecture' | 'practical' | 'laboratory' | 'all';
}

export function StatsCards({ grades, lessons, studentCount, type }: StatsCardsProps) {
    // Для типів 'all', 'lecture', 'practical', 'laboratory'
    const totalPossibleAttendances = studentCount * lessons.length;
    const actualAttendances = grades.filter(g =>
        g.attended && lessons.some(l => l.id === g.lessonId)
    ).length;

    const attendanceRate = totalPossibleAttendances > 0
        ? Math.round((actualAttendances / totalPossibleAttendances) * 100)
        : 0;

    let stats: { title: string; value: string | number; icon: React.ElementType; color: string; bgColor: string; }[] = [];

    switch (type) {
        case 'lecture': {
            const totalAbsences = grades.filter(g => !g.attended && lessons.some(l => l.id === g.lessonId)).length;
            stats = [
                { title: 'Відвідуваність', value: `${attendanceRate}%`, icon: Users, color: 'text-green-600', bgColor: 'bg-green-50' },
                { title: 'Кількість занять', value: lessons.length, icon: BookOpen, color: 'text-blue-600', bgColor: 'bg-blue-50' },
                { title: 'Всього пропусків', value: totalAbsences, icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
                { title: 'Студентів', value: studentCount, icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-50' },
            ];
            break;
        }
        case 'practical':
        case 'laboratory': {
            const totalSumOfScores = grades
                .filter(g => lessons.some(l => l.id === g.lessonId))
                .reduce((sum, g) => sum + (g.score || 0), 0);

            const averageGrade = studentCount > 0 ? (totalSumOfScores / studentCount).toFixed(1) : '0.0';

            stats = [
                { title: 'Середній бал', value: averageGrade, icon: TrendingUp, color: 'text-blue-600', bgColor: 'bg-blue-50' },
                { title: 'Відвідуваність', value: `${attendanceRate}%`, icon: Users, color: 'text-green-600', bgColor: 'bg-green-50' },
                { title: 'Кількість занять', value: lessons.length, icon: BookOpen, color: 'text-purple-600', bgColor: 'bg-purple-50' },
                { title: 'Сума балів', value: totalSumOfScores.toFixed(1), icon: Award, color: 'text-orange-600', bgColor: 'bg-orange-50' },
            ];
            break;
        }
        case 'all': {
            const practicalAndLabLessons = lessons.filter(l => l.type === 'practical' || l.type === 'laboratory');
            const practicalAndLabLessonIds = new Set(practicalAndLabLessons.map(l => l.id));

            const totalSumOfScores = grades
                .filter(g => practicalAndLabLessonIds.has(g.lessonId))
                .reduce((sum, g) => sum + (g.score || 0), 0);

            const averageGrade = studentCount > 0 && practicalAndLabLessons.length > 0
                ? (totalSumOfScores / studentCount).toFixed(1)
                : '0.0';

            stats = [
                { title: 'Заг. відвідуваність', value: `${attendanceRate}%`, icon: Users, color: 'text-green-600', bgColor: 'bg-green-50' },
                { title: 'Всього занять', value: lessons.length, icon: BookOpen, color: 'text-gray-600', bgColor: 'bg-gray-50' },
                { title: 'Середній бал (П, Лаб)', value: averageGrade, icon: TrendingUp, color: 'text-blue-600', bgColor: 'bg-blue-50' },
                { title: 'Загальна сума балів', value: totalSumOfScores.toFixed(1), icon: Sigma, color: 'text-purple-600', bgColor: 'bg-purple-50' },
            ];
            break;
        }
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            {stats.map((stat, index) => (
                <Card key={index} className="p-3 md:p-4 dark:bg-gray-800/50 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs md:text-sm text-muted-foreground mb-1">{stat.title}</p>
                            <p className="text-xl md:text-2xl font-semibold">{stat.value}</p>
                        </div>
                        <div className={`p-2 md:p-3 rounded-lg ${stat.bgColor} dark:bg-opacity-20`}>
                            <stat.icon className={`h-4 w-4 md:h-6 md:w-6 ${stat.color} dark:opacity-80`} />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}