export const config = {
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
  TRELLO_REDIRECT_URI: process.env.TRELLO_REDIRECT_URI,
  TRELLO_API_KEY: process.env.TRELLO_API_KEY,
} as const;
