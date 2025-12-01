import { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { KanjiFormData } from "@/lib/schemas/kanjiSchemas";

interface ReadingsProps {
  control: Control<KanjiFormData>;
  onReadings: string[];
  kunReadings: string[];
  onOnChange: (readings: string[]) => void;
  onKunChange: (readings: string[]) => void;
}

export function Readings({
  onReadings,
  kunReadings,
  onOnChange,
  onKunChange,
}: ReadingsProps) {
  const handleOnAdd = () => {
    onOnChange([...onReadings, ""]);
  };

  const handleOnRemove = (index: number) => {
    if (onReadings.length > 1) {
      onOnChange(onReadings.filter((_, i) => i !== index));
    }
  };

  const handleOnUpdate = (index: number, value: string) => {
    const updated = [...onReadings];
    updated[index] = value;
    onOnChange(updated);
  };

  const handleKunAdd = () => {
    onKunChange([...kunReadings, ""]);
  };

  const handleKunRemove = (index: number) => {
    if (kunReadings.length > 1) {
      onKunChange(kunReadings.filter((_, i) => i !== index));
    }
  };

  const handleKunUpdate = (index: number, value: string) => {
    const updated = [...kunReadings];
    updated[index] = value;
    onKunChange(updated);
  };

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label className="text-lg">ON Readings</Label>
        {onReadings.map((reading, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <Input
              value={reading}
              onChange={(e) => handleOnUpdate(index, e.target.value)}
              className="flex-grow"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOnRemove(index)}
              className="flex-shrink-0"
              disabled={onReadings.length === 1}
            >
              <Trash2 className="w-4 h-4" />
              <span className="sr-only">Remove ON reading</span>
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={handleOnAdd}
          className="mt-2 w-full bg-[#29ABE2] hover:bg-[#1A8ED1] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add ON Reading
        </Button>
      </div>

      <div>
        <Label className="text-lg">KUN Readings</Label>
        {kunReadings.map((reading, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <Input
              value={reading}
              onChange={(e) => handleKunUpdate(index, e.target.value)}
              className="flex-grow"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => handleKunRemove(index)}
              className="flex-shrink-0"
              disabled={kunReadings.length === 1}
            >
              <Trash2 className="w-4 h-4" />
              <span className="sr-only">Remove KUN reading</span>
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={handleKunAdd}
          className="mt-2 w-full bg-[#29ABE2] hover:bg-[#1A8ED1] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add KUN Reading
        </Button>
      </div>
    </div>
  );
}
