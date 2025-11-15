/*
  File: components/CommandPalette.tsx
  Purpose: Implements SECTION 5: "Command Palette (Cmd+K)".
  This is a new component for pro-user navigation.
*/
"use client";
import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"; // Assuming /ui/command exists
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Search, Moon, Sun, Laptop, Settings } from "lucide-react";

// This component is a stubbed implementation.
// It requires `components/ui/command`, which is not provided,
// so I'm mocking its appearance with `Dialog` components.
// In a real scenario, this would be built with `cmdk`.

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStock: (ticker: string) => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  onAddStock,
}: CommandPaletteProps) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [search, setSearch] = React.useState("");

  const runAction = (action: () => void) => {
    action();
    onOpenChange(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    // Mock command parsing
    if (value.toLowerCase().startsWith("add ")) {
      const ticker = value.split(" ")[1];
      if (ticker) {
        // This is a mock. A real impl would show this as a command.
        // runAction(() => onAddStock(ticker.toUpperCase()));
        // setSearch("");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <div className="flex items-center border-b px-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Type a command or search..."
            className="h-12 border-0 bg-transparent shadow-none focus-visible:ring-0"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div className="p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Suggestions
          </p>
          <div className="flex flex-col gap-1">
            <CommandItemMock
              onSelect={() => runAction(() => router.push("/stock/AAPL"))}
            >
              <Search className="mr-2 h-4 w-4" /> Go to... <b className="ml-1">AAPL</b>
            </CommandItemMock>
            <CommandItemMock
              onSelect={() => runAction(() => onAddStock("TSLA"))}
            >
              <Search className="mr-2 h-4 w-4" /> Add... <b className="ml-1">TSLA</b>
            </CommandItemMock>
            <CommandItemMock onSelect={() => runAction(() => setTheme("light"))}>
              <Sun className="mr-2 h-4 w-4" /> Toggle Theme... Light
            </CommandItemMock>
            <CommandItemMock onSelect={() => runAction(() => setTheme("dark"))}>
              <Moon className="mr-2 h-4 w-4" /> Toggle Theme... Dark
            </CommandItemMock>
            <CommandItemMock
              onSelect={() => runAction(() => toast("Navigating to settings..."))}
            >
              <Settings className="mr-2 h-4 w-4" /> Go to Settings
            </CommandItemMock>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Mock CommandItem
function CommandItemMock({
  children,
  onSelect,
}: {
  children: React.ReactNode;
  onSelect: () => void;
}) {
  return (
    <div
      className="flex cursor-pointer items-center rounded-md p-2 text-sm hover:bg-accent"
      onClick={onSelect}
    >
      {children}
    </div>
  );
}