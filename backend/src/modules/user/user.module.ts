import { Module } from '@nestjs/common';
import { JwtService } from '../../utils/jwtService';
import { AuthService } from '../auth/auth.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtService, AuthService],
})
export class UserModule {}
