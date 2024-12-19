import { NextResponse } from "next/server";

export async function GET() {
  const discordAuthUrl = new URL("https://discord.com/oauth2/authorize");

  const params = {
    client_id: process.env.DISCORD_CLIENT_ID!,
    redirect_uri: process.env.DISCORD_REDIRECT_URI!,
    response_type: "code",
    scope: ["identify", "email"].join(" "),
  };

  discordAuthUrl.search = new URLSearchParams(params).toString();

  return NextResponse.redirect(discordAuthUrl.toString());
}
