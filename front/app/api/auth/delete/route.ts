import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function DELETE(_request: Request) {
  try {
    const cookieStore = await cookies();
    const token = await cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.message || "Failed to delete account" },
        { status: response.status },
      );
    }

    const response2 = NextResponse.json({
      message: "Account deleted successfully",
    });
    response2.cookies.delete("auth-token");
    return response2;
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { message: "Failed to delete account" },
      { status: 500 },
    );
  }
}
