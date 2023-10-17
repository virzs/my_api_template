import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dtos/send.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('邮件')
@Controller('system/email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @ApiOperation({ summary: '发送邮件' })
  @Post('send')
  sendEmail(@Body() body: SendEmailDto) {
    return this.emailService.sendEmail(body.email);
  }

  @ApiOperation({ summary: '获取注册验证码' })
  @ApiBody({ type: SendEmailDto })
  @Post('register/captcha')
  registerCaptcha(@Body() body: SendEmailDto) {
    return this.emailService.sendRegisterEmail(body);
  }
}
