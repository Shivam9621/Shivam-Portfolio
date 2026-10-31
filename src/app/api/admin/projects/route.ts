import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { requireAdmin, AdminAuthError } from "@/features/admin/session";
import { addProject } from "@/features/portfolio/server/data";
import { ProjectSchema } from "@/features/portfolio/schema";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();

    const projectData = {
      ...body,
      id: body.id || `proj-${nanoid(8)}`,
      slug: body.slug || body.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `project-${Date.now()}`,
    };

    const validated = ProjectSchema.parse(projectData);
    const updatedPortfolio = await addProject(validated);
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      project: validated,
      portfolio: updatedPortfolio,
    });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Failed to create project:", error);
    return NextResponse.json(
      { error: error.errors ? error.errors[0]?.message : error.message || "Failed to create project" },
      { status: 400 }
    );
  }
}
