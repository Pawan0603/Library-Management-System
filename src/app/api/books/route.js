import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Book } from "@/lib/models";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const available = url.searchParams.get("available");
    const search = url.searchParams.get("search");

    // Build query
    const query = {};

    if (category) {
      query.category = category;
    }

    if (available) {
      query.available = available === "true";
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } }
      ];
    }

    await connectToDatabase();
    const books = await Book.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ books });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// This is handled by server actions, but we'll add it here for completeness
export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, author, category } = body;

    if (!title || !author || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    const newBook = new Book({
      title,
      author,
      category,
      available: true,
    });

    await newBook.save();

    return NextResponse.json(
      {
        message: "Book created successfully",
        book: newBook,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
