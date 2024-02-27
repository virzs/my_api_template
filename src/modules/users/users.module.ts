import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from 'src/modules/users/schemas/user';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { InvitationCodeName, UsersName } from './schemas/ref-names';
import { InvitationCodeController } from './invitation-code/invitation-code.controller';
import { InvitationCodeService } from './invitation-code/invitation-code.service';
import { InvitationCodeSchema } from './schemas/invitation-code';

@Module({
  controllers: [InvitationCodeController, UsersController],
  providers: [UsersService, InvitationCodeService],
  imports: [
    MongooseModule.forFeature([
      {
        name: UsersName,
        schema: UsersSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: InvitationCodeName,
        schema: InvitationCodeSchema,
      },
    ]),
  ],
  exports: [UsersService, InvitationCodeService],
})
export class UsersModule {}
