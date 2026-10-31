import { NextResponse } from "next/server";
import { requireAdmin, AdminAuthError } from "@/features/admin/session";
import { getPortfolioData } from "@/features/portfolio/server/data";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const data = await getPortfolioData();

    return new NextResponse(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="shivam-portfolio-backup.json"`,
      },
    });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to generate backup" }, { status: 500 });
  }
}
