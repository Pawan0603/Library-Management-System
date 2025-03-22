import mongoose from "mongoose";

// User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes for better query performance
UserSchema.index({ email: 1 });

// Book Schema
const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes for better query performance
BookSchema.index({ title: 1 });
BookSchema.index({ author: 1 });
BookSchema.index({ category: 1 });
BookSchema.index({ available: 1 });

// Borrow Schema
const BorrowSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  borrowDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    default: null,
  },
});

// Create indexes for better query performance
BorrowSchema.index({ book: 1 });
BorrowSchema.index({ user: 1 });
BorrowSchema.index({ borrowDate: 1 });
BorrowSchema.index({ returnDate: 1 });

// Export models
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const Book = mongoose.models.Book || mongoose.model("Book", BookSchema);
export const Borrow = mongoose.models.Borrow || mongoose.model("Borrow", BorrowSchema);
