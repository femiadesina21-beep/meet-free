import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = (searchParams.get("period") as "weekly" | "monthly") || "weekly";

    const photos = await getLeaderboard(period);

    return NextResponse.json({
      period,
      leaderboard: photos,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
