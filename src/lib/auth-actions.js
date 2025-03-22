"use server";

import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const COOKIE_NAME = "library_auth_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 1 week

export async function loginUser(email, password) {
  try {
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    // Compare password
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return { success: false, error: "Invalid email or password" };
    }

    // Create JWT token
    const token = sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    cookies().set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === "production",
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An error occurred during login" };
  }
}

export async function logoutUser() {
  cookies().delete(COOKIE_NAME);
  return { success: true };
}

export async function registerUser(userData) {
  try {
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      return { success: false, error: "User with this email already exists" };
    }

    // Hash password
    const hashedPassword = await hash(userData.password, 10);

    // Create new user
    const newUser = new User({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || "user",
    });

    await newUser.save();

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "An error occurred during registration" };
  }
}
