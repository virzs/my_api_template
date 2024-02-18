import { Controller, Get, Param } from '@nestjs/common';
import { BtbttService } from './btbtt.service';
import { RequireLogin } from 'src/public/decorator/require_login.decorator';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('爬虫/比特比特')
@Controller('reptile/btbtt')
export class BtbttController {
  constructor(private readonly btbttService: BtbttService) {}

  @Get('list')
  @RequireLogin()
  async fetchList() {
    return this.btbttService.fetchList();
  }

  @Get('detail')
  @ApiOperation({ summary: '获取详情' })
  @ApiParam({ name: 'id', description: 'id' })
  @RequireLogin()
  async fetchDetail(@Param('id') id: string) {
    return this.btbttService.fetchDetail(id);
  }
}
