import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

@Injectable()
export class EnsureAuthenticatedMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    const { authorization } = req.headers;

    if (!authorization) {
      res.status(401);
      throw new Error('🚫 Token invalid 🚫');
    }

    try {
      const payload = verify(authorization, process.env.JWT_ACCESS_SECRET);
      req.payload = payload;
    } catch (err) {
      res.status(401);
      if (err.name === 'TokenExpiredError') {
        throw new Error(err.name);
      }
      throw new Error('🚫 Un-Authorized 🚫');
    }

    return next();
  }
}
