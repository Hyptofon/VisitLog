import React, { memo, useCallback } from "react";
import { Zap } from "lucide-react";
import { Label } from "@/components/ui/label.tsx";

interface QuickModeToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const QuickModeToggle = memo(function QuickModeToggle({
  checked,
  onChange,
}: QuickModeToggleProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
    },
    [onChange],
  );

  return (
    <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800">
      <input
        type="checkbox"
        id="quickMode"
        checked={checked}
        onChange={handleChange}
        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
      />
      <Label
        htmlFor="quickMode"
        className="text-sm font-medium cursor-pointer flex items-center gap-1.5 select-none"
      >
        <Zap
          className={`h-4 w-4 ${checked ? "text-green-600" : "text-gray-500"}`}
        />
        Швидкий режим
      </Label>
    </div>
  );
});
