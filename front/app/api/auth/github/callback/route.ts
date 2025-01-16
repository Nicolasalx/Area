import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const redirect_uri = process.env.GITHUB_REDIRECT_URI;

  if (!code) {
    throw new Error("No code provided");
  }

  return axios
    .get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/github/callback/?code=${code}&redirect_uri=${redirect_uri}&state=${state}`,
    )
    .then((res) => res.data)
    .then(async (data) => {
      const cookieStore = await cookies();
      const existingAuthToken = cookieStore.get("auth-token");

      if (!existingAuthToken) {
        const sessionToken = data.token;
        cookieStore.set("auth-token", sessionToken, {
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
                localStorage.setItem('user', JSON.stringify(userData));
                window.opener.postMessage(
                  {
                    type: 'GITHUB_LOGIN_SUCCESS',
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
      } else {
        return new NextResponse(
          `
          <html>
            <head>
              <script>
                window.opener.postMessage(
                  {
                    type: 'GITHUB_LOGIN_SUCCESS'
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
      }
    })
    .catch((error) => {
      console.error("Github callback error:", error);
      return new NextResponse(
        `
        <html>
          <head>
            <script>
              window.opener.postMessage(
                {
                  type: 'GITHUB_LOGIN_ERROR',
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
