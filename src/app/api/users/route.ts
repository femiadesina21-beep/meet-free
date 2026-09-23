import { NextResponse } from "next/server";
import { getUsers, getPhotosByUser } from "@/lib/db";

export async function GET() {
  try {
    const users = await getUsers();

    // Attach photos to each user
    const usersWithPhotos = await Promise.all(
      users.map(async (u) => {
        const photos = await getPhotosByUser(u.id);
        const { password, ...safe } = u;
        return { ...safe, photos };
      })
    );

    return NextResponse.json({ users: usersWithPhotos });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
