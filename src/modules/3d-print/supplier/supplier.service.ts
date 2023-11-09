import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SupplierPageDto } from './dto/page.dto';
import { Response } from 'src/utils/response';
import { SupplierDto } from './dto/supplier.dto';
import { FilamentService } from '../filament/filament.service';
import { The3dPrintSupplier } from '../schemas/supplier';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(The3dPrintSupplier.name)
    private readonly supplierModel: Model<The3dPrintSupplier>,
    private readonly filamentService: FilamentService,
  ) {}

  async page(params: SupplierPageDto, user: string) {
    const { page = 1, pageSize = 10, type } = params;

    const results = await this.supplierModel
      .find({
        creator: user,
        ...(type ? { type } : {}),
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('creator', { password: 0, salt: 0 })
      .populate('updater', { password: 0, salt: 0 })
      .populate('filamentType', {
        creator: 0,
        createdAt: 0,
        updater: 0,
        updatedAt: 0,
        __v: 0,
      })
      .exec();

    const total = await this.supplierModel.countDocuments({
      creator: user,
      ...(type ? { type } : {}),
    });

    return Response.page(results, { page, pageSize, total });
  }

  async create(body: SupplierDto, user: string) {
    const result = await this.supplierModel.create({ ...body, creator: user });
    return result;
  }

  async detail(id: string) {
    const filament = await this.filamentService.list({ supplier: id });
    const result = await this.supplierModel
      .findById(id)
      .populate('creator', { password: 0, salt: 0 })
      .populate('updater', { password: 0, salt: 0 })
      .populate('filamentType', {
        creator: 0,
        createdAt: 0,
        updater: 0,
        updatedAt: 0,
        __v: 0,
      })
      .populate('filament')
      .exec();

    result.filament = filament;

    return result;
  }

  async update(id: string, body: SupplierDto, user: string) {
    const result = await this.supplierModel.findByIdAndUpdate(id, {
      ...body,
      updater: user,
    });
    return result;
  }

  async delete(id: string) {
    const result = await this.supplierModel.findByIdAndDelete(id);
    return result;
  }

  async list() {
    const result = await this.supplierModel
      .find(
        {},
        {
          creator: 0,
          updater: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      )
      .populate('filamentType', {
        creator: 0,
        createdAt: 0,
        updater: 0,
        updatedAt: 0,
        __v: 0,
      })
      .populate('filament')
      .exec();

    return result;
  }
}
