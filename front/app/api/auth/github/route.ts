import { NextResponse } from "next/server";

export async function GET() {
  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");

  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: process.env.GITHUB_REDIRECT_URI!,
    response_type: "code",
    scope: ["read:user", "user:email"].join(" "),
  };

  githubAuthUrl.search = new URLSearchParams(params).toString();

  return NextResponse.redirect(githubAuthUrl.toString());
}
