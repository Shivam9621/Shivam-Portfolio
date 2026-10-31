import { auth } from "@/lib/auth";
import type { Session } from "next-auth";

export class AdminAuthError extends Error {
  statusCode: number;
  constructor(message = "Unauthorized: Admin session required") {
    super(message);
    this.name = "AdminAuthError";
    this.statusCode = 401;
  }
}

export async function getAdminSession(): Promise<Session | null> {
  try {
    const session = await auth();
    if (!session || !session.isAdmin) {
      return null;
    }
    return session;
  } catch (error: any) {
    // If Next.js signals a prerender postponement / dynamic boundary, rethrow so PPR handles it cleanly
    if (
      error?.digest === "HANGING_PROMISE_REJECTION" ||
      error?.digest?.startsWith("NEXT_") ||
      error?.message?.includes("prerender")
    ) {
      throw error;
    }
    console.error("Error retrieving admin session:", error);
    return null;
  }
}

export async function requireAdmin(): Promise<Session> {
  const session = await getAdminSession();
  if (!session) {
    throw new AdminAuthError();
  }
  return session;
}
