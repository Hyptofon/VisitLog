import { Grade, Lesson } from '@/types';
import { Card } from './ui/card';
import { TrendingUp, Users, BookOpen, AlertCircle, Award } from 'lucide-react';

interface StatsCardsProps {
    grades: Grade[];
    lessons: Lesson[];
    studentCount: number;
    type: 'lecture' | 'practical' | 'laboratory';
}

export function StatsCards({ grades, lessons, studentCount, type }: StatsCardsProps) {
    const relevantGrades = grades.filter(g =>
        lessons.some(l => l.id === g.lessonId)
    );

    const totalPossibleAttendances = studentCount * lessons.length;
    const actualAttendances = relevantGrades.filter(g => g.attended).length;
    const attendanceRate = totalPossibleAttendances > 0
        ? Math.round((actualAttendances / totalPossibleAttendances) * 100)
        : 0;

    // Якщо це лекції, показуємо статистику відвідуваності
    if (type === 'lecture') {
        const totalAbsences = relevantGrades.filter(g => !g.attended).length;
        const totalExtraPoints = relevantGrades.reduce((sum, g) => sum + g.extraPoints, 0);
        const avgExtraPoints = studentCount > 0
            ? (totalExtraPoints / studentCount).toFixed(1)
            : '0.0';

        const stats = [
            { title: 'Відвідуваність', value: `${attendanceRate}%`, icon: Users, color: 'text-green-600', bgColor: 'bg-green-50' },
            { title: 'Кількість занять', value: lessons.length, icon: BookOpen, color: 'text-blue-600', bgColor: 'bg-blue-50' },
            { title: 'Всього пропусків', value: totalAbsences, icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
            { title: 'Сер. дод. бали', value: avgExtraPoints, icon: Award, color: 'text-purple-600', bgColor: 'bg-purple-50' },
        ];

        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs md:text-sm text-muted-foreground mb-1">{stat.title}</p>
                                <p className="text-xl md:text-2xl font-semibold">{stat.value}</p>
                            </div>
                            <div className={`p-2 md:p-3 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-4 w-4 md:h-6 md:w-6 ${stat.color}`} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }


    else {
        const totalSumOfScores = relevantGrades.reduce((sum, g) => {
            if (g.attended) {
                return sum + (g.score || 0) + g.extraPoints;
            }
            return sum;
        }, 0);

        const averageGrade = studentCount > 0
            ? (totalSumOfScores / studentCount).toFixed(1)
            : '0.0';

        const totalExtraPoints = relevantGrades.reduce((sum, g) => sum + g.extraPoints, 0);

        const stats = [
            { title: 'Середній бал', value: averageGrade, icon: TrendingUp, color: 'text-blue-600', bgColor: 'bg-blue-50' },
            { title: 'Відвідуваність', value: `${attendanceRate}%`, icon: Users, color: 'text-green-600', bgColor: 'bg-green-50' },
            { title: 'Кількість занять', value: lessons.length, icon: BookOpen, color: 'text-purple-600', bgColor: 'bg-purple-50' },
            { title: 'Дод. бали (всього)', value: totalExtraPoints, icon: Award, color: 'text-orange-600', bgColor: 'bg-orange-50' },
        ];

        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs md:text-sm text-muted-foreground mb-1">{stat.title}</p>
                                <p className="text-xl md:text-2xl font-semibold">{stat.value}</p>
                            </div>
                            <div className={`p-2 md:p-3 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-4 w-4 md:h-6 md:w-6 ${stat.color}`} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }
}