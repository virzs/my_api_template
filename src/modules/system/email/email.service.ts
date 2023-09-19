import {
  BadGatewayException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import CaptchaTemplate from 'src/public/template/email/captcha';
import { Logger } from 'src/utils/log4';
import { SendEmailDto } from './dtos/send.dto';
import * as dayjs from 'dayjs';
import EmailUtil from './email.util';
import { RedisConstants } from 'src/common/constants/redis';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async sendEmail(to: string) {
    const emailConfig = this.configService.get('email');
    const transporter = EmailUtil.init(emailConfig);

    const info = await transporter.sendMail({
      from: emailConfig.user,
      to: to,
      ...CaptchaTemplate('123456'),
    });

    if (info.messageId) {
      Logger.info(`Message sent: %s`, info.messageId);
      return 'success';
    }

    return info;
  }

  async sendRegisterEmail({ email }: SendEmailDto) {
    const emailConfig = this.configService.get('email');
    const transporter = EmailUtil.init(emailConfig);

    const cacheKey = `${RedisConstants.EMAIL_REGISTER_CAPTCHA_KEY}:${email}`;

    // 随机6位数字
    const captcha = Math.random().toString().slice(-6);
    // 获取缓存中的验证码
    const cache: any = await this.cacheManager.get(cacheKey);

    if (cache) {
      const { lastRequestTime } = cache;
      const now = dayjs();
      const diff = now.diff(dayjs(lastRequestTime), 'second');
      if (diff < 60)
        throw new BadGatewayException(
          `请勿重复获取验证码，请于 ${60 - diff} 秒后重试`,
        );
    }

    const info = await transporter.sendMail({
      from: emailConfig.user,
      to: email,
      ...CaptchaTemplate(captcha),
    });

    if (info.messageId) {
      await this.cacheManager.set(
        cacheKey,
        { captcha: captcha, lastRequestTime: new Date() },
        5 * 60 * 1000,
      );
      Logger.info(`Message sent:`, info.messageId, 'Cache set', cacheKey);
      return 'success';
    }

    return info;
  }
}
