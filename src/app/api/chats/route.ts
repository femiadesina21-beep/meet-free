import { NextRequest, NextResponse } from "next/server";
import { getChats, createChat } from "@/lib/db";

export async function GET() {
  try {
    const chats = await getChats();
    return NextResponse.json({ chats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { participantIds } = body;

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length < 2) {
      return NextResponse.json(
        { error: "participantIds array with at least 2 users required" },
        { status: 400 }
      );
    }

    const chat = await createChat(participantIds);
    return NextResponse.json({ success: true, chat });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
