import { NextRequest, NextResponse } from "next/server";
import {
  addLike,
  hasMutualLike,
  findExistingChat,
  createChat,
  getLikedUserIds,
} from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fromUserId, toUserId } = body;

    if (!fromUserId || !toUserId) {
      return NextResponse.json(
        { error: "fromUserId and toUserId are required" },
        { status: 400 }
      );
    }

    await addLike(fromUserId, toUserId);
    const matched = await hasMutualLike(fromUserId, toUserId);

    let chat = null;
    if (matched) {
      chat = await findExistingChat(fromUserId, toUserId);
      if (!chat) {
        chat = await createChat([fromUserId, toUserId]);
      }
    }

    return NextResponse.json({ success: true, matched, chat });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    const likedIds = await getLikedUserIds(userId);
    return NextResponse.json({ likedIds });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
