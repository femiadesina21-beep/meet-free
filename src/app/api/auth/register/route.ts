import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, age, gender, bio, location, interests } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const user = await createUser({
      name,
      email,
      password, // In production: hash with bcrypt
      age: age || 25,
      gender: gender || "other",
      bio: bio || "",
      location: location || "",
      interests: interests || [],
      avatar: `https://picsum.photos/seed/${Date.now()}/400/400`,
      isVerified: false,
    });

    // Don’t send password back
    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      user: safeUser,
      message: "Account created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
