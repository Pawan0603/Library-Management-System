"use server";

import { connectToDatabase } from "@/lib/db";
import { Book } from "@/lib/models";
import { revalidatePath } from "next/cache";

export async function addBook(bookData) {
  try {
    await connectToDatabase();

    const newBook = new Book({
      title: bookData.title,
      author: bookData.author,
      category: bookData.category,
      available: true,
    });

    await newBook.save();
    revalidatePath("/books");

    return { success: true };
  } catch (error) {
    console.error("Add book error:", error);
    return { success: false, error: "Failed to add book" };
  }
}

export async function updateBook(bookId, bookData) {
  try {
    await connectToDatabase();

    await Book.findByIdAndUpdate(bookId, bookData);
    revalidatePath("/books");

    return { success: true };
  } catch (error) {
    console.error("Update book error:", error);
    return { success: false, error: "Failed to update book" };
  }
}

export async function deleteBook(bookId) {
  try {
    await connectToDatabase();

    await Book.findByIdAndDelete(bookId);
    revalidatePath("/books");

    return { success: true };
  } catch (error) {
    console.error("Delete book error:", error);
    return { success: false, error: "Failed to delete book" };
  }
}

export async function getBooks() {
  try {
    await connectToDatabase();

    const books = await Book.find().sort({ createdAt: -1 });

    return { success: true, data: books };
  } catch (error) {
    console.error("Get books error:", error);
    return { success: false, error: "Failed to fetch books" };
  }
}
