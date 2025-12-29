import { memo } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => adjustScore(-0.5)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          min="0"
          step="0.5"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="text-center"
          placeholder="-"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => adjustScore(0.5)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        {PRESET_SCORES_MAIN.map((value) => (
          <Button
            key={value}
            type="button"
            variant={score === value.toString() ? "default" : "outline"}
            size="sm"
            onClick={() => setScore(value.toString())}
          >
            {value}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        {PRESET_SCORES_HALF.map((value) => (
          <Button
            key={value}
            type="button"
            variant={score === value.toString() ? "default" : "outline"}
            size="sm"
            onClick={() => setScore(value.toString())}
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
});
