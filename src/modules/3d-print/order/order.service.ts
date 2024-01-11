import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { The3dPrintOrder } from '../schemas/order';
import { Model } from 'mongoose';
import { Response } from 'src/utils/response';
import { PageDto } from 'src/public/dto/page';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(The3dPrintOrder.name)
    private readonly orderModel: Model<The3dPrintOrder>,
  ) {}

  async page(params: PageDto) {
    const { page = 1, pageSize = 10 } = params;

    const results = await this.orderModel
      .find({ isDelete: false })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('creator')
      .populate('updater')
      .populate('platform')
      .populate('goods')
      .exec();

    const total = await this.orderModel.countDocuments();

    return Response.page(results, { page, pageSize, total });
  }

  async create(params: OrderDto, user: string) {
    const result = await this.orderModel.create({
      ...params,
      creator: user,
    });

    return result;
  }
}
