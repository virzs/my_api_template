import { forwardRef, Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { ClassifyModule } from './classify/classify.module';
import { TagModule } from './tag/tag.module';
import { ReviewModule } from './review/review.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MySiteBlogOperationRecordSchema,
  MySiteBlogOperationRecordSchemaName,
  MySiteBlogSchema,
  MySiteBlogSchemaName,
} from './blog.schema';
import { ResourceModule } from 'src/modules/resource/resource.module';

@Module({
  controllers: [BlogController],
  providers: [BlogService],
  imports: [
    MongooseModule.forFeature([
      {
        name: MySiteBlogSchemaName,
        schema: MySiteBlogSchema,
      },
      {
        name: MySiteBlogOperationRecordSchemaName,
        schema: MySiteBlogOperationRecordSchema,
      },
    ]),
    ClassifyModule,
    TagModule,
    ReviewModule,
    forwardRef(() => ResourceModule),
  ],
  exports: [BlogService],
})
export class BlogModule {}
