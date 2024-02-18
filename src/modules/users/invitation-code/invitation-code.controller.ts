import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { InvitationCodeService } from './invitation-code.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/public/decorator/route-user.decoratpr';
import { InvitationCodeDto } from './dto/invitation-code.dto';

@ApiTags('用户/邀请码')
@Controller('users/invitation-code')
export class InvitationCodeController {
  constructor(private readonly invitationCodeService: InvitationCodeService) {}

  @Get('/')
  @ApiOperation({ summary: '列表' })
  getCode(@User('_id') user: string) {
    return this.invitationCodeService.codeList(user);
  }

  @Post('/')
  @ApiOperation({ summary: '生成邀请码' })
  createCode(@User('_id') user: string, @Body() body: InvitationCodeDto) {
    return this.invitationCodeService.create(user, body);
  }

  @Put('/status')
  @ApiOperation({ summary: '修改邀请码状态' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: '邀请码',
        },
        status: {
          type: 'number',
          description: '状态',
        },
      },
    },
  })
  changeStatus(@Body('code') code: string, @Body('status') status: number) {
    return this.invitationCodeService.changeStatus(code, status);
  }
}
