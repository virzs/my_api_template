import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { ClassifyModule } from './classify/classify.module';
import { TagModule } from './tag/tag.module';
import { ReviewModule } from './review/review.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MySiteBlogSchema, MySiteBlogSchemaName } from './blog.schema';

@Module({
  controllers: [BlogController],
  providers: [BlogService],
  imports: [
    MongooseModule.forFeature([
      {
        name: MySiteBlogSchemaName,
        schema: MySiteBlogSchema,
      },
    ]),
    ClassifyModule,
    TagModule,
    ReviewModule,
  ],
})
export class BlogModule {}
