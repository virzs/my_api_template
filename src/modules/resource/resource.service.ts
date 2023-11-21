import { Injectable } from '@nestjs/common';
import { QiniuService } from '../system/qiniu/qiniu.service';
import { InjectModel } from '@nestjs/mongoose';
import { ResourceName } from 'src/schemas/ref-names';
import { Model } from 'mongoose';
import { Resource } from 'src/schemas/resource';

@Injectable()
export class ResourceService {
  constructor(
    private readonly qiniuService: QiniuService,
    @InjectModel(ResourceName) private readonly resourceModel: Model<Resource>,
  ) {}

  // 上传文件
  async uploadFile(dir: string, file: Express.Multer.File) {
    const result = await this.qiniuService.uploadFile(dir, file);

    const dbResult = await this.resourceModel.create(result);

    return dbResult;
  }
}
