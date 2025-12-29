import { memo } from "react";
import { JournalType } from "@/types";
import { MobileHeader } from "./MobileHeader.tsx";
import { DesktopHeader } from "./DesktopHeader.tsx";

interface AppHeaderProps {
  activeTab: JournalType;
  setActiveTab: (type: JournalType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onBack: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
}

export const AppHeader = memo(function AppHeader(props: AppHeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-950/50 dark:border-gray-800 border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
        <MobileHeader {...props} />
        <DesktopHeader {...props} />
      </div>
    </header>
  );
});
