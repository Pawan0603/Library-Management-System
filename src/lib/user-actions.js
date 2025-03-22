"use server";

import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models";
import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";

export async function addUser(userData) {
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
      role: userData.role,
    });

    await newUser.save();
    revalidatePath("/users");

    return { success: true };
  } catch (error) {
    console.error("Add user error:", error);
    return { success: false, error: "Failed to add user" };
  }
}

export async function updateUser(userId, userData) {
  try {
    await connectToDatabase();

    // If password is provided, hash it
    if (userData.password) {
      userData.password = await hash(userData.password, 10);
    }

    await User.findByIdAndUpdate(userId, userData);
    revalidatePath("/users");

    return { success: true };
  } catch (error) {
    console.error("Update user error:", error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUser(userId) {
  try {
    await connectToDatabase();

    await User.findByIdAndDelete(userId);
    revalidatePath("/users");

    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function getUsers() {
  try {
    await connectToDatabase();

    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return { success: true, data: users };
  } catch (error) {
    console.error("Get users error:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}
