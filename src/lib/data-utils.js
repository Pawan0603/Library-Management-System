import { connectToDatabase } from "@/lib/db";
import { Book, User, Borrow } from "@/lib/models";

export async function getStats() {
  await connectToDatabase();

  // Get total books
  const totalBooks = await Book.countDocuments();

  // Get borrowed books
  const borrowedBooks = await Book.countDocuments({ available: false });

  // Get available books
  const availableBooks = totalBooks - borrowedBooks;

  // Get total users
  const totalUsers = await User.countDocuments();

  // Get books added this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const booksAddedThisMonth = await Book.countDocuments({
    createdAt: { $gte: startOfMonth },
  });

  // Get books borrowed this week
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const borrowedThisWeek = await Borrow.countDocuments({
    borrowDate: { $gte: startOfWeek },
  });

  // Get active users this month
  const activeUsers = await Borrow.distinct("user", {
    borrowDate: { $gte: startOfMonth },
  }).then((users) => users.length);

  return {
    totalBooks,
    borrowedBooks,
    availableBooks,
    totalUsers,
    booksAddedThisMonth,
    borrowedThisWeek,
    activeUsers,
  };
}
