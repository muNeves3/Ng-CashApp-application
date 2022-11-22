import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUserDTO } from 'src/DTOs/IUserDTO';
import { client } from '../prisma/client';
import { compare, hashSync } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from 'src/utils/jwtService';
import { AuthService } from '../auth/auth.service';
import { HashTokenService } from '../../utils/hashTokenService';
import { verify } from 'jsonwebtoken';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  #checkForNumberInPassword(password) {
    return password.match(/\d+/g);
  }

  #checkforCapitalLetterInPassword(password) {
    return /[a-z]/.test(password) && /[A-Z]/.test(password);
  }

  async createUser({ password, username }: IUserDTO): Promise<any | User> {
    try {
      const existingUser = await client.user.findUnique({
        where: {
          username,
        },
      });

      if (existingUser) {
        throw new HttpException('Usuário já existe', 400);
      }

      if (username.length < 3) {
        throw new HttpException(
          'O usuário deve ter no mínimo 3 caracteres',
          400,
        );
      }
      if (password.length < 8) {
        throw new HttpException('A senha deve ter no mínimo 8 caracteres', 400);
      } else if (!this.#checkForNumberInPassword(password)) {
        throw new HttpException('A senha deve conter no mínimo 1 número', 400);
      } else if (!this.#checkforCapitalLetterInPassword(password)) {
        throw new HttpException(
          'A senha deve conter no mínimo 1 letra maiúscula',
          400,
        );
      }

      const account = await client.account.create({
        data: {
          balance: 100,
        },
      });

      const hashedPassword = hashSync(password, 12);
      const user = await client.user.create({
        data: {
          username,
          password: hashedPassword,
          accountId: account.id,
        },
      });

      return user;
    } catch (error) {
      throw new HttpException(error.message, 400, {
        cause: new Error(error.message),
      });
    }
  }

  async getAccountIdByUsername(username: string) {
    try {
      const user = await client.user.findUnique({
        where: {
          username,
        },
      });

      if (!user) {
        throw new HttpException('esse usuário não existe', 400, {
          cause: new Error('esse usuário não existe'),
        });
      }

      return user.accountId;
    } catch (error) {
      throw new HttpException(error.message, 400, {
        cause: new Error(error.message),
      });
    }
  }

  async loginUser({ password, username }: IUserDTO) {
    const existingUser = await client.user.findUnique({
      where: {
        username,
      },
    });

    if (!existingUser) {
      throw new HttpException('Usuário não encontrado', 400);
    }

    const validPassword = await compare(password, existingUser.password);

    if (!validPassword) {
      throw new HttpException('Senha incorreta', 400);
    }

    const jti = uuidv4();
    const jwtService = new JwtService();
    const authService = new AuthService();
    const { accessToken, refreshToken } = jwtService.generateTokens(
      existingUser,
      jti,
    );
    await authService.addRefreshTokenToWhitelist({
      jti,
      refreshToken,
      userId: existingUser.id,
    });

    return { user: existingUser, accessToken, refreshToken };
  }

  async createRefreshToken(refreshToken: string) {
    const jwtService = new JwtService();
    const authService = new AuthService();
    const hashTokenService = new HashTokenService();

    if (!refreshToken) {
      throw new HttpException('Token inválido', 400);
    }
    const payload = verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (typeof payload === 'string') {
      throw new HttpException('Token inválido', 400);
    }

    const savedRefreshToken = await authService.findRefreshTokenById(
      payload.jti,
    );

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      throw new HttpException('Não autorizado', 400);
    }

    const hashedToken = hashTokenService.hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      throw new HttpException('Não autorizado', 400);
    }

    const user = await client.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    await authService.deleteRefreshToken(savedRefreshToken.id);
    const jti = uuidv4();
    const { accessToken, refreshToken: newRefreshToken } =
      jwtService.generateTokens(user, jti);
    await authService.addRefreshTokenToWhitelist({
      jti,
      refreshToken: newRefreshToken,
      userId: user.id,
    });

    return { user, accessToken, refreshToken: newRefreshToken };
  }

  async revokeRefreshTokens(userId: number) {
    const authService = new AuthService();
    try {
      await authService.revokeTokens(userId);
      return `Tokens revoked for user with id #${userId}`;
    } catch (error) {
      throw new Error(error);
    }
  }
}
