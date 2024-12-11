export interface UserGoogleResponse {
  id: string;
  email: string;
  // verified_email: boolean;
  name: string;
  // given_name: string;
  // family_name: string;
  picture: string;
}

export interface UserGithubResponse {
  id: string;
  email: string;
  // verified_email: boolean;
  login: string;
  // given_name: string;
  // family_name: string;
  avatar_url: string;
}

export interface EmailGithubResponse {
  email: string;
  primary: boolean;
  verified: boolean;
}
