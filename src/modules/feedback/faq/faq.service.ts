import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FeedbackFaq, FeedbackFaqName } from './faq.schema';
import { Model } from 'mongoose';
import { ResourceService } from 'src/modules/resource/resource.service';
import { PageDto } from 'src/public/dto/page';
import { Response } from 'src/utils/response';
import { FaqDto } from './faq.dto';

@Injectable()
export class FaqService {
  constructor(
    @InjectModel(FeedbackFaqName)
    private readonly faqModel: Model<FeedbackFaq>,
    @Inject(forwardRef(() => ResourceService))
    private readonly resourceService: ResourceService,
  ) {}

  /**
   * 获取FAQ
   */
  async findAll(query: PageDto) {
    const { page = 1, pageSize = 10 } = query;

    const faqs = await this.faqModel
      .find()
      .select({
        content: 0,
      })
      .populate('creator')
      .populate('updater')
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const total = await this.faqModel.countDocuments({});

    return Response.page(faqs, { page, pageSize, total });
  }

  /**
   * 获取FAQ详情
   */
  async findOne(id: string) {
    return this.faqModel.findById(id).exec();
  }

  /**
   * 获取所有FAQ 用户
   */
  async findAllUser() {
    return this.faqModel
      .find({})
      .select({
        createdAt: 0,
        creator: 0,
        updatedAt: 0,
        updater: 0,
        isPublic: 0,
      })
      .exec();
  }

  /**
   * 创建FAQ
   */
  async create(data: FaqDto, user: string) {
    const res = await this.faqModel.create({ ...data, creator: user });

    const { answer, _id } = res;

    await this.resourceService.associateResourcesFromStringOrArray({
      associatedDataId: _id as string,
      associatedDataFrom: FeedbackFaqName,
      content: answer,
    });

    return res;
  }

  /**
   * 更新FAQ
   */
  async update(id: string, data: FaqDto, user: string) {
    const res = await this.faqModel.findByIdAndUpdate(id, {
      ...data,
      updater: user,
    });

    const { answer } = data;

    await this.resourceService.associateResourcesFromStringOrArray({
      associatedDataId: id,
      associatedDataFrom: FeedbackFaqName,
      content: answer,
    });

    return res;
  }

  /**
   * 删除FAQ
   */
  async delete(id: string) {
    const res = await this.faqModel.findByIdAndDelete(id);

    if (!res) {
      throw new BadRequestException('数据不存在');
    }

    await this.resourceService.disassociateDataAndResourceByDataId(id);

    return this.faqModel.findByIdAndUpdate(id, {
      isDelete: true,
    });
  }

  /**
   * 公开或取消公开FAQ
   */
  async public(id: string, user: string) {
    const res = await this.faqModel.findById(id);

    if (!res) {
      throw new BadRequestException('数据不存在');
    }

    return this.faqModel
      .findByIdAndUpdate(id, {
        isPublic: !res.isPublic,
        updater: user,
      })
      .exec();
  }
}
