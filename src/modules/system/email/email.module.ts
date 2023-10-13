import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [ConfigModule, UsersModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
