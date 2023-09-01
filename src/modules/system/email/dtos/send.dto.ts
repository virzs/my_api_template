import { Expose } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  @Expose()
  email: string;
}
