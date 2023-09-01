import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dtos/send.dto';

@Controller('system/email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  sendEmail(@Body() body: SendEmailDto) {
    return this.emailService.sendEmail(body.email);
  }
}
