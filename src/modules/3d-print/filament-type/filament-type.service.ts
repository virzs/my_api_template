import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { FilamentType } from '../schemas/filament-type';
import { InjectModel } from '@nestjs/mongoose';
import { FilamentTypeDto } from './dto/type.dto';

@Injectable()
export class FilamentTypeService {
  constructor(
    @InjectModel('3DPrintFilamentType')
    private readonly filamentTypeModel: Model<FilamentType>,
  ) {}

  async list() {
    const results = await this.filamentTypeModel.find().exec();
    return results;
  }

  async create(body: FilamentTypeDto, user: string) {
    const result = await this.filamentTypeModel.create({
      ...body,
      creator: user,
    });
    return result;
  }

  async update(id: string, body: FilamentTypeDto, user: string) {
    const result = await this.filamentTypeModel.findByIdAndUpdate(id, {
      ...body,
      updater: user,
    });
    return result;
  }

  async delete(id: string) {
    const result = await this.filamentTypeModel.findByIdAndDelete(id);
    return result;
  }

  async detail(id: string) {
    const result = await this.filamentTypeModel.findById(id).exec();
    return result;
  }
}
