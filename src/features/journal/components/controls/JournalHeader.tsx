import { memo, useMemo } from "react";
import { ViewOptions } from "./ViewOptions.tsx";
import { DatePagination } from "@/components/common/DatePagination.tsx";
import { getHeaderColor } from "@/features/journal/utils/utils";
import { QuickModeToggle } from "./QuickModeToggle.tsx";
import { QuickModeHint } from "./QuickModeHint.tsx";

interface JournalHeaderProps {
  type: "lecture" | "practical" | "laboratory" | "all";
  quickMode: boolean;
  setQuickMode: (value: boolean) => void;
  viewMode: "pagination" | "scroll";
  setViewMode: (mode: "pagination" | "scroll") => void;
  lessonsPerPage: number;
  setLessonsPerPage: (num: number) => void;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const JournalHeader = memo(function JournalHeader({
  type,
  quickMode,
  setQuickMode,
  viewMode,
  setViewMode,
  lessonsPerPage,
  setLessonsPerPage,
  totalPages,
  currentPage,
  onPageChange,
}: JournalHeaderProps) {
  const headerColor = getHeaderColor(type);

  const title = useMemo(() => {
    switch (type) {
      case "lecture":
        return "Журнал відвідування - Лекції";
      case "practical":
        return "Журнал оцінок - Практичні";
      case "laboratory":
        return "Журнал оцінок - Лабораторні";
      case "all":
        return "Загальний журнал";
      default:
        return "Журнал";
    }
  }, [type]);

  return (
    <div className={`p-4 border-b dark:border-gray-700 ${headerColor}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h3 className="text-lg font-semibold">{title}</h3>
          {type === "lecture" && (
            <QuickModeToggle checked={quickMode} onChange={setQuickMode} />
          )}
        </div>

        <div className="flex items-center gap-2">
          <ViewOptions
            viewMode={viewMode}
            setViewMode={setViewMode}
            lessonsPerPage={lessonsPerPage}
            setLessonsPerPage={setLessonsPerPage}
          />
          {viewMode === "pagination" && totalPages > 1 && (
            <DatePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>

      <QuickModeHint visible={type === "lecture" && quickMode} />
    </div>
  );
});
