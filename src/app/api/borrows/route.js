import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Borrow, Book } from "@/lib/models";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const bookId = url.searchParams.get("bookId");
    const returned = url.searchParams.get("returned");
    const overdue = url.searchParams.get("overdue");

    // Build query
    const query = {};

    if (userId) {
      query.user = userId;
    }

    if (bookId) {
      query.book = bookId;
    }

    if (returned === "true") {
      query.returnDate = { $ne: null };
    } else if (returned === "false") {
      query.returnDate = null;
    }

    if (overdue === "true") {
      const today = new Date();
      query.dueDate = { $lt: today };
      query.returnDate = null;
    }

    await connectToDatabase();
    const borrows = await Borrow.find(query)
      .populate("book")
      .populate("user", "-password")
      .sort({ borrowDate: -1 });

    return NextResponse.json({ borrows });
  } catch (error) {
    console.error("Error fetching borrows:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// This is handled by server actions, but we'll add it here for completeness
export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bookId, userId, dueDate } = body;

    if (!bookId || !userId || !dueDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    // Check if book is available
    const book = await Book.findById(bookId);

    if (!book || !book.available) {
      return NextResponse.json({ error: "Book is not available" }, { status: 400 });
    }

    // Create new borrow record
    const newBorrow = new Borrow({
      book: bookId,
      user: userId,
      borrowDate: new Date(),
      dueDate: new Date(dueDate),
    });

    await newBorrow.save();

    // Update book availability
    await Book.findByIdAndUpdate(bookId, { available: false });

    return NextResponse.json(
      {
        message: "Book borrowed successfully",
        borrow: newBorrow,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error borrowing book:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
