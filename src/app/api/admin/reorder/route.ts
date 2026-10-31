import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, AdminAuthError } from "@/features/admin/session";
import { reorderProjects } from "@/features/portfolio/server/data";
import { z } from "zod";

const ReorderSchema = z.object({
  section: z.literal("projects"),
  orderedIds: z.array(z.string()),
});

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { section, orderedIds } = ReorderSchema.parse(body);

    let updatedPortfolio;
    if (section === "projects") {
      updatedPortfolio = await reorderProjects(orderedIds);
    }

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      portfolio: updatedPortfolio,
    });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Reorder failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reorder items" },
      { status: 400 }
    );
  }
}
