import { Controller, Get } from '@nestjs/common';
import { ConstantService } from './constant.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireLogin } from 'src/public/decorator/require_login.decorator';

@ApiTags('3D打印/常量')
@Controller('/3dPrint/constant')
export class ConstantController {
  constructor(private readonly constantService: ConstantService) {}

  @Get('/supplierType')
  @ApiOperation({ summary: '品牌类型' })
  @RequireLogin()
  async getSupplierType() {
    return this.constantService.getSupplierType();
  }
}
