import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from 'src/schemas/user';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersName } from 'src/schemas/ref-names';

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
  ],
  exports: [UsersService],
})
export class UsersModule {}
