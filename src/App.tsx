import { useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { CombinedTable } from './components/journal/CombinedTable';
import { StatsCards } from './components/StatsCards';
import { students, lessons, initialGrades } from './data/mockData';
import { Grade, JournalType } from './types';
import { exportToExcel, exportToPDF } from './utils/exportUtils';
import { toast } from 'sonner';
import { Layout } from './components/Layout';

export default function App() {
    const [selectedType, setSelectedType] = useState<JournalType | null>(null);
    const [grades, setGrades] = useState<Grade[]>(initialGrades);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<JournalType>('all');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleGradeUpdate = (updatedGrade: Grade) => {
        setGrades(prevGrades =>
            prevGrades.map(g =>
                (g.studentId === updatedGrade.studentId && g.lessonId === updatedGrade.lessonId)
                    ? updatedGrade
                    : g
            )
        );
    };

    const handleSelectType = (type: JournalType) => {
        setSelectedType(type);
        setActiveTab(type);
    };

    const handleExportExcel = () => {
        exportToExcel(students, filteredLessons, grades, activeTab);
        toast.success('Дані успішно експортовано в Excel', { duration: 3000 });
    };

    const handleExportPDF = () => {
        exportToPDF(students, filteredLessons, grades, activeTab);
        toast.success('Документ підготовлено до друку', { duration: 3000 });
    };

    if (!selectedType) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-800 flex items-center justify-center p-4">
                <Card className="max-w-2xl w-full p-6 md:p-8 dark:bg-gray-800/50 dark:border-gray-700">
                    <div className="text-center mb-6 md:mb-8">
                        <h1 className="mb-2 text-xl md:text-2xl font-bold">Журнал відвідувань</h1>
                        <p className="text-sm md:text-base text-muted-foreground">
                            Web-дизайн та Web-програмування
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">
                            Викладач: Зубенко Ігор Ростиславович
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            Групи: Web-дизайн та Web-програмування-12, Web-дизайн та Web-програмування-11
                        </p>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                        <p className="text-center text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                            Оберіть тип занять для перегляду журналу:
                        </p>

                        <Button
                            onClick={() => handleSelectType('all')}
                            className="w-full h-auto py-4 md:py-6 bg-gray-400 hover:bg-gray-500"
                            size="lg"
                        >
                            <div className="text-left w-full flex items-center gap-4">
                                <LayoutGrid className="h-8 w-8 flex-shrink-0" />
                                <div>
                                    <div className="text-base md:text-lg font-semibold mb-1">Усі заняття</div>
                                    <div className="text-xs md:text-sm opacity-80 font-normal">
                                        Перегляд всіх лекцій, практичних та лабораторних
                                    </div>
                                </div>
                            </div>
                        </Button>

                        <Button
                            onClick={() => handleSelectType('lecture')}
                            className="w-full h-auto py-4 md:py-6 bg-green-400 hover:bg-green-500"
                            size="lg"
                        >
                            <div className="text-left w-full">
                                <div className="text-base md:text-lg font-semibold mb-1"> Лекції</div>
                                <div className="text-xs md:text-sm opacity-80 font-normal">
                                    Теоретичний матеріал та основні концепції
                                </div>
                            </div>
                        </Button>

                        <Button
                            onClick={() => handleSelectType('practical')}
                            className="w-full h-auto py-4 md:py-6 bg-blue-400 hover:bg-blue-500"
                            size="lg"
                        >
                            <div className="text-left w-full">
                                <div className="text-base md:text-lg font-semibold mb-1">Практичні</div>
                                <div className="text-xs md:text-sm opacity-80 font-normal">
                                    Практичні завдання
                                </div>
                            </div>
                        </Button>

                        <Button
                            onClick={() => handleSelectType('laboratory')}
                            className="w-full h-auto py-4 md:py-6 bg-purple-400 hover:bg-purple-500"
                            size="lg"
                        >
                            <div className="text-left w-full">
                                <div className="text-base md:text-lg font-semibold mb-1">Лабораторні</div>
                                <div className="text-xs md:text-sm opacity-80 font-normal">
                                    Лабораторні роботи та дослідження
                                </div>
                            </div>
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const filteredLessons = activeTab === 'all' ? lessons : lessons.filter(l => l.type === activeTab);

    return (
        <Layout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            onBack={() => setSelectedType(null)}
            onExportExcel={handleExportExcel}
            onExportPDF={handleExportPDF}
        >
            <StatsCards
                grades={grades}
                lessons={filteredLessons}
                studentCount={students.length}
                type={activeTab}
            />
            <CombinedTable
                students={students}
                lessons={filteredLessons}
                grades={grades}
                onGradeUpdate={handleGradeUpdate}
                searchQuery={searchQuery}
                type={activeTab}
            />
        </Layout>
    );
}