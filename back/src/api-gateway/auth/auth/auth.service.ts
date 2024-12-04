import { Injectable, Dependencies, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'

@Injectable()
@Dependencies(HttpService)
export class AuthService {
  constructor(private httpService: HttpService) {
    this.httpService = httpService;
  }

  async getGoogleOAuthTokens(code : string) {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
    };
    try {
      const response = await this.httpService.axiosRef.post(url, values);
      console.log("Data: ", response.data);
      return response.data;
    } catch (error) {
      console.log("Failed to get Google OAuth tokens: ", error);
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Failed to get Google OAuth tokens',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }

  async getGoogleUser(access_token: string /*, id_token: string*/) {
    const url = "https://www.googleapis.com/oauth2/v2/userinfo";
    try {
      const response = await this.httpService.axiosRef.get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Failed to get Google user',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }

  async getGoogleOAuth(code : string) {
    try {
      console.log("CODE: ", code);
      // Get tokens from Google
      const { access_token, id_token } = await this.getGoogleOAuthTokens(code);
      console.log("Access_token: ", access_token);

      // Get user with tokens
      const googleUser = await this.getGoogleUser(access_token /*, id_token*/);

      // Return JSON data to the opener window
      console.log("Send: ", {"googleUser": googleUser, "access_token": access_token});
      return {"googleUser": googleUser, "access_token": access_token};
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Failed to get Google OAuth',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }
}

