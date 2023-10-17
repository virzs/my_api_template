import { Body, Controller, Headers, Post, Request } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { RequireLogin } from 'src/public/decorator/require_login.decorator';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

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
  @ApiBody({ type: RefreshTokenDto })
  @Post('refresh-token')
  refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body);
  }
}
