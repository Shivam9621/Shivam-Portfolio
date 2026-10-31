import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, AdminAuthError } from "@/features/admin/session";
import { getPortfolioData, upsertPortfolioData } from "@/features/portfolio/server/data";
import { PortfolioDataSchema } from "@/features/portfolio/schema";

export async function GET() {
  try {
    await requireAdmin();
    const data = await getPortfolioData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const validated = PortfolioDataSchema.parse(body);
    const updated = await upsertPortfolioData(validated);
    revalidatePath("/");
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to update portfolio data" }, { status: 400 });
  }
}
