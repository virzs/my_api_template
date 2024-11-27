import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { The3dPrintFilamentColor } from '../schemas/filament-color';
import { FilamentColorDto } from './dto/filament-color.dto';

@Injectable()
export class FilamentColorService {
  constructor(
    @InjectModel(The3dPrintFilamentColor.name)
    private readonly filamentColorModel: Model<The3dPrintFilamentColor>,
  ) {}

  list() {
    return this.filamentColorModel.find({ isDelete: false }).exec();
  }

  create(body: FilamentColorDto, user: string) {
    return this.filamentColorModel.create({ ...body, creator: user });
  }

  update(id: string, body: FilamentColorDto, user: string) {
    return this.filamentColorModel.findByIdAndUpdate(id, {
      ...body,
      updater: user,
    });
  }

  delete(id: string) {
    return this.filamentColorModel.findByIdAndUpdate(id, { isDelete: true });
  }
}
