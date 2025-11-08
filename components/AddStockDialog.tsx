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

export function AddStockDialog() {
  const [ticker, setTicker] = useState("");

  const handleAddStock = () => {
    // Add logic to save the ticker to Firestore here
    console.log("Adding stock:", ticker.toUpperCase());
    toast.success(`${ticker.toUpperCase()} added to watchlist!`);
    // You would also close the dialog here, which can be done
    // by controlling the 'open' prop of <Dialog />
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-6">Add a Stock</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to Watchlist</DialogTitle>
          <DialogDescription>
            Enter a stock ticker (e.g., AAPL) to add it to your watchlist.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ticker" className="text-right">
              Ticker
            </Label>
            <Input
              id="ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="col-span-3"
              placeholder="AAPL"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddStock}>Add Stock</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}