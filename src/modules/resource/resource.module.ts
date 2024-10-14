import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ResourceSchema } from './schemas/resource';
import { ResourceName } from './schemas/ref-names';
import { StorageServiceModule } from '../system/storage-service/storage-service.module';

@Module({
  controllers: [ResourceController],
  providers: [ResourceService],
  imports: [
    StorageServiceModule,
    MongooseModule.forFeature([
      {
        name: ResourceName,
        schema: ResourceSchema,
      },
    ]),
  ],
})
export class ResourceModule {}
