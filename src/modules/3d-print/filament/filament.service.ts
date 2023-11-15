import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { The3dPrintFilament } from '../schemas/filament';
import { FilamentPageDto } from './dto/page.dto';
import { Response } from 'src/utils/response';
import { FilamentDto, FilamentListDto } from './dto/filament.dto';
import { FilamentInfoService } from '../filament-info/filament-info.service';
import { The3dPrintSupplier } from '../schemas/supplier';

@Injectable()
export class FilamentService {
  constructor(
    @InjectModel(The3dPrintFilament.name)
    private readonly filamentModel: Model<The3dPrintFilament>,
    private readonly filamentinfoService: FilamentInfoService,
    @InjectModel(The3dPrintSupplier.name)
    private readonly supplierModel: Model<The3dPrintSupplier>,
  ) {}

  async page(params: FilamentPageDto) {
    const { page = 1, pageSize = 10 } = params;

    const results = await this.filamentModel
      .find({ isDelete: false })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('creator', { password: 0, salt: 0 })
      .populate('updater', { password: 0, salt: 0 })
      .populate('supplier')
      .populate('info')
      .populate('type', {
        creator: 0,
        createdAt: 0,
        updater: 0,
        updatedAt: 0,
        __v: 0,
      })
      .exec();

    const total = await this.filamentModel.countDocuments();

    return Response.page(results, { page, pageSize, total });
  }

  async detail(id: string) {
    const result = await this.filamentModel
      .findById(id, { isDelete: false })
      .populate('creator', { password: 0, salt: 0 })
      .populate('updater', { password: 0, salt: 0 })
      .populate([{ path: 'supplier', populate: 'filamentType' }])
      .populate('info')
      .populate('type', {
        creator: 0,
        createdAt: 0,
        updater: 0,
        updatedAt: 0,
        __v: 0,
      })
      .exec();

    return result;
  }

  async create(body: FilamentDto, user: string) {
    const { info, ...rest } = body;
    const result = await this.filamentModel.create({ ...rest, creator: user });

    if (result._id) {
      const infoResult = await this.filamentinfoService.createOrUpdate(
        result._id.toString(),
        info,
      );

      await this.filamentModel.findByIdAndUpdate(result._id, {
        info: infoResult,
      });

      await this.supplierModel.findByIdAndUpdate(body.supplier, {
        $push: { filament: result._id },
      });

      result.info = infoResult;

      return result;
    }

    return result;
  }

  async update(id: string, body: FilamentDto, user: string) {
    const { info, ...rest } = body;
    const result = await this.filamentModel.findByIdAndUpdate(id, {
      ...rest,
      updater: user,
    });

    if (!result) {
      throw new BadRequestException('耗材不存在');
    }

    const infoResult = await this.filamentinfoService.createOrUpdate(id, info);

    await this.filamentModel.findByIdAndUpdate(id, {
      info: infoResult,
    });

    await this.supplierModel.findByIdAndUpdate(body.supplier, {
      $push: { filament: id },
    });

    result.info = infoResult;

    return result;
  }

  async delete(id: string) {
    const result = await this.filamentModel.findByIdAndUpdate(id, {
      isDelete: true,
    });

    await this.filamentinfoService.deleteByIds(
      result.info as unknown as string[],
    );

    return result;
  }

  async list(params: FilamentListDto) {
    const results = await this.filamentModel
      .find(params)
      .populate('creator', { password: 0, salt: 0 })
      .populate('updater', { password: 0, salt: 0 })
      .populate('supplier')
      .populate('type', {
        creator: 0,
        createdAt: 0,
        updater: 0,
        updatedAt: 0,
        __v: 0,
      })
      .exec();

    return results;
  }
}
