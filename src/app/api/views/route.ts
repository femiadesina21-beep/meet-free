import { NextRequest, NextResponse } from "next/server";
import { incrementPhotoViews } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { photoId } = body;

    if (!photoId) {
      return NextResponse.json(
        { error: "photoId is required" },
        { status: 400 }
      );
    }

    const photo = await incrementPhotoViews(photoId);

    if (!photo) {
      return NextResponse.json(
        { error: "Photo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      views: photo.views,
      photo,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
