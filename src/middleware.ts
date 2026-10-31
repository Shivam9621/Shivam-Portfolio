import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/features/admin/rate-limit";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/api/admin")) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rl = rateLimit(ip, 60, 60_000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down and try again shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rl.reset),
            "X-RateLimit-Limit": String(rl.limit),
            "X-RateLimit-Remaining": String(rl.remaining),
            "X-RateLimit-Reset": String(rl.reset),
          },
        }
      );
    }

    const session = req.auth;
    if (!session || !session.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin session required" },
        { status: 401 }
      );
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/api/admin/:path*"],
};
