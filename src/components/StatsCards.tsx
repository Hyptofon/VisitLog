import { Grade, Lesson } from '@/types';
import { StatCard } from './StatCard';
import { useStats } from './journal/useStats';

interface StatsCardsProps {
    grades: Grade[];
    lessons: Lesson[];
    studentCount: number;
    type: 'lecture' | 'practical' | 'laboratory' | 'all';
}

export function StatsCards({ grades, lessons, studentCount, type }: StatsCardsProps) {
    const stats = useStats({ grades, lessons, studentCount, type });

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                    bgColor={stat.bgColor}
                />
            ))}
        </div>
    );
}