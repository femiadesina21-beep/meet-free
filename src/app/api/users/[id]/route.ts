import { NextRequest, NextResponse } from "next/server";
import { updateUser, getUserById, getPhotosByUser } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const photos = await getPhotosByUser(id);
    const { password, ...safe } = user;
    return NextResponse.json({ user: { ...safe, photos } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, age, bio, location, interests } = body;

    const updated = await updateUser(id, {
      ...(name !== undefined && { name }),
      ...(age !== undefined && { age }),
      ...(bio !== undefined && { bio }),
      ...(location !== undefined && { location }),
      ...(interests !== undefined && { interests }),
    });

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { password, ...safe } = updated;
    return NextResponse.json({ success: true, user: safe });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
