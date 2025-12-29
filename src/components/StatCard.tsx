import { memo } from "react";
import { Card } from "./ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export const StatCard = memo(function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
}: StatCardProps) {
  return (
    <Card className="p-3 md:p-4 dark:bg-gray-800/50 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-xl md:text-2xl font-semibold">{value}</p>
        </div>
        <div className={`p-2 md:p-3 rounded-lg ${bgColor} dark:bg-opacity-20`}>
          <Icon className={`h-4 w-4 md:h-6 md:w-6 ${color} dark:opacity-80`} />
        </div>
      </div>
    </Card>
  );
});
