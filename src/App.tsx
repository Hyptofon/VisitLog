import { useState } from 'react';
import { CombinedTable } from './components/journal/CombinedTable';
import { StatsCards } from './components/StatsCards';
import { students, lessons, initialGrades } from './data/mockData';
import { Grade, JournalType } from './types';
import { exportToExcel, exportToPDF } from './utils/exportUtils';
import { toast } from 'sonner';
import { Layout } from './components/Layout';
import { JournalTypeSelection } from './components/journal/JournalTypeSelection';

export default function App() {
    const [selectedType, setSelectedType] = useState<JournalType | null>(null);
    const [grades, setGrades] = useState<Grade[]>(initialGrades);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<JournalType>('all');

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
        return <JournalTypeSelection onSelect={handleSelectType} />;
    }

    const filteredLessons = activeTab === 'all' ? lessons : lessons.filter(l => l.type === activeTab);

    return (
        <Layout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
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