import { useCallback, memo } from "react";
import { ArrowLeft, Download, FileSpreadsheet } from "lucide-react";
import { Button } from "../ui/button.tsx";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs.tsx";
import { SearchBar } from "../common/SearchBar.tsx";
import { JournalType } from "@/types";

interface DesktopHeaderProps {
  activeTab: JournalType;
  setActiveTab: (type: JournalType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onBack: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
}

export const DesktopHeader = memo(function DesktopHeader({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onBack,
  onExportExcel,
  onExportPDF,
}: DesktopHeaderProps) {
  const handleTabChange = useCallback(
    (v: string) => {
      setActiveTab(v as JournalType);
    },
    [setActiveTab],
  );

  return (
    <div className="hidden md:block">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <div>
            <h1 className="text-base lg:text-lg font-semibold">
              Журнал відвідувань - Web-дизайн та Web-програмування
            </h1>
            <p className="text-xs lg:text-sm text-muted-foreground">
              Викладач: Тринь Триньович Тринь
            </p>
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
        <Tabs value={activeTab} onValueChange={handleTabChange}>
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
  );
});
