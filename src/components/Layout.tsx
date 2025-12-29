import { ReactNode } from 'react';
import { ArrowLeft, Download, FileSpreadsheet, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { SearchBar } from './SearchBar';
import { JournalType } from '@/types';

interface LayoutProps {
    children: ReactNode;
    activeTab: JournalType;
    setActiveTab: (type: JournalType) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
    onBack: () => void;
    onExportExcel: () => void;
    onExportPDF: () => void;
}

export function Layout({
                           children,
                           activeTab,
                           setActiveTab,
                           searchQuery,
                           setSearchQuery,
                           mobileMenuOpen,
                           setMobileMenuOpen,
                           onBack,
                           onExportExcel,
                           onExportPDF
                       }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-950/50 dark:border-gray-800 border-b sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
                    <div className="md:hidden">
                        <div className="flex items-center justify-between mb-3">
                            <Button variant="ghost" size="sm" onClick={onBack}>
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
                                            onClick={() => { onExportExcel(); setMobileMenuOpen(false); }}
                                        >
                                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                                            Експорт в Excel
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => { onExportPDF(); setMobileMenuOpen(false); }}
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
                                <Button variant="ghost" size="sm" onClick={onBack}>
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Назад
                                </Button>
                                <div>
                                    <h1 className="text-base lg:text-lg font-semibold">Журнал відвідувань - Web-дизайн та Web-програмування</h1>
                                    <p className="text-xs lg:text-sm text-muted-foreground">Викладач: Зубенко Ігор Ростиславович</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={onExportExcel}>
                                    <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel
                                </Button>
                                <Button variant="outline" size="sm" onClick={onExportPDF}>
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
                {children}
            </main>
        </div>
    );
}