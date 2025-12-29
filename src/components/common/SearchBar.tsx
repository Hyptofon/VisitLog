import React, { memo, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input.tsx";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = memo(function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div className="relative w-full md:w-96">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Пошук студента..."
        value={value}
        onChange={handleChange}
        className="pl-9 bg-white"
      />
    </div>
  );
});
