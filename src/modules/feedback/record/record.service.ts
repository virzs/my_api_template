import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeedbackRecord, FeedbackRecordName } from './record.schema';
import { CreateRecordDto, RecordQueryDto } from './dto/record.dto';
import { UsersName } from 'src/modules/users/schemas/ref-names';

@Injectable()
export class RecordService {
  constructor(
    @InjectModel(FeedbackRecordName)
    private readonly recordModel: Model<FeedbackRecord>,
  ) {}

  async create(createRecordDto: CreateRecordDto, userId: string): Promise<FeedbackRecord> {
    const record = new this.recordModel({
      ...createRecordDto,
      operator: userId,
    });
    return record.save();
  }

  async findAll(query: RecordQueryDto): Promise<FeedbackRecord[]> {
    const filter: any = {};
    
    if (query.feedback) {
      filter.feedback = query.feedback;
    }
    
    if (query.action) {
      filter.action = query.action;
    }
    
    if (query.operator) {
      filter.operator = query.operator;
    }

    return this.recordModel
      .find(filter)
      .sort({ createdAt: -1 })
      .populate('operator', 'username avatar', UsersName)
      .exec();
  }

  async findById(id: string): Promise<FeedbackRecord> {
    return this.recordModel
      .findById(id)
      .populate('operator', 'username avatar', UsersName)
      .exec();
  }

  async getRecordsByFeedback(feedbackId: string): Promise<FeedbackRecord[]> {
    return this.recordModel
      .find({ feedback: feedbackId })
      .sort({ createdAt: -1 })
      .populate('operator', 'username avatar', UsersName)
      .exec();
  }
}
