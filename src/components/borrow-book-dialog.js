"use client"

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner"
import { borrowBook } from "@/lib/borrow-actions";
import { useBorrows } from "@/lib/hooks/use-borrows";
import { useBooks } from "@/lib/hooks/use-books";
import { useUsers } from "@/lib/hooks/use-users";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function BorrowBookDialog({ children }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useBorrows();
  const { books } = useBooks();
  const { users } = useUsers();

  const [formData, setFormData] = useState({
    bookId: "",
    userId: "",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  });

  const availableBooks = books?.filter((book) => book.available) || [];

  const handleBookChange = (value) => {
    setFormData((prev) => ({ ...prev, bookId: value }));
  };

  const handleUserChange = (value) => {
    setFormData((prev) => ({ ...prev, userId: value }));
  };

  const handleDateChange = (date) => {
    if (date) {
      setFormData((prev) => ({ ...prev, dueDate: date }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await borrowBook(formData);
      mutate();
      toast.success("Book borrowed",{
        description: "The book has been successfully borrowed.",
      });
      setFormData({
        bookId: "",
        userId: "",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      });
      setOpen(false);
    } catch (error) {
      toast.error("Error",{
        description: "Failed to borrow the book.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Borrow Book</DialogTitle>
            <DialogDescription>Record a book borrowing.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="book">Book</Label>
              <Select value={formData.bookId} onValueChange={handleBookChange} required>
                <SelectTrigger id="book">
                  <SelectValue placeholder="Select book" />
                </SelectTrigger>
                <SelectContent>
                  {availableBooks.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No books available
                    </SelectItem>
                  ) : (
                    availableBooks.map((book) => (
                      <SelectItem key={book._id} value={book._id}>
                        {book.title} by {book.author}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user">User</Label>
              <Select value={formData.userId} onValueChange={handleUserChange} required>
                <SelectTrigger id="user">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={handleDateChange}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || availableBooks.length === 0}>
              {isLoading ? "Processing..." : "Borrow Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
