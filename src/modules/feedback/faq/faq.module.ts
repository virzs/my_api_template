import { forwardRef, Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackFaqName, FeedbackFaqSchema } from './faq.schema';
import { ResourceModule } from 'src/modules/resource/resource.module';

@Module({
  controllers: [FaqController],
  providers: [FaqService],
  imports: [
    MongooseModule.forFeature([
      {
        name: FeedbackFaqName,
        schema: FeedbackFaqSchema,
      },
    ]),
    forwardRef(() => ResourceModule),
  ],
})
export class FaqModule {}
