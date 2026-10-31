import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { requireAdmin, AdminAuthError } from "@/features/admin/session";
import { addSkillGroup } from "@/features/portfolio/server/data";
import { SkillGroupSchema } from "@/features/portfolio/schema";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();

    const data = {
      ...body,
      id: body.id || `skill-${nanoid(8)}`,
    };

    const validated = SkillGroupSchema.parse(data);
    const updated = await addSkillGroup(validated);
    revalidatePath("/");

    return NextResponse.json({ success: true, skill: validated, portfolio: updated });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json(
      { error: error.message || "Failed to add skill group" },
      { status: 400 }
    );
  }
}
