import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';
import { FeedbackTypeName, FeedbackTypeSchema } from './type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FeedbackTypeName, schema: FeedbackTypeSchema }
    ])
  ],
  controllers: [TypeController],
  providers: [TypeService],
  exports: [TypeService]
})
export class TypeModule {}
