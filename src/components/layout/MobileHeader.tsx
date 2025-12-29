import { useState, useCallback, memo } from "react";
import { ArrowLeft, Menu } from "lucide-react";
import { Button } from "../ui/button.tsx";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs.tsx";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet.tsx";
import { SearchBar } from "../common/SearchBar.tsx";
import { JournalType } from "@/types";
import { MobileMenu } from "./MobileMenu.tsx";

interface MobileHeaderProps {
  activeTab: JournalType;
  setActiveTab: (type: JournalType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onBack: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
}

export const MobileHeader = memo(function MobileHeader({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onBack,
  onExportExcel,
  onExportPDF,
}: MobileHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = useCallback(
    (v: string) => {
      setActiveTab(v as JournalType);
    },
    [setActiveTab],
  );

  const handleCloseMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-sm font-semibold">Журнал</h1>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <MobileMenu
              onExportExcel={onExportExcel}
              onExportPDF={onExportPDF}
              onClose={handleCloseMenu}
            />
          </SheetContent>
        </Sheet>
      </div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-3">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="all" className="text-xs">
            Усі
          </TabsTrigger>
          <TabsTrigger value="lecture" className="text-xs">
            Лекції
          </TabsTrigger>
          <TabsTrigger value="practical" className="text-xs">
            Практичні
          </TabsTrigger>
          <TabsTrigger value="laboratory" className="text-xs">
            Лабораторні
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
    </div>
  );
});
