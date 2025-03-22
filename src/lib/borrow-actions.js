"use server";

import { connectToDatabase } from "@/lib/db";
import { Book, Borrow } from "@/lib/models";
import { revalidatePath } from "next/cache";

export async function borrowBook(borrowData) {
  try {
    await connectToDatabase();

    // Check if book is available
    const book = await Book.findById(borrowData.bookId);

    if (!book || !book.available) {
      return { success: false, error: "Book is not available" };
    }

    // Create new borrow record
    const newBorrow = new Borrow({
      book: borrowData.bookId,
      user: borrowData.userId,
      borrowDate: new Date(),
      dueDate: borrowData.dueDate,
    });

    await newBorrow.save();

    // Update book availability
    await Book.findByIdAndUpdate(borrowData.bookId, { available: false });

    revalidatePath("/borrows");
    revalidatePath("/books");

    return { success: true };
  } catch (error) {
    console.error("Borrow book error:", error);
    return { success: false, error: "Failed to borrow book" };
  }
}

export async function returnBook(borrowId) {
  try {
    await connectToDatabase();

    // Find borrow record
    const borrow = await Borrow.findById(borrowId);

    if (!borrow) {
      return { success: false, error: "Borrow record not found" };
    }

    // Update borrow record
    await Borrow.findByIdAndUpdate(borrowId, {
      returnDate: new Date(),
    });

    // Update book availability
    await Book.findByIdAndUpdate(borrow.book, { available: true });

    revalidatePath("/borrows");
    revalidatePath("/books");

    return { success: true };
  } catch (error) {
    console.error("Return book error:", error);
    return { success: false, error: "Failed to return book" };
  }
}

export async function getBorrows() {
  try {
    await connectToDatabase();

    const borrows = await Borrow.find()
      .populate("book")
      .populate("user", "-password")
      .sort({ borrowDate: -1 });

    return { success: true, data: borrows };
  } catch (error) {
    console.error("Get borrows error:", error);
    return { success: false, error: "Failed to fetch borrows" };
  }
}
