import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodeMailer from 'nodemailer';
import CaptchaTemplate from 'src/public/template/email/captcha';
import { Logger } from 'src/utils/log4';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendEmail(to: string) {
    const emailConfig = this.configService.get('email');

    // kffzspwqskhqvpqo
    const transporter = nodeMailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: false,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });
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
}
