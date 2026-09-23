import { NextRequest, NextResponse } from "next/server";
import { getMessages, addMessage } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const messages = await getMessages(id);
    return NextResponse.json({ messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { senderId, text } = body;

    if (!senderId || !text) {
      return NextResponse.json(
        { error: "senderId and text are required" },
        { status: 400 }
      );
    }

    const message = await addMessage({
      chatId: id,
      senderId,
      text,
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
