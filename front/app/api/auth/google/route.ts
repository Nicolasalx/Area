import { NextResponse } from "next/server";

export async function GET() {
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  const params = {
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://mail.google.com/",
      "https://www.googleapis.com/auth/tasks",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/calendar.events.readonly",
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.apps.readonly",
      "https://www.googleapis.com/auth/youtube",
    ].join(" "),
    prompt: "select_account",
  };

  googleAuthUrl.search = new URLSearchParams(params).toString();

  return NextResponse.redirect(googleAuthUrl.toString());
}
