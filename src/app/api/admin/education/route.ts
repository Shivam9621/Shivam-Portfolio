import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { requireAdmin, AdminAuthError } from "@/features/admin/session";
import { addEducation } from "@/features/portfolio/server/data";
import { EducationSchema } from "@/features/portfolio/schema";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();

    const data = {
      ...body,
      id: body.id || `edu-${nanoid(8)}`,
      order: body.order ?? 99,
      visible: body.visible !== false,
    };

    const validated = EducationSchema.parse(data);
    const updated = await addEducation(validated);
    revalidatePath("/");

    return NextResponse.json({ success: true, education: validated, portfolio: updated });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json(
      { error: error.message || "Failed to add education" },
      { status: 400 }
    );
  }
}
