import { Module } from '@nestjs/common';
import { InvitationCodeService } from './invitation-code.service';
import { InvitationCodeController } from './invitation-code.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { InvitationCodeName } from '../schemas/ref-names';
import { InvitationCodeSchema } from '../schemas/invitation-code';

@Module({
  controllers: [InvitationCodeController],
  providers: [InvitationCodeService],
  imports: [
    MongooseModule.forFeature([
      {
        name: InvitationCodeName,
        schema: InvitationCodeSchema,
      },
    ]),
  ],
  exports: [InvitationCodeService],
})
export class InvitationCodeModule {}
