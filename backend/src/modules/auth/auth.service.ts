import { client } from '../prisma/client';
import { HashTokenService } from 'src/utils/hashTokenService';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  addRefreshTokenToWhitelist({ jti, refreshToken, userId }) {
    const hashTokenService = new HashTokenService();

    return client.refreshToken.create({
      data: {
        id: jti,
        hashedToken: hashTokenService.hashToken(refreshToken),
        userId,
      },
    });
  }

  findRefreshTokenById(id) {
    return client.refreshToken.findUnique({
      where: {
        id,
      },
    });
  }

  deleteRefreshToken(id) {
    return client.refreshToken.update({
      where: {
        id,
      },
      data: {
        revoked: true,
      },
    });
  }

  revokeTokens(userId) {
    return client.refreshToken.updateMany({
      where: {
        userId,
      },
      data: {
        revoked: true,
      },
    });
  }
}
