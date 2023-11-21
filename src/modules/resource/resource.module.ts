import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { QiniuModule } from '../system/qiniu/qiniu.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Resource, ResourceSchema } from 'src/schemas/resource';

@Module({
  controllers: [ResourceController],
  providers: [ResourceService],
  imports: [
    QiniuModule,
    MongooseModule.forFeature([
      {
        name: Resource.name,
        schema: ResourceSchema,
      },
    ]),
  ],
})
export class ResourceModule {}
