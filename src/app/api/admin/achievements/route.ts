import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { requireAdmin, AdminAuthError } from "@/features/admin/session";
import { addAchievement } from "@/features/portfolio/server/data";
import { AchievementSchema } from "@/features/portfolio/schema";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();

    const data = {
      ...body,
      id: body.id || `ach-${nanoid(8)}`,
      order: body.order ?? 99,
      visible: body.visible !== false,
    };

    const validated = AchievementSchema.parse(data);
    const updated = await addAchievement(validated);
    revalidatePath("/");

    return NextResponse.json({ success: true, achievement: validated, portfolio: updated });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json(
      { error: error.message || "Failed to add achievement" },
      { status: 400 }
    );
  }
}
