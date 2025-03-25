import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { Feedback, FeedbackSchema, FeedbackSchemaName } from './feedback.schema';
import { RecordModule } from './record/record.module';
import { TypeModule } from './type/type.module';
import { FaqModule } from './faq/faq.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FeedbackSchemaName, schema: FeedbackSchema }
    ]),
    RecordModule,
    TypeModule,
    FaqModule
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService]
})
export class FeedbackModule {}
