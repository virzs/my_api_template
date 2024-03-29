import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qiniu from 'qiniu';
import { Readable } from 'stream';

@Injectable()
export class QiniuService {
  constructor(private readonly configService: ConfigService) {}

  async getConfig() {
    return await this.configService.get('qiniu');
  }

  async getQiniu() {
    const config = await this.getConfig();

    qiniu.conf.ACCESS_KEY = config.accessKey;
    qiniu.conf.SECRET_KEY = config.secretKey;

    return qiniu;
  }

  async getMac() {
    const config = await this.getConfig();

    const mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);
    return mac;
  }

  async getBucketManager() {
    const mac = await this.getMac();

    const bucketManager = new qiniu.rs.BucketManager(mac, null);
    return bucketManager;
  }

  async getPutPolicy(key: string) {
    const config = await this.getConfig();
    const q = await this.getQiniu();

    const options = {
      scope: config.bucket + ':' + key,
      expires: 3600,
    };

    const mac = await this.getMac();
    const putPolicy = new q.rs.PutPolicy(options);
    const token = putPolicy.uploadToken(mac);

    return token;
  }

  async uploadFile(dir: string, file: Express.Multer.File) {
    const qiniu = await this.getQiniu();
    const config = new qiniu.conf.Config();
    // 生成随机字符串+文件名
    const hashName = `${Math.random().toString(36).substr(2)}_${
      file.originalname
    }`;

    const key = dir + '/' + hashName;
    const token = await this.getPutPolicy(key);
    const extra = new qiniu.form_up.PutExtra();
    const formUploader = new qiniu.form_up.FormUploader(config);
    // file buffer to stream
    const stream = Readable.from(file.buffer);

    const putFile: any = await new Promise((resolve, reject) => {
      formUploader.putStream(token, key, stream, extra, (err, ret) => {
        stream.push(null);
        if (!err) {
          resolve(ret);
        } else {
          reject(err);
        }
      });
    });

    stream.destroy();

    const url = await this.getVisitUrl(key);

    if (putFile.key) {
      return {
        name: file.originalname,
        key: hashName,
        mimetype: file.mimetype,
        dir: dir,
        size: file.size,
        url,
      };
    } else {
      return putFile;
    }
  }

  // 获取访问链接
  async getVisitUrl(key: string) {
    const config = await this.getConfig();

    const bucketManager = await this.getBucketManager();
    const publicBucketDomain = config.bucketDomain;
    const deadline = Number((Date.now() / 1000 + 3600).toFixed(0));
    const publicDownloadUrl = bucketManager.privateDownloadUrl(
      publicBucketDomain,
      key,
      deadline,
    );

    return publicDownloadUrl;
  }

  // 删除文件
  async deleteFile(key: string) {
    const bucketManager = await this.getBucketManager();
    const config = await this.getConfig();

    const res = await new Promise((resolve, reject) => {
      bucketManager.delete(config.bucket, key, (err, respBody, respInfo) => {
        if (err) {
          reject(err);
        } else {
          resolve(respInfo);
        }
      });
    });

    return res;
  }
}
