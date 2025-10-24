import { useState } from 'react';
import { ArrowLeft, Download, FileSpreadsheet, Menu, LayoutGrid } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { CombinedTable } from './components/journal/CombinedTable';
import { StatsCards } from './components/StatsCards'
import { SearchBar } from './components/SearchBar';
import { students, lessons, initialGrades } from './data/mockData';
import { Grade } from './types';
import { exportToExcel, exportToPDF } from './utils/exportUtils';
import { toast, Toaster } from 'sonner';

type JournalType = 'lecture' | 'practical' | 'laboratory' | 'all';

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
                <Toaster position="top-right" expand={true} richColors />
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Toaster position="top-right" expand={true} richColors />
            <header className="bg-white dark:bg-gray-950/50 dark:border-gray-800 border-b sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
                    <div className="md:hidden">
                        <div className="flex items-center justify-between mb-3">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedType(null)}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <h1 className="text-sm font-semibold">Журнал</h1>
                            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="sm"><Menu className="h-4 w-4" /></Button>
                                </SheetTrigger>
                                <SheetContent side="right">
                                    <div className="mt-6 space-y-4">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => { handleExportExcel(); setMobileMenuOpen(false); }}
                                        >
                                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                                            Експорт в Excel
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => { handleExportPDF(); setMobileMenuOpen(false); }}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Експорт в PDF
                                        </Button>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as JournalType)} className="mb-3">
                            <TabsList className="w-full grid grid-cols-4">
                                <TabsTrigger value="all" className="text-xs">Усі</TabsTrigger>
                                <TabsTrigger value="lecture" className="text-xs">Лекції</TabsTrigger>
                                <TabsTrigger value="practical" className="text-xs">Практичні</TabsTrigger>
                                <TabsTrigger value="laboratory" className="text-xs">Лабораторні</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    </div>

                    <div className="hidden md:block">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" onClick={() => setSelectedType(null)}>
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Назад
                                </Button>
                                <div>
                                    <h1 className="text-base lg:text-lg font-semibold">Журнал відвідувань - Web-дизайн та Web-програмування</h1>
                                    <p className="text-xs lg:text-sm text-muted-foreground">Викладач: Зубенко Ігор Ростиславович</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleExportExcel}>
                                    <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleExportPDF}>
                                    <Download className="h-4 w-4 mr-2" /> PDF
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as JournalType)}>
                                <TabsList>
                                    <TabsTrigger value="all">Усі заняття</TabsTrigger>
                                    <TabsTrigger value="lecture">Лекції</TabsTrigger>
                                    <TabsTrigger value="practical">Практичні</TabsTrigger>
                                    <TabsTrigger value="laboratory">Лабораторні</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <SearchBar value={searchQuery} onChange={setSearchQuery} />
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-3 md:px-4 py-4 md:py-6">
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
            </main>
        </div>
    );
}