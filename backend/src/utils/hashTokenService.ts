import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class HashTokenService {
  hashToken(token) {
    return createHash('sha512').update(token).digest('hex');
  }
}
