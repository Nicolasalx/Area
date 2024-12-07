import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const code = searchParams.get("code");

  if (!code) {
    throw new Error("No code provided");
  }

  // Get user info and token
  return axios.get(`http://localhost:8080/auth/google/callback/?code=${code}`)
  .then((res) => res.data).then(async (data) => {

  // Create session
  const sessionToken = `google-${Date.now()}`;
  (await cookies()).set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
  // Return HTML that sends a message to the opener window
  return new NextResponse(
    `
    <html>
      <head>
        <script>
          window.opener.postMessage(
            {
              type: 'GOOGLE_LOGIN_SUCCESS',
              user: {
                id: '${data.googleUser.id}',
                email: '${data.googleUser.email}',
                name: '${data.googleUser.name}',
                image: '${data.googleUser.picture}'
              }
            },
            '*'
          );
          window.close();
        </script>
      </head>
      <body>
        <p>Authentication successful. You can close this window.</p>
      </body>
    </html>
    `,
    {
      headers: {
        "Content-Type": "text/html",
      },
    },
  );
  }).catch((error) => {
    console.error("Google callback error:", error);
    return new NextResponse(
      `
      <html>
        <head>
          <script>
            window.opener.postMessage(
              {
                type: 'GOOGLE_LOGIN_ERROR',
                error: 'Authentication failed'
              },
              '*'
            );
            window.close();
          </script>
        </head>
        <body>
          <p>Authentication failed. You can close this window.</p>
        </body>
      </html>
      `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      },
    );
  });
}
