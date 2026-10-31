import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, AdminAuthError } from "@/features/admin/session";
import { updateProject, deleteProject } from "@/features/portfolio/server/data";
import { ProjectSchema } from "@/features/portfolio/schema";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const partialSchema = ProjectSchema.partial();
    const validated = partialSchema.parse(body);

    const updatedPortfolio = await updateProject(id, validated);
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      portfolio: updatedPortfolio,
    });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Failed to update project:", error);
    return NextResponse.json(
      { error: error.errors ? error.errors[0]?.message : error.message || "Failed to update project" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const updatedPortfolio = await deleteProject(id);
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      portfolio: updatedPortfolio,
    });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Failed to delete project:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete project" },
      { status: 400 }
    );
  }
}
