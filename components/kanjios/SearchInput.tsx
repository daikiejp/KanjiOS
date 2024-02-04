import { Input } from '@/components/ui/input';
import { SearchInputProps } from '@/types/kanjiTypes';

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <Input
      id="search-kanji"
      type="text"
      placeholder="Search kanji, English or Spanish meaning"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mb-4 focus:ring-[#29ABE2] focus-visible:ring-[#29ABE2] active:ring-[#29ABE2]"
    />
  );
}
