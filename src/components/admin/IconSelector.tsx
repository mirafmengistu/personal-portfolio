import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Layout, Server, Database, Cloud, Smartphone, GitBranch, Terminal, Code2, Globe, Lock, TrendingUp, Users, Settings, Shield, Zap } from "lucide-react";
import { FaFigma } from "react-icons/fa";
import { cn } from "@/lib/utils";

// Define icon mapping with actual components
export const iconOptions = [
  { value: "Layout", label: "Frontend", icon: Layout },
  { value: "Server", label: "Backend", icon: Server },
  { value: "Database", label: "Database", icon: Database },
  { value: "Cloud", label: "Cloud", icon: Cloud },
  { value: "Smartphone", label: "Mobile", icon: Smartphone },
  { value: "Figma", label: "Design", icon: FaFigma },
  { value: "GitBranch", label: "Git & Version Control", icon: GitBranch },
  { value: "Terminal", label: "DevOps", icon: Terminal },
  { value: "Code2", label: "Development", icon: Code2 },
  { value: "Globe", label: "Web", icon: Globe },
  { value: "Lock", label: "Security", icon: Lock },
  { value: "TrendingUp", label: "Analytics", icon: TrendingUp },
  { value: "Users", label: "Team", icon: Users },
  { value: "Settings", label: "Configuration", icon: Settings },
  { value: "Shield", label: "Protection", icon: Shield },
  { value: "Zap", label: "Performance", icon: Zap },
];

interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const IconSelector = ({ value, onChange }: IconSelectorProps) => {
  const [open, setOpen] = useState(false);
  
  const selectedIcon = iconOptions.find((icon) => icon.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedIcon ? (
            <div className="flex items-center gap-2">
              <selectedIcon.icon className="h-4 w-4" />
              <span>{selectedIcon.label}</span>
            </div>
          ) : (
            "Select icon..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search icons..." />
          <CommandList>
            <CommandEmpty>No icon found.</CommandEmpty>
            <CommandGroup>
              {iconOptions.map((icon) => {
                const IconComponent = icon.icon;
                return (
                  <CommandItem
                    key={icon.value}
                    value={icon.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <IconComponent className="h-4 w-4" />
                      <span>{icon.label}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === icon.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};