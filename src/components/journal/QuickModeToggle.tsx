import { Zap } from 'lucide-react';
import { Label } from '../ui/label';

interface QuickModeToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export function QuickModeToggle({ checked, onChange }: QuickModeToggleProps) {
    return (
        <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800">
            <input
                type="checkbox"
                id="quickMode"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
            />
            <Label
                htmlFor="quickMode"
                className="text-sm font-medium cursor-pointer flex items-center gap-1.5 select-none"
            >
                <Zap className={`h-4 w-4 ${checked ? 'text-green-600' : 'text-gray-500'}`} />
                Швидкий режим
            </Label>
        </div>
    );
}