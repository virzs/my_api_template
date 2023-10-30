import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand } from '../schemas/brand';
import { BrandPageDto } from './dto/page.dto';
import { Response } from 'src/utils/response';
import { BrandDto } from './dto/brand.dto';
import { RouteUser } from 'src/public/decorator/route-user.decoratpr';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel('3DPrintBrand') private readonly brandModel: Model<Brand>,
  ) {}

  async page(params: BrandPageDto, user: string) {
    const { page = 1, pageSize = 10, type } = params;

    const results = await this.brandModel
      .find({
        creator: user,
        ...(type ? { type } : {}),
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('creator', { password: 0, salt: 0 })
      .populate('updater', { password: 0, salt: 0 })
      .exec();

    const total = await this.brandModel.countDocuments({
      creator: user,
      ...(type ? { type } : {}),
    });

    return Response.page(results, { page, pageSize, total });
  }

  async create(body: BrandDto, user: string) {
    const result = await this.brandModel.create({ ...body, creator: user });
    return result;
  }

  async detail(id: string) {
    const result = await this.brandModel.findById(id);
    return result;
  }

  async update(id: string, body: BrandDto, user: string) {
    const result = await this.brandModel.findByIdAndUpdate(id, {
      ...body,
      updater: user,
    });
    return result;
  }

  async delete(id: string) {
    const result = await this.brandModel.findByIdAndDelete(id);
    return result;
  }

  async list() {
    const result = await this.brandModel
      .find(
        {},
        {
          creator: 0,
          updater: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      )
      .exec();

    return result;
  }
}
