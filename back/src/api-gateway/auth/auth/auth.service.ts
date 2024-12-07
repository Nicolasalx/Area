import { Injectable, Dependencies, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { UserService } from '@userService/user/user.service';
import { UserGoogleResponse } from '../../../common/interfaces/user/user'

@Injectable()
export class AuthService {
  constructor(private httpService: HttpService, private userService: UserService) {}

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

  async getGoogleUser(access_token: string) {
    const url = "https://www.googleapis.com/oauth2/v2/userinfo";
    try {
      const response = await this.httpService.axiosRef.request<UserGoogleResponse>({url: url,
        headers: {
          Authorization: `Bearer ${access_token}`,
        }
      });
      // const response = await this.httpService.axiosRef.get(url, {
      //   headers: {
      //     Authorization: `Bearer ${access_token}`,
      //   },
      // });
      let user = await this.userService.getUserByServiceId("GOOGLE", access_token);
      if (user == null) {
        user = await this.userService.createUser(response.data.name, response.data.email, access_token, "GOOGLE");
      }
      return user;
    } catch (error) {
      console.error("ERROR getGoogleUser: ", error);
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
      // Get tokens from Google
      const { access_token, id_token } = await this.getGoogleOAuthTokens(code);

      // Get user with tokens
      const googleUser = await this.getGoogleUser(access_token);

      // Return JSON data to the opener window
      const response = {"googleUser": googleUser, "access_token": access_token};
      return response;
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

