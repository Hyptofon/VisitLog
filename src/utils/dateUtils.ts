export function getCurrentDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
}

export function isSameDate(date1: string, date2: string): boolean {
    return date1 === date2;
}

export function findTodayLessonIndex(lessons: { date: string }[]): number {
    const today = getCurrentDate();
    return lessons.findIndex(lesson => isSameDate(lesson.date, today));
}

export function calculatePageForTodayLesson(
    lessons: { date: string }[],
    lessonsPerPage: number
): number | null {
    const todayIndex = findTodayLessonIndex(lessons);
    if (todayIndex === -1) return null;
    return Math.floor(todayIndex / lessonsPerPage);
}

export function getTodayHighlightColors(type: 'lecture' | 'practical' | 'laboratory') {
    switch (type) {
        case 'lecture':
            return {
                header: 'bg-green-100 dark:bg-green-900/30',
                headerRing: 'ring-2 ring-green-400 dark:ring-green-600',
                headerBorder: 'border-green-200',
                iconColor: 'text-green-600 dark:text-green-400',
                indicator: 'bg-green-500',
                cell: 'bg-green-50 dark:bg-green-900/20',
                cellRing: 'ring-2 ring-green-300 dark:ring-green-700',
                cellBorder: 'border-2 border-green-400 dark:border-green-600',
                textColor: 'text-green-900 dark:text-green-100',
            };
        case 'practical':
            return {
                header: 'bg-blue-100 dark:bg-blue-900/30',
                headerRing: 'ring-2 ring-blue-400 dark:ring-blue-600',
                headerBorder: 'border-blue-200',
                iconColor: 'text-blue-600 dark:text-blue-400',
                indicator: 'bg-blue-500',
                cell: 'bg-blue-50 dark:bg-blue-900/20',
                cellRing: 'ring-2 ring-blue-300 dark:ring-blue-700',
                cellBorder: 'border-2 border-blue-400 dark:border-blue-600',
                textColor: 'text-blue-900 dark:text-blue-100',
            };
        case 'laboratory':
            return {
                header: 'bg-purple-100 dark:bg-purple-900/30',
                headerRing: 'ring-2 ring-purple-400 dark:ring-purple-600',
                headerBorder: 'border-purple-200',
                iconColor: 'text-purple-600 dark:text-purple-400',
                indicator: 'bg-purple-500',
                cell: 'bg-purple-50 dark:bg-purple-900/20',
                cellRing: 'ring-2 ring-purple-300 dark:ring-purple-700',
                cellBorder: 'border-2 border-purple-400 dark:border-purple-600',
                textColor: 'text-purple-900 dark:text-purple-100',
            };
    }
}