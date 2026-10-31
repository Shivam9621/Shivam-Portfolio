import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { requireAdmin, AdminAuthError } from "@/features/admin/session";
import { addExperience } from "@/features/portfolio/server/data";
import { ExperienceSchema } from "@/features/portfolio/schema";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();

    const data = {
      ...body,
      id: body.id || `exp-${nanoid(8)}`,
      order: body.order ?? 99,
      visible: body.visible !== false,
    };

    const validated = ExperienceSchema.parse(data);
    const updated = await addExperience(validated);
    revalidatePath("/");

    return NextResponse.json({ success: true, experience: validated, portfolio: updated });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json(
      { error: error.message || "Failed to add experience" },
      { status: 400 }
    );
  }
}
