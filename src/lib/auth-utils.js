import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const COOKIE_NAME = "library_auth_token";

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME);

  if (!token) {
    return null;
  }

  try {
    const decoded = verify(token.value, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}
