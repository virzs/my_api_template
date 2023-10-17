import { Body, Controller, Headers, Post, Request } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/dtos/user';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { RequireLogin } from 'src/public/decorator/require_login.decorator';

@ApiTags('授权')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '用户注册' })
  @ApiBody({ type: RegisterDto })
  @Post('register')
  @RequireLogin()
  register(@Body() body: RegisterDto, @Request() headers) {
    console.log(headers);
    return this.authService.register(body);
  }

  @ApiOperation({ summary: '用户登录' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  @RequireLogin()
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @ApiOperation({ summary: '刷新token' })
  @Post('refresh-token')
  refreshToken(@Headers() headers) {
    return this.authService.refreshToken(headers);
  }
}
