import { NextResponse } from "next/server";

export async function GET() {
  const githubAuthUrl = new URL("https://accounts.spotify.com/authorize");

  const params = {
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    response_type: "code",
    scope: [
      "user-library-read",
      "playlist-read-private",
      "user-top-read",
      "user-read-playback-state",
      "playlist-modify-private",
      "playlist-modify-public",
    ].join(" "),
  };

  githubAuthUrl.search = new URLSearchParams(params).toString();

  return NextResponse.redirect(githubAuthUrl.toString());
}
