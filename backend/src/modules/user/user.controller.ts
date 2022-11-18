import { Body, Controller, Post } from '@nestjs/common';
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
    } catch (error) {
      throw new Error(error);
    }
  }

  @Post('/login')
  async loginUser(@Body() input: IUserDTO) {
    return this.userService.loginUser(input);
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
