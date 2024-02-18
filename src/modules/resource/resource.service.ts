import { BadRequestException, Injectable } from '@nestjs/common';
import { QiniuService } from '../system/qiniu/qiniu.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resource } from 'src/modules/resource/schemas/resource';
import { ResourceName } from './schemas/ref-names';

@Injectable()
export class ResourceService {
  constructor(
    private readonly qiniuService: QiniuService,
    @InjectModel(ResourceName) private readonly resourceModel: Model<Resource>,
  ) {}

  // 上传文件
  async uploadFile(dir: string, file: Express.Multer.File): Promise<any> {
    const result = await this.qiniuService.uploadFile(dir, file);

    const dbResult = (await this.resourceModel.create(result)).toJSON();

    return { ...dbResult, url: result.url };
  }

  //   获取访问链接
  async getVisitUrl(id: string) {
    const resource = await this.resourceModel.findById(id);

    if (!resource) {
      throw new BadRequestException('资源不存在');
    }

    const resut = await this.qiniuService.getVisitUrl(
      `${resource.dir}/${resource.key}`,
    );

    return resut;
  }

  // 根据 id 删除文件
  async deleteFile(id: string) {
    const resource = await this.resourceModel.findById(id);

    if (!resource) {
      throw new BadRequestException('资源不存在');
    }

    const result = await this.qiniuService.deleteFile(
      `${resource.dir}/${resource.key}`,
    );

    return result;
  }
}
