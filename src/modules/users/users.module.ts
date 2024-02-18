import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from 'src/modules/users/schemas/user';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { InvitationCodeModule } from './invitation-code/invitation-code.module';
import { UsersName } from './schemas/ref-names';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([
      {
        name: UsersName,
        schema: UsersSchema,
      },
    ]),
    InvitationCodeModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
