export interface UserGoogleResponse {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface UserDiscordResponse {
  id: string;
  username: string
  email: string;
  avatar: string;
}

export interface UserGithubResponse {
  id: string;
  email: string;
  login: string;
  avatar_url: string;
}

export interface UserOAuthResponse {
  name: string;
  email: string;
  picture: string;
}

export interface EmailGithubResponse {
  email: string;
  primary: boolean;
  verified: boolean;
}
