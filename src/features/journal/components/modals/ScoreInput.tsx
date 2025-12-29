import { memo, useCallback } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

// --- Допоміжний компонент для кнопки пресету ---
interface PresetButtonProps {
  value: number;
  currentScore: string;
  onSelect: (value: string) => void;
}

const PresetButton = memo(function PresetButton({
  value,
  currentScore,
  onSelect,
}: PresetButtonProps) {
  const handleClick = useCallback(() => {
    onSelect(value.toString());
  }, [onSelect, value]);

  return (
    <Button
      type="button"
      variant={currentScore === value.toString() ? "default" : "outline"}
      size="sm"
      onClick={handleClick}
    >
      {value}
    </Button>
  );
});

interface ScoreInputProps {
  score: string;
  setScore: (value: string) => void;
  adjustScore: (delta: number) => void;
}

const PRESET_SCORES_MAIN = [5, 6, 7, 8, 9, 10, 12, 15, 20];
const PRESET_SCORES_HALF = [4.5, 5.5, 6.5, 7.5, 8.5, 9.5];

export const ScoreInput = memo(function ScoreInput({
  score,
  setScore,
  adjustScore,
}: ScoreInputProps) {
  const handleDecrease = useCallback(() => adjustScore(-0.5), [adjustScore]);
  const handleIncrease = useCallback(() => adjustScore(0.5), [adjustScore]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setScore(e.target.value);
    },
    [setScore],
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrease}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          min="0"
          step="0.5"
          value={score}
          onChange={handleChange}
          className="text-center"
          placeholder="-"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrease}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        {PRESET_SCORES_MAIN.map((value) => (
          <PresetButton
            key={value}
            value={value}
            currentScore={score}
            onSelect={setScore}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        {PRESET_SCORES_HALF.map((value) => (
          <PresetButton
            key={value}
            value={value}
            currentScore={score}
            onSelect={setScore}
          />
        ))}
      </div>
    </div>
  );
});
