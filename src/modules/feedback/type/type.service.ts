import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeedbackType, FeedbackTypeName } from './type.schema';
import { CreateTypeDto, TypeQueryDto, UpdateTypeDto } from './type.dto';
import { UsersName } from 'src/modules/users/schemas/ref-names';

@Injectable()
export class TypeService {
  constructor(
    @InjectModel(FeedbackTypeName)
    private readonly typeModel: Model<FeedbackType>,
  ) {}

  async create(createTypeDto: CreateTypeDto): Promise<FeedbackType> {
    const type = new this.typeModel(createTypeDto);
    return type.save();
  }

  async findAll(query: TypeQueryDto): Promise<{ items: FeedbackType[]; total: number }> {
    const filter: any = {};

    if (query.enable !== undefined) {
      filter.enable = query.enable;
    }

    if (query.handler) {
      filter.handler = query.handler;
    }

    const total = await this.typeModel.countDocuments(filter);
    const items = await this.typeModel
      .find(filter)
      .sort({ createdAt: -1 })
      .populate('handler', 'username avatar', UsersName)
      .exec();

    return { items, total };
  }

  async findById(id: string): Promise<FeedbackType> {
    const type = await this.typeModel
      .findById(id)
      .populate('handler', 'username avatar', UsersName)
      .exec();

    if (!type) {
      throw new NotFoundException(`ID为 ${id} 的反馈类型不存在`);
    }

    return type;
  }

  async update(id: string, updateTypeDto: UpdateTypeDto): Promise<FeedbackType> {
    const type = await this.typeModel.findById(id);
    if (!type) {
      throw new NotFoundException(`ID为 ${id} 的反馈类型不存在`);
    }

    return this.typeModel
      .findByIdAndUpdate(id, updateTypeDto, { new: true })
      .populate('handler', 'username avatar', UsersName)
      .exec();
  }

  async remove(id: string): Promise<void> {
    const type = await this.typeModel.findById(id);
    if (!type) {
      throw new NotFoundException(`ID为 ${id} 的反馈类型不存在`);
    }

    await this.typeModel.findByIdAndDelete(id);
  }

  async getTypeOptions(): Promise<FeedbackType[]> {
    return this.typeModel
      .find({ enable: true })
      .select('_id type description')
      .sort({ createdAt: -1 })
      .exec();
  }
}
