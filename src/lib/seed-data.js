"use server";

import { connectToDatabase } from "@/lib/db";
import { User, Book } from "@/lib/models";
import { hash } from "bcrypt";

export async function seedDatabase() {
  try {
    await connectToDatabase();

    // Check if there's already data
    const usersCount = await User.countDocuments();
    const booksCount = await Book.countDocuments();

    if (usersCount > 0 || booksCount > 0) {
      return { success: false, message: "Database already has data" };
    }

    // Create admin user
    const adminPassword = await hash("admin123", 10);
    const admin = new User({
      name: "Admin User",
      email: "admin@library.com",
      password: adminPassword,
      role: "admin",
    });
    await admin.save();

    // Create regular user
    const userPassword = await hash("user123", 10);
    const user = new User({
      name: "Regular User",
      email: "user@library.com",
      password: userPassword,
      role: "user",
    });
    await user.save();

    // Create sample books
    const books = [
      { title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", available: true },
      { title: "1984", author: "George Orwell", category: "Fiction", available: true },
      { title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction", available: true },
      { title: "Pride and Prejudice", author: "Jane Austen", category: "Fiction", available: true },
      { title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fiction", available: true },
      { title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", category: "Non-Fiction", available: true },
      { title: "The Art of War", author: "Sun Tzu", category: "Non-Fiction", available: true },
      { title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", available: true },
      { title: "The Lean Startup", author: "Eric Ries", category: "Business", available: true },
      { title: "Atomic Habits", author: "James Clear", category: "Self-Help", available: true },
    ];

    await Book.insertMany(books);

    return {
      success: true,
      message: "Database seeded successfully",
      data: {
        users: [
          { email: "admin@library.com", password: "admin123" },
          { email: "user@library.com", password: "user123" },
        ],
      },
    };
  } catch (error) {
    console.error("Error seeding database:", error);
    return { success: false, error: "Failed to seed database" };
  }
}
