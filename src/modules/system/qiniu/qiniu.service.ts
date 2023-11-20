import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qiniu from 'qiniu';

@Injectable()
export class QiniuService {
  constructor(private readonly configService: ConfigService) {}

  async getQiniu() {
    const config = await this.configService.get('qiniu');

    qiniu.conf.ACCESS_KEY = config.accessKey;
    qiniu.conf.SECRET_KEY = config.secretKey;

    return qiniu;
  }

  async getPutPolicy() {
    const q = await this.getQiniu();

    const options = {
      scope: '',
      expires: 7200,
    };

    const putPolicy = new q.rs.PutPolicy(options);

    return putPolicy.uploadToken();
  }
}
