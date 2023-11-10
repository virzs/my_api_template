import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FilamentTypeDto } from './dto/type.dto';
import { The3dPrintFilamentType } from '../schemas/filament-type';

@Injectable()
export class FilamentTypeService {
  constructor(
    @InjectModel(The3dPrintFilamentType.name)
    private readonly filamentTypeModel: Model<The3dPrintFilamentType>,
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
