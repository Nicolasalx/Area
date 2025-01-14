import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const code = searchParams.get("code");
  const redirect_uri = process.env.DISCORD_REDIRECT_URI;

  console.log("INSIDE : ", code);

  if (!code) {
    throw new Error("No code provided");
  }

  // Get user info and token
  return axios
    .get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/discord/callback/?code=${code}&redirect_uri=${redirect_uri}`,
    )
    .then((res) => res.data)
    .then(async (data) => {
      const sessionToken = data.token;

      (await cookies()).set("auth-token", sessionToken, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
      });

      const user = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        image: data.user.picture,
      };

      return new NextResponse(
        `
        <html>
          <head>
            <script>
              const userData = ${JSON.stringify(user)};
              console.log("Setting user data in localStorage:", userData); // Debug log
              localStorage.setItem('user', JSON.stringify(userData));
              window.opener.postMessage(
                {
                  type: 'DISCORD_LOGIN_SUCCESS',
                  user: userData,
                  token: '${sessionToken}'
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
    })
    .catch((error) => {
      console.error("Discord callback error:", error);
      return new NextResponse(
        `
        <html>
          <head>
            <script>
              window.opener.postMessage(
                {
                  type: 'DISCORD_LOGIN_ERROR',
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
