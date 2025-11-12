// File: components/AddStockDialog.tsx

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus } from "lucide-react"; // Import Plus icon

interface AddStockDialogProps {
  onStockAdded: (ticker: string) => void;
}

export function AddStockDialog({ onStockAdded }: AddStockDialogProps) {
  const [ticker, setTicker] = useState("");
  const [open, setOpen] = useState(false);
  // --- New state for the validation loading ---
  const [isValidating, setIsValidating] = useState(false);

  // --- Updated handler ---
  const handleValidateAndAdd = async () => {
    if (!ticker.trim()) {
      toast.error("Please enter a ticker.");
      return;
    }

    const upperTicker = ticker.toUpperCase();
    setIsValidating(true);
    const validationToastId = toast.loading(`Validating ${upperTicker}...`);

    try {
      // 1. Call your new validation route
      const response = await fetch(`/api/validate/${upperTicker}`);

      if (!response.ok) {
        // Ticker is invalid or not found
        const data = await response.json();
        toast.error(data.error || `Invalid ticker: ${upperTicker}`, { id: validationToastId });
        return;
      }

      // 2. If validation is successful (response.ok)
      toast.dismiss(validationToastId); // Dismiss the "Validating..." toast
      onStockAdded(upperTicker); // Call the dashboard's add function
      
      // 3. Close the dialog and reset the form
      setOpen(false);
      setTicker("");

    } catch (error) {
      // For network errors, etc.
      toast.error("Validation failed. Please try again.", { id: validationToastId });
      console.error("Validation error:", error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="-ml-1 h-5 w-5" />
          Add Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to Watchlist</DialogTitle>
          <DialogDescription>
            Enter a stock ticker (e.g., AAPL) to add it to your watchlist.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleValidateAndAdd();
          }}
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ticker" className="text-right">
              Ticker
            </Label>
            <Input
              id="ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())} // Auto-uppercase
              className="col-span-3"
              placeholder="AAPL"
              disabled={isValidating} // Disable input while validating
            />
          </div>
        </form>
        <DialogFooter>
          {/* --- Button handler is updated --- */}
          <Button onClick={handleValidateAndAdd} type="submit" disabled={isValidating} className="w-full sm:w-auto">
            {isValidating ? "Validating..." : "Add Stock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}