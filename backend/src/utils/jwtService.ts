import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  generateAccessToken(user) {
    return sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '24h',
    });
  }

  // I choosed 8h because i prefer to make the user login again each day.
  // But keep him logged in if he is using the app.
  // You can change this value depending on your app logic.
  // I would go for a maximum of 7 days, and make him login again after 7 days of inactivity.
  generateRefreshToken(user, jti) {
    return sign(
      {
        userId: user.id,
        jti,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: '24h',
      },
    );
  }

  generateTokens(user, jti) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user, jti);

    return {
      accessToken,
      refreshToken,
    };
  }
}
