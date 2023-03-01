import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/dtos/user';
import { AuthService } from './auth.service';

@ApiTags('授权')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: '用户注册' })
  @Post('register')
  register(@Body() body: LoginDto) {
    return this.authService.register(body);
  }

  @ApiOperation({ description: '用户登录' })
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
