import { memo } from "react";
import { Lesson } from "@/types";
import { JournalHeaderCell } from "./JournalHeaderCell";

interface JournalTableHeaderProps {
  headerColor: string;
  lessons: Lesson[];
  type: "lecture" | "practical" | "laboratory" | "all";
  currentDate: string;
}

export const JournalTableHeader = memo(function JournalTableHeader({
  headerColor,
  lessons,
  type,
  currentDate,
}: JournalTableHeaderProps) {
  return (
    <thead>
      <tr className={headerColor}>
        <th
          className={`sticky left-0 ${headerColor} z-40 px-3 py-3 text-left border-r border-b w-[50px]`}
        >
          <div className="text-sm font-semibold">#</div>
        </th>
        <th
          className={`sticky left-[50px] ${headerColor} z-40 px-4 py-3 text-left border-r border-b min-w-[280px]`}
        >
          <div className="text-sm font-semibold">Студент</div>
        </th>
        <th
          className={`px-3 py-3 border-r border-b ${headerColor} min-w-[80px] text-center`}
        >
          <div className="text-xs font-semibold">Примітки</div>
        </th>
        <th
          className={`px-3 py-3 border-r border-b ${headerColor} min-w-[80px] text-center`}
        >
          <div className="text-xs font-semibold">Інд. план</div>
        </th>
        <th
          className={`px-3 py-3 border-r border-b ${headerColor} min-w-[70px] text-center`}
        >
          <div className="text-sm font-semibold">Сума</div>
        </th>
        {lessons.map((lesson) => (
          <JournalHeaderCell
            key={lesson.id}
            lesson={lesson}
            type={type}
            headerColor={headerColor}
            currentDate={currentDate}
          />
        ))}
        <th
          className={`sticky right-0 ${headerColor} z-30 px-4 py-3 border-l border-b min-w-[138px] shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] text-center`}
        >
          <div className="text-sm font-semibold">Відвідування</div>
        </th>
      </tr>
    </thead>
  );
});
