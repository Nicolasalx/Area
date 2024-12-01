import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // TODO: Validate credentials against the db
    // This is a placeholder implementation
    if (email === "demo@example.com" && password === "Password123!") {
      const sessionToken = `mock-token-${Date.now()}`;

      (await cookies()).set("session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return NextResponse.json({
        user: {
          id: "1",
          email: email,
          name: "Demo User",
        },
      });
    }

    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
