import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const colorOptions = [
  { value: "from-blue-500 to-cyan-500", label: "Ocean Blue", colors: ["#3B82F6", "#06B6D4"] },
  { value: "from-green-500 to-emerald-500", label: "Forest Green", colors: ["#22C55E", "#10B981"] },
  { value: "from-yellow-500 to-orange-500", label: "Sunset", colors: ["#EAB308", "#F97316"] },
  { value: "from-purple-500 to-pink-500", label: "Royal Purple", colors: ["#A855F7", "#EC4899"] },
  { value: "from-red-500 to-rose-500", label: "Crimson", colors: ["#EF4444", "#F43F5E"] },
  { value: "from-indigo-500 to-purple-500", label: "Deep Indigo", colors: ["#6366F1", "#A855F7"] },
  { value: "from-cyan-500 to-blue-500", label: "Sky Blue", colors: ["#06B6D4", "#3B82F6"] },
  { value: "from-amber-500 to-yellow-500", label: "Golden", colors: ["#F59E0B", "#EAB308"] },
];

interface ColorSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ColorSelector = ({ value, onChange }: ColorSelectorProps) => {
  const [open, setOpen] = useState(false);
  
  const selectedColor = colorOptions.find((color) => color.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedColor ? (
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded bg-gradient-to-r ${selectedColor.value}`} />
              <span>{selectedColor.label}</span>
            </div>
          ) : (
            "Select color gradient..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <div className="p-2">
          <div className="space-y-2">
            {colorOptions.map((color) => (
              <div
                key={color.value}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-secondary",
                  value === color.value && "bg-secondary"
                )}
                onClick={() => {
                  onChange(color.value);
                  setOpen(false);
                }}
              >
                <div className={`w-8 h-8 rounded bg-gradient-to-r ${color.value}`} />
                <span className="flex-1">{color.label}</span>
                {value === color.value && <Check className="h-4 w-4" />}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};