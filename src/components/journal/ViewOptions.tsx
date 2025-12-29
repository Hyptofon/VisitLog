import React, { useState, memo } from "react";
import { SlidersHorizontal, List, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

interface ViewOptionsProps {
  viewMode: "pagination" | "scroll";
  setViewMode: (mode: "pagination" | "scroll") => void;
  lessonsPerPage: number;
  setLessonsPerPage: (count: number) => void;
}

const PRESET_VALUES = ["6", "12", "18", "24"];

export const ViewOptions = memo(function ViewOptions({
  viewMode,
  setViewMode,
  lessonsPerPage,
  setLessonsPerPage,
}: ViewOptionsProps) {
  const [initialSettings, setInitialSettings] = useState({
    viewMode,
    lessonsPerPage,
  });

  const [isCustom, setIsCustom] = useState(
    !PRESET_VALUES.includes(String(lessonsPerPage)),
  );
  const [customValue, setCustomValue] = useState(
    !PRESET_VALUES.includes(String(lessonsPerPage))
      ? String(lessonsPerPage)
      : "",
  );

  const handlePopoverOpenChange = (open: boolean) => {
    if (open) {
      setInitialSettings({ viewMode, lessonsPerPage });
      setIsCustom(!PRESET_VALUES.includes(String(lessonsPerPage)));
      setCustomValue(
        !PRESET_VALUES.includes(String(lessonsPerPage))
          ? String(lessonsPerPage)
          : "",
      );
    } else if (
      initialSettings.viewMode !== viewMode ||
      initialSettings.lessonsPerPage !== lessonsPerPage
    ) {
      toast.success("Налаштування вигляду оновлено!");
    }
  };

  const handleSelectChange = (value: string) => {
    if (value === "custom") {
      setIsCustom(true);
      setTimeout(() => document.getElementById("custom-lessons")?.focus(), 0);
    } else {
      setIsCustom(false);
      setCustomValue("");
      setLessonsPerPage(Number(value));
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    setCustomValue(onlyNumbers);
  };

  const handleApplyCustom = () => {
    const numValue = parseInt(customValue, 10);
    if (numValue > 0) {
      setLessonsPerPage(numValue);
      toast.success(`Кількість дат встановлено: ${numValue}`);
    } else {
      toast.error("Введіть коректне число!");
    }
  };

  const currentSelectValue = isCustom ? "custom" : String(lessonsPerPage);

  return (
    <Popover onOpenChange={handlePopoverOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Налаштування</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="grid gap-6">
          <div className="space-y-3">
            <h4 className="font-medium leading-none text-base">
              Режим перегляду
            </h4>
            <RadioGroup
              value={viewMode}
              onValueChange={(value) =>
                setViewMode(value as "pagination" | "scroll")
              }
            >
              <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent transition-colors">
                <RadioGroupItem value="pagination" id="r-pagination" />
                <Label
                  htmlFor="r-pagination"
                  className="font-normal flex items-center gap-2 cursor-pointer"
                >
                  <List className="h-4 w-4 text-muted-foreground" />
                  Пагінація (по сторінках)
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent transition-colors">
                <RadioGroupItem value="scroll" id="r-scroll" />
                <Label
                  htmlFor="r-scroll"
                  className="font-normal flex items-center gap-2 cursor-pointer"
                >
                  <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                  Скрол (усі дати)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {viewMode === "pagination" && (
            <div className="space-y-3">
              <h4 className="font-medium leading-none text-base">
                Кількість дат
              </h4>
              <Select
                value={currentSelectValue}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть кількість..." />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_VALUES.map((val) => (
                    <SelectItem key={val} value={val}>
                      {val} дат на сторінці
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Інша кількість...</SelectItem>
                </SelectContent>
              </Select>

              {isCustom && (
                <div className="flex gap-2 mt-2">
                  <Input
                    id="custom-lessons"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Введіть число..."
                    value={customValue}
                    onChange={handleCustomInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleApplyCustom();
                    }}
                  />
                  <Button size="sm" onClick={handleApplyCustom}>
                    Застосувати
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
});
