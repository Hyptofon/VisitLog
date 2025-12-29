import { ReactNode } from 'react';
import { JournalType } from '@/types';
import { AppHeader } from './AppHeader';

interface LayoutProps {
    children: ReactNode;
    activeTab: JournalType;
    setActiveTab: (type: JournalType) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
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
                           onBack,
                           onExportExcel,
                           onExportPDF
                       }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <AppHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onBack={onBack}
                onExportExcel={onExportExcel}
                onExportPDF={onExportPDF}
            />
            <main className="container mx-auto px-3 md:px-4 py-4 md:py-6">
                {children}
            </main>
        </div>
    );
}