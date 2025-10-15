import { Student, Lesson, Grade } from '@/types';

export const students: Student[] = [
    { id: 1, firstName: 'Оксана', lastName: 'Бабак', patronymic: 'Олегівна' },
    { id: 2, firstName: 'Максим', lastName: 'Басок', patronymic: 'Олександрович' },
    { id: 3, firstName: 'Маргарита', lastName: 'Баховська', patronymic: 'Павлівна' },
    { id: 4, firstName: 'Богдан', lastName: 'Башмаков', patronymic: 'Олегович' },
    { id: 5, firstName: 'Артем', lastName: 'Білогір', patronymic: 'Павлович' },
    { id: 6, firstName: 'Вероніка', lastName: 'Білоцька', patronymic: 'Сергіївна' },
    { id: 7, firstName: 'Діана', lastName: 'Блищик', patronymic: 'Вадимівна' },
    { id: 8, firstName: 'Артем', lastName: 'Бондаренко', patronymic: 'Сергійович' },
    { id: 9, firstName: 'Артем', lastName: 'Бронський', patronymic: 'Романович' },
    { id: 10, firstName: 'Назарій', lastName: 'Войтюк', patronymic: 'Васильович' },
    { id: 11, firstName: 'Ірина', lastName: 'Гаврилюк', patronymic: 'Михайлівна' },
    { id: 12, firstName: 'Софія', lastName: 'Гнатюк', patronymic: 'Іванівна' },
    { id: 13, firstName: 'Євген', lastName: 'Демчук', patronymic: 'Степанович' },
    { id: 14, firstName: 'Ілля', lastName: 'Дорошенко', patronymic: 'Петрович' },
    { id: 15, firstName: 'Марта', lastName: 'Жук', patronymic: 'Володимирівна' },
    { id: 16, firstName: 'Олег', lastName: 'Зайцев', patronymic: 'Андрійович' },
    { id: 17, firstName: 'Олена', lastName: 'Коваль', patronymic: 'Ігорівна' },
    { id: 18, firstName: 'Андрій', lastName: 'Кравчук', patronymic: 'Михайлович' },
    { id: 19, firstName: 'Катерина', lastName: 'Кирилюк', patronymic: 'Олександрівна' },
    { id: 20, firstName: 'Юрій', lastName: 'Литвин', patronymic: 'Григорович' },
    { id: 21, firstName: 'Дарина', lastName: 'Луценко', patronymic: 'Сергіївна' },
    { id: 22, firstName: 'Анастасія', lastName: 'Мельник', patronymic: 'Іванівна' },
    { id: 23, firstName: 'Роман', lastName: 'Мельничук', patronymic: 'Борисович' },
    { id: 24, firstName: 'Олександр', lastName: 'Мороз', patronymic: 'Артемович' },
    { id: 25, firstName: 'Ігор', lastName: 'Нечипоренко', patronymic: 'Степанович' },
    { id: 26, firstName: 'Юлія', lastName: 'Павленко', patronymic: 'Олегівна' },
    { id: 27, firstName: 'Марина', lastName: 'Петренко', patronymic: 'Вікторівна' },
    { id: 28, firstName: 'Сергій', lastName: 'Поліщук', patronymic: 'Дмитрович' },
    { id: 29, firstName: 'Анна', lastName: 'Романюк', patronymic: 'Ігорівна' },
    { id: 30, firstName: 'Владислав', lastName: 'Савчук', patronymic: 'Андрійович' },
    { id: 31, firstName: 'Вікторія', lastName: 'Семенюк', patronymic: 'Петрівна' },
    { id: 32, firstName: 'Дмитро', lastName: 'Сидоренко', patronymic: 'Юрійович' },
    { id: 33, firstName: 'Світлана', lastName: 'Ткаченко', patronymic: 'Олександрівна' },
    { id: 34, firstName: 'Олексій', lastName: 'Федорчук', patronymic: 'Миколайович' },
    { id: 35, firstName: 'Тетяна', lastName: 'Хоменко', patronymic: 'Іванівна' },
    { id: 36, firstName: 'Василь', lastName: 'Цимбалюк', patronymic: 'Олегович' },
    { id: 37, firstName: 'Софія', lastName: 'Черненко', patronymic: 'Петрівна' },
    { id: 38, firstName: 'Андрій', lastName: 'Шевченко', patronymic: 'Григорович' },
    { id: 39, firstName: 'Лідія', lastName: 'Шевчук', patronymic: 'Анатоліївна' },
    { id: 40, firstName: 'Наталія', lastName: 'Юрченко', patronymic: 'Олександрівна' },
    { id: 41, firstName: 'Олег', lastName: 'Яковенко', patronymic: 'Васильович' },
    { id: 42, firstName: 'Аліна', lastName: 'Козак', patronymic: 'Романівна' },
    { id: 43, firstName: 'Ігор', lastName: 'Сидор', patronymic: 'Петрович' },
    { id: 44, firstName: 'Марія', lastName: 'Левченко', patronymic: 'Олександрівна' },
    { id: 45, firstName: 'Євгенія', lastName: 'Костюк', patronymic: 'Іванівна' },
    { id: 46, firstName: 'Володимир', lastName: 'Гончар', patronymic: 'Степанович' },
    { id: 47, firstName: 'Олександра', lastName: 'Зінченко', patronymic: 'Петрівна' },
    { id: 48, firstName: 'Віталій', lastName: 'Коваленко', patronymic: 'Юрійович' },
    { id: 49, firstName: 'Ілона', lastName: 'Пархоменко', patronymic: 'Ігорівна' },
    { id: 50, firstName: 'Ростислав', lastName: 'Рябченко', patronymic: 'Олегович' },
];

// Generate 25 lessons (mix of lectures and practicals)
export const lessons: Lesson[] = [
    { id: 1, date: '10.09.2025', type: 'lecture', number: 1 },
    { id: 2, date: '18.09.2025', type: 'lecture', number: 2 },
    { id: 3, date: '23.09.2025', type: 'practical', number: 1 },
    { id: 4, date: '25.09.2025', type: 'lecture', number: 3 },
    { id: 5, date: '30.09.2025', type: 'practical', number: 2 },
    { id: 6, date: '02.10.2025', type: 'lecture', number: 4 },
    { id: 7, date: '07.10.2025', type: 'practical', number: 3 },
    { id: 8, date: '09.10.2025', type: 'lecture', number: 5 },
    { id: 9, date: '14.10.2025', type: 'practical', number: 4 },
    { id: 10, date: '16.10.2025', type: 'lecture', number: 6 },
    { id: 11, date: '21.10.2025', type: 'practical', number: 5 },
    { id: 12, date: '23.10.2025', type: 'lecture', number: 7 },
    { id: 13, date: '28.10.2025', type: 'practical', number: 6 },
    { id: 14, date: '30.10.2025', type: 'lecture', number: 8 },
    { id: 15, date: '04.11.2025', type: 'practical', number: 7 },
    { id: 16, date: '06.11.2025', type: 'lecture', number: 9 },
    { id: 17, date: '11.11.2025', type: 'practical', number: 8 },
    { id: 18, date: '13.11.2025', type: 'lecture', number: 10 },
    { id: 19, date: '18.11.2025', type: 'practical', number: 9 },
    { id: 20, date: '20.11.2025', type: 'lecture', number: 11 },
    { id: 21, date: '25.11.2025', type: 'practical', number: 10 },
    { id: 22, date: '27.11.2025', type: 'lecture', number: 12 },
    { id: 23, date: '02.12.2025', type: 'practical', number: 11 },
    { id: 24, date: '04.12.2025', type: 'lecture', number: 13 },
    { id: 25, date: '09.12.2025', type: 'practical', number: 12 },
];

// Generate realistic grades data
function generateGrades(): Grade[] {
    const grades: Grade[] = [];

    students.forEach(student => {
        lessons.forEach(lesson => {
            // 85% attendance rate on average with variation
            const attendanceChance = Math.random();
            const attended = attendanceChance > 0.15 + (Math.random() * 0.2 - 0.1);

            // Score between 0-10 if attended, null if not
            let score = null;
            if (attended) {
                // Most scores between 5-9
                const scoreRandom = Math.random();
                if (scoreRandom < 0.05) {
                    score = Math.floor(Math.random() * 5); // 0-4 (5% of time)
                } else if (scoreRandom < 0.15) {
                    score = 10; // 10 (10% of time)
                } else {
                    score = Math.floor(Math.random() * 5) + 5; // 5-9 (85% of time)
                }
            }

            // Extra points (0-2) occasionally
            const extraPoints = Math.random() < 0.2 ? Math.floor(Math.random() * 3) : 0;

            grades.push({
                studentId: student.id,
                lessonId: lesson.id,
                score,
                extraPoints,
                attended,
            });
        });
    });

    return grades;
}

export const initialGrades = generateGrades();
