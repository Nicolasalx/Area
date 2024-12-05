import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

async function getGoogleOAuthTokens(code: string) {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    grant_type: "authorization_code",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting Google OAuth tokens:", error);
    throw new Error("Failed to get Google OAuth tokens");
  }
}

async function getGoogleUser(access_token: string /*, id_token: string*/) {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting Google user:", error);
    throw new Error("Failed to get Google user");
  }
}

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
  console.log(data);
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
