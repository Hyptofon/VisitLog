import { useState } from 'react';
import { ArrowLeft, Download, FileSpreadsheet, Menu } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs'; // Припустимо, що у вас є цей компонент
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet'; // і цей
import { CombinedTable } from './components/CombinedTable';
import { StatsCards } from './components/StatsCards';
import { SearchBar } from './components/SearchBar';
import { students, lessons, initialGrades } from './data/mockData';
import { Grade } from './types';
import { exportToExcel, exportToPDF } from './utils/exportUtils';
import { toast } from 'sonner'; // Припустимо, що використовуєте 'sonner' для сповіщень

export default function App() {
    const [selectedType, setSelectedType] = useState<'lecture' | 'practical' | null>(null);
    const [grades, setGrades] = useState<Grade[]>(initialGrades);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'lecture' | 'practical'>('lecture');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleGradeUpdate = (updatedGrade: Grade) => {
        setGrades(prevGrades =>
            prevGrades.map(g =>
                (g.studentId === updatedGrade.studentId && g.lessonId === updatedGrade.lessonId)
                    ? updatedGrade
                    : g
            )
        );
        toast.success('Оновлено успішно');
    };

    const handleExportExcel = () => {
        exportToExcel(students, lessons.filter(l => l.type === activeTab), grades, activeTab);
        toast.success('Експортовано в Excel');
    };

    const handleExportPDF = () => {
        exportToPDF(students, lessons.filter(l => l.type === activeTab), grades, activeTab);
        toast.success('Підготовлено до друку');
    };

    // Screen for choosing lesson type
    if (!selectedType) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <Card className="max-w-2xl w-full p-6 md:p-8">
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
                            onClick={() => { setSelectedType('lecture'); setActiveTab('lecture'); }}
                            className="w-full h-auto py-4 md:py-6"
                            size="lg"
                        >
                            <div className="text-left w-full">
                                <div className="text-base md:text-lg font-semibold mb-1">📚 Лекції</div>
                                <div className="text-xs md:text-sm opacity-80 font-normal">
                                    Теоретичний матеріал та основні концепції
                                </div>
                            </div>
                        </Button>

                        <Button
                            onClick={() => { setSelectedType('practical'); setActiveTab('practical'); }}
                            className="w-full h-auto py-4 md:py-6"
                            size="lg"
                            variant="secondary"
                        >
                            <div className="text-left w-full">
                                <div className="text-base md:text-lg font-semibold mb-1">💻 Практичні</div>
                                <div className="text-xs md:text-sm opacity-80 font-normal">
                                    Практичні завдання та лабораторні роботи
                                </div>
                            </div>
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const filteredLessons = lessons.filter(l => l.type === activeTab);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
                <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
                    {/* Mobile Header */}
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
                        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'lecture' | 'practical')} className="mb-3">
                            <TabsList className="w-full">
                                <TabsTrigger value="lecture" className="flex-1 text-xs">
                                    📚 Лекції ({lessons.filter(l => l.type === 'lecture').length})
                                </TabsTrigger>
                                <TabsTrigger value="practical" className="flex-1 text-xs">
                                    💻 Практичні ({lessons.filter(l => l.type === 'practical').length})
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    </div>

                    {/* Desktop Header */}
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
                            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'lecture' | 'practical')}>
                                <TabsList>
                                    <TabsTrigger value="lecture">📚 Лекції</TabsTrigger>
                                    <TabsTrigger value="practical">💻 Практичні</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <SearchBar value={searchQuery} onChange={setSearchQuery} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
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