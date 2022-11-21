import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { IUserDTO } from '../../DTOs/IUserDTO';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from 'src/utils/jwtService';
import { AuthService } from '../auth/auth.service';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async createUser(@Body() input: IUserDTO) {
    const jti = uuidv4();
    try {
      const user = await this.userService.createUser(input);

      if (user.id != null || user.id != undefined) {
        const { accessToken, refreshToken } = this.jwtService.generateTokens(
          user,
          jti,
        );
        await this.authService.addRefreshTokenToWhitelist({
          jti,
          refreshToken,
          userId: user.id,
        });
        return { user, accessToken, refreshToken };
      }

      throw new HttpException(user.errorMessage, 400, {
        cause: new Error(user.errorMessage),
      });
    } catch (error) {
      return error;
      throw new HttpException(error.message, 400, {
        cause: new Error(error.message),
      });
    }
  }

  @Post('/login')
  async loginUser(@Body() input: IUserDTO) {
    try {
      const user = await this.userService.loginUser(input);
      return user;
    } catch (error) {
      throw new HttpException(error.message, 400, {
        cause: new Error(error.message),
      });
    }
  }

  @Post('/refreshToken')
  async refreshToken(@Body() input: { refreshToken: string }) {
    return this.userService.createRefreshToken(input.refreshToken);
  }

  @Post('/revokeRefreshTokens')
  async revokeRefreshTokens(@Body() input: { userId: number }) {
    return this.userService.revokeRefreshTokens(input.userId);
  }
}
