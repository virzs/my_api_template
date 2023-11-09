import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { The3dPrintFilamentColor } from '../schemas/filament-color';

@Injectable()
export class FilamentColorService {
  constructor(
    @InjectModel(The3dPrintFilamentColor.name)
    private readonly filamentColorModel: Model<The3dPrintFilamentColor>,
  ) {}
}
