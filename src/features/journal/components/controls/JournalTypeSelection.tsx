import { LayoutGrid } from "lucide-react";
import { Card } from "@/components/ui/card.tsx";
import { JournalType } from "@/types";
import { JournalTypeButton } from "./JournalTypeButton.tsx";

interface JournalTypeSelectionProps {
  onSelect: (type: JournalType) => void;
}

export function JournalTypeSelection({ onSelect }: JournalTypeSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-6 md:p-8 dark:bg-gray-800/50 dark:border-gray-700">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="mb-2 text-xl md:text-2xl font-bold">
            Журнал відвідувань
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Web-дизайн та Web-програмування
          </p>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Викладач: Зубенко Ігор Ростиславович
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">
            Групи: Web-дизайн та Web-програмування-12, Web-дизайн та
            Web-програмування-11
          </p>
        </div>

        <div className="space-y-3 md:space-y-4">
          <p className="text-center text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
            Оберіть тип занять для перегляду журналу:
          </p>

          <JournalTypeButton
            onClick={() => onSelect("all")}
            className="bg-gray-400 hover:bg-gray-500"
            icon={LayoutGrid}
            title="Усі заняття"
            description="Перегляд всіх лекцій, практичних та лабораторних"
          />

          <JournalTypeButton
            onClick={() => onSelect("lecture")}
            className="bg-green-400 hover:bg-green-500"
            title="Лекції"
            description="Теоретичний матеріал та основні концепції"
          />

          <JournalTypeButton
            onClick={() => onSelect("practical")}
            className="bg-blue-400 hover:bg-blue-500"
            title="Практичні"
            description="Практичні завдання"
          />

          <JournalTypeButton
            onClick={() => onSelect("laboratory")}
            className="bg-purple-400 hover:bg-purple-500"
            title="Лабораторні"
            description="Лабораторні роботи та дослідження"
          />
        </div>
      </Card>
    </div>
  );
}
