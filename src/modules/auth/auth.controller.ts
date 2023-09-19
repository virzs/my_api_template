import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/dtos/user';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';

@ApiTags('授权')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: '用户注册' })
  @ApiBody({ type: RegisterDto })
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @ApiOperation({ description: '用户登录' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @ApiOperation({ description: '刷新token' })
  @Post('refresh-token')
  refreshToken(@Headers() headers) {
    return this.authService.refreshToken(headers);
  }
}
