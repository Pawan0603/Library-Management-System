import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Borrow, Book } from "@/lib/models";
import { getCurrentUser } from "@/lib/auth-utils";

export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { borrowId } = body;

    if (!borrowId) {
      return NextResponse.json({ error: "Missing borrow ID" }, { status: 400 });
    }

    await connectToDatabase();

    // Find borrow record
    const borrow = await Borrow.findById(borrowId);

    if (!borrow) {
      return NextResponse.json({ error: "Borrow record not found" }, { status: 404 });
    }

    if (borrow.returnDate) {
      return NextResponse.json({ error: "Book already returned" }, { status: 400 });
    }

    // Update borrow record
    borrow.returnDate = new Date();
    await borrow.save();

    // Update book availability
    await Book.findByIdAndUpdate(borrow.book, { available: true });

    return NextResponse.json({
      message: "Book returned successfully",
      borrow,
    });
  } catch (error) {
    console.error("Error returning book:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
