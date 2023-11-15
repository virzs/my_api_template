import { registerAs } from '@nestjs/config';

export default registerAs('qiniu', () => ({
  accessKey: process.env.qiniu_access_key,
  secretKey: process.env.qiniu_secret_key,
}));
