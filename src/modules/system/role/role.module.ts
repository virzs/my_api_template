import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleSchema } from 'src/schemas/role';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Role',
        schema: RoleSchema,
        collection: 'role',
      },
    ]),
  ],
})
export class RoleModule {}
