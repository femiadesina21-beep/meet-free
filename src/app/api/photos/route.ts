import { NextRequest, NextResponse } from "next/server";
import { addPhoto, getPhotosByUser, getUserById } from "@/lib/db";

// Photos are stored as base64 data URIs directly in the JSON db.
// Fine for an MVP; swap for real object storage (S3/Cloudinary) before scaling.
const MAX_BYTES = 4 * 1024 * 1024; // ~4MB per photo

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, imageBase64 } = body;

    if (!userId || !imageBase64) {
      return NextResponse.json(
        { error: "userId and imageBase64 are required" },
        { status: 400 }
      );
    }

    if (!imageBase64.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "imageBase64 must be a data:image/... URI" },
        { status: 400 }
      );
    }

    if (imageBase64.length > MAX_BYTES * 1.4) {
      return NextResponse.json(
        { error: "Image too large. Please use a photo under 4MB." },
        { status: 413 }
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const photo = await addPhoto({
      userId,
      userName: user.name,
      url: imageBase64,
    });

    return NextResponse.json({ success: true, photo });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const photos = await getPhotosByUser(userId);
    return NextResponse.json({ photos });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
