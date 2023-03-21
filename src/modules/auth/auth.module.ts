import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { RefreshToken, RefreshTokenSchema } from 'src/schemas/refreshToken';
import { User, UsersSchema } from 'src/schemas/user';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { jwtConfig } from 'src/config/jwt';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
    JwtModule.register({
      secret: jwtConfig.accessToken.secret,
      signOptions: { expiresIn: jwtConfig.accessToken.expiresIn },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UsersSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    UsersModule,
  ],
})
export class AuthModule {}
