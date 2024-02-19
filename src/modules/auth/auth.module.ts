import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UsersSchema } from 'src/modules/users/schemas/user';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { jwtConfig } from 'src/config/jwt';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { InvitationCodeModule } from '../users/invitation-code/invitation-code.module';
import { ProjectModule } from '../system/project/project.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
    JwtModule.register({
      secret: jwtConfig.accessToken.secret,
      signOptions: { expiresIn: jwtConfig.accessToken.expiresIn },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
    UsersModule,
    InvitationCodeModule,
    ProjectModule,
  ],
})
export class AuthModule {}
