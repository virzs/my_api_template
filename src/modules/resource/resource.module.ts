import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { QiniuModule } from '../system/qiniu/qiniu.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ResourceSchema } from './schemas/resource';
import { ResourceName } from './schemas/ref-names';
import { CloudflareR2Module } from '../system/cloudflare-r2/cloudflare-r2.module';

@Module({
  controllers: [ResourceController],
  providers: [ResourceService],
  imports: [
    QiniuModule,
    CloudflareR2Module,
    MongooseModule.forFeature([
      {
        name: ResourceName,
        schema: ResourceSchema,
      },
    ]),
  ],
})
export class ResourceModule {}
