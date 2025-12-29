import { Layout } from "@/components/layout/Layout.tsx";
import { StatsCards } from "@/features/journal/components/stats/StatsCards.tsx";
import { CombinedTable } from "@/features/journal/components/table/CombinedTable.tsx";
import { JournalTypeSelection } from "@/features/journal/components/controls/JournalTypeSelection.tsx";
import { useJournalApp } from "./hooks/useJournalApp";

export function JournalPage() {
  const {
    selectedType,
    grades,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    students,
    filteredLessons,
    handleGradeUpdate,
    handleSelectType,
    handleResetType,
    handleExportExcel,
    handleExportPDF,
  } = useJournalApp();

  if (!selectedType) {
    return <JournalTypeSelection onSelect={handleSelectType} />;
  }

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onBack={handleResetType}
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
