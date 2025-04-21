import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback, FeedbackSchemaName } from './feedback.schema';
import {
  CreateFeedbackDto,
  FeedbackQueryDto,
  UpdateFeedbackDto,
} from './dto/feedback.dto';
import { RecordService } from './record/record.service';
import { FeedbackTypeName } from './type/type.schema';
import { UsersName } from 'src/modules/users/schemas/ref-names';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(FeedbackSchemaName)
    private readonly feedbackModel: Model<Feedback>,
    private readonly recordService: RecordService,
  ) {}

  async create(
    createFeedbackDto: CreateFeedbackDto,
    userId: string,
  ): Promise<Feedback> {
    // 创建新的反馈
    const feedback = new this.feedbackModel({
      ...createFeedbackDto,
      submitter: userId,
      status: 'pending',
    });
    const savedFeedback = await feedback.save();

    // 创建反馈记录
    await this.recordService.create(
      {
        feedback: savedFeedback._id.toString(),
        action: 'create',
        content: '创建了反馈',
        metadata: { data: createFeedbackDto },
      },
      userId,
    );

    return savedFeedback;
  }

  async findAll(
    query: FeedbackQueryDto,
  ): Promise<{ items: Feedback[]; total: number }> {
    const filter: any = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.type) {
      filter.type = query.type;
    }

    if (query.submitter) {
      filter.submitter = query.submitter;
    }

    if (query.handler) {
      filter.handler = query.handler;
    }

    const total = await this.feedbackModel.countDocuments(filter);
    const items = await this.feedbackModel
      .find(filter)
      .sort({ priority: -1, createdAt: -1 })
      .populate('type', 'type description', FeedbackTypeName)
      .populate('submitter', 'username avatar', UsersName)
      .populate('handler', 'username avatar', UsersName)
      .exec();

    return { items, total };
  }

  async findById(id: string): Promise<{ feedback: Feedback; records: any[] }> {
    const feedback = await this.feedbackModel
      .findById(id)
      .populate('type', 'type description', FeedbackTypeName)
      .populate('submitter', 'username avatar', UsersName)
      .populate('handler', 'username avatar', UsersName)
      .exec();

    if (!feedback) {
      throw new NotFoundException(`ID为 ${id} 的反馈不存在`);
    }

    // 获取反馈的所有记录
    const records = await this.recordService.getRecordsByFeedback(id);

    return { feedback, records };
  }

  async update(
    id: string,
    updateFeedbackDto: UpdateFeedbackDto,
    userId: string,
  ): Promise<Feedback> {
    const feedback = await this.feedbackModel.findById(id);
    if (!feedback) {
      throw new NotFoundException(`ID为 ${id} 的反馈不存在`);
    }

    // 状态转换逻辑
    if (updateFeedbackDto.status) {
      const action = this.getActionByStatus(
        feedback.status,
        updateFeedbackDto.status,
      );

      // 创建状态变更记录
      await this.recordService.create(
        {
          feedback: id,
          action,
          content: `状态从 ${feedback.status} 变更为 ${updateFeedbackDto.status}`,
          metadata: {
            previous: feedback.status,
            current: updateFeedbackDto.status,
          },
        },
        userId,
      );
    }

    // 更新反馈
    const updatedFeedback = await this.feedbackModel
      .findByIdAndUpdate(id, updateFeedbackDto, { new: true })
      .populate('type', 'type description', FeedbackTypeName)
      .populate('submitter', 'username avatar', UsersName)
      .populate('handler', 'username avatar', UsersName)
      .exec();

    // 如果更新了反馈内容或标题等信息，记录这些变更
    if (
      updateFeedbackDto.title ||
      updateFeedbackDto.content ||
      updateFeedbackDto.type
    ) {
      await this.recordService.create(
        {
          feedback: id,
          action: 'update',
          content: '更新了反馈信息',
          metadata: { data: updateFeedbackDto },
        },
        userId,
      );
    }

    return updatedFeedback;
  }

  // 根据状态转换确定操作类型
  private getActionByStatus(
    previousStatus: string,
    currentStatus: string,
  ): 'update' | 'reply' | 'close' | 'reopen' {
    if (currentStatus === 'closed') {
      return 'close';
    }
    if (
      currentStatus === 'reopened' ||
      (previousStatus === 'closed' && currentStatus !== 'closed')
    ) {
      return 'reopen';
    }
    if (currentStatus === 'replied') {
      return 'reply';
    }
    return 'update';
  }

  async reply(id: string, content: string, userId: string): Promise<Feedback> {
    const feedback = await this.feedbackModel.findById(id);
    if (!feedback) {
      throw new NotFoundException(`ID为 ${id} 的反馈不存在`);
    }

    // 创建回复记录
    await this.recordService.create(
      {
        feedback: id,
        action: 'reply',
        content,
      },
      userId,
    );

    // 更新反馈状态为已回复
    const updatedFeedback = await this.feedbackModel
      .findByIdAndUpdate(
        id,
        { status: 'replied', handler: userId },
        { new: true },
      )
      .populate('type', 'type description', FeedbackTypeName)
      .populate('submitter', 'username avatar', UsersName)
      .populate('handler', 'username avatar', UsersName)
      .exec();

    return updatedFeedback;
  }

  async assignHandler(
    id: string,
    handlerId: string,
    userId: string,
  ): Promise<Feedback> {
    const feedback = await this.feedbackModel.findById(id);
    if (!feedback) {
      throw new NotFoundException(`ID为 ${id} 的反馈不存在`);
    }

    // 创建分配处理人记录
    await this.recordService.create(
      {
        feedback: id,
        action: 'update',
        content: '分配了处理人',
        metadata: { handler: handlerId },
      },
      userId,
    );

    // 更新反馈处理人
    const updatedFeedback = await this.feedbackModel
      .findByIdAndUpdate(
        id,
        {
          handler: handlerId,
          status:
            feedback.status === 'pending' ? 'processing' : feedback.status,
        },
        { new: true },
      )
      .populate('type', 'type description', FeedbackTypeName)
      .populate('submitter', 'username avatar', UsersName)
      .populate('handler', 'username avatar', UsersName)
      .exec();

    return updatedFeedback;
  }
}
