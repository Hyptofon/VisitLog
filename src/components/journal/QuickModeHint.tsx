import { memo } from "react";

interface QuickModeHintProps {
  visible: boolean;
}

export const QuickModeHint = memo(function QuickModeHint({
  visible,
}: QuickModeHintProps) {
  if (!visible) return null;

  return (
    <div className="mt-2 text-xs text-green-700 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded border border-green-200 dark:border-green-800">
      <span className="font-semibold">Підказка:</span> Один клік - переключити
      присутність/відсутність. Для балів та коментарів вимкніть швидкий режим.
    </div>
  );
});
