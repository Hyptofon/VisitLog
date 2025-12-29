import { LucideIcon } from "lucide-react";
import { Button } from "../ui/button";

interface JournalTypeButtonProps {
  onClick: () => void;
  className?: string;
  icon?: LucideIcon;
  title: string;
  description: string;
}

export function JournalTypeButton({
  onClick,
  className,
  icon: Icon,
  title,
  description,
}: JournalTypeButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`w-full h-auto py-4 md:py-6 ${className || ""}`}
      size="lg"
    >
      <div
        className={`text-left w-full ${Icon ? "flex items-center gap-4" : ""}`}
      >
        {Icon && <Icon className="h-8 w-8 flex-shrink-0" />}
        <div>
          <div className="text-base md:text-lg font-semibold mb-1">{title}</div>
          <div className="text-xs md:text-sm opacity-80 font-normal">
            {description}
          </div>
        </div>
      </div>
    </Button>
  );
}
