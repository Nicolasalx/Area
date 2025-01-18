import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/actions/${params.id}/ingredients`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch action ingredients:", error);
    return NextResponse.json(
      { error: "Failed to fetch action ingredients" },
      { status: 500 },
    );
  }
}
