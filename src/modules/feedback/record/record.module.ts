import { Module } from '@nestjs/common';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackRecord, FeedbackRecordSchema, FeedbackRecordName } from './record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FeedbackRecordName, schema: FeedbackRecordSchema }
    ])
  ],
  controllers: [RecordController],
  providers: [RecordService],
  exports: [RecordService]
})
export class RecordModule {}
