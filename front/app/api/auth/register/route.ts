import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // TODO: Validate if user already exists in the db
    // TODO: Hash password before storing
    // TODO: Store user in the db
    // This is a placeholder implementation

    if (email === "demo@example.com") {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    const sessionToken = `mock-token-${Date.now()}`;

    (await cookies()).set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({
      user: {
        id: "2",
        email,
        name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
