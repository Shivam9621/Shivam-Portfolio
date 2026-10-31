import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, AdminAuthError } from "@/features/admin/session";
import { updateProfile } from "@/features/portfolio/server/data";
import { ProfileSchema } from "@/features/portfolio/schema";

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const partial = ProfileSchema.partial().parse(body);

    const updated = await updateProfile(partial);
    revalidatePath("/");

    return NextResponse.json({ success: true, profile: updated.profile });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 400 }
    );
  }
}
