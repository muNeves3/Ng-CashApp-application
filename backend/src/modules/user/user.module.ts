import { CacheModule, Module } from '@nestjs/common';
import { JwtService } from '../../utils/jwtService';
import { AuthService } from '../auth/auth.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [UserController],
  providers: [UserService, JwtService, AuthService],
})
export class UserModule {}
