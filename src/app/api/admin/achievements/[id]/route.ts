import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, AdminAuthError } from "@/features/admin/session";
import { updateAchievement, deleteAchievement } from "@/features/portfolio/server/data";
import { AchievementSchema } from "@/features/portfolio/schema";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const partial = AchievementSchema.partial().parse(body);
    const updated = await updateAchievement(id, partial);
    revalidatePath("/");

    return NextResponse.json({ success: true, portfolio: updated });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json(
      { error: error.message || "Failed to update achievement" },
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

    const updated = await deleteAchievement(id);
    revalidatePath("/");

    return NextResponse.json({ success: true, portfolio: updated });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json(
      { error: error.message || "Failed to delete achievement" },
      { status: 400 }
    );
  }
}
