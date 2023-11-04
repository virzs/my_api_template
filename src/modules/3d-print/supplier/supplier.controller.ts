import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SupplierPageDto } from './dto/page.dto';
import { SupplierDto } from './dto/supplier.dto';
import { User } from 'src/public/decorator/route-user.decoratpr';

@ApiTags('3D打印/供应商')
@Controller('3dPrint/supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get('/')
  @ApiOperation({ summary: '分页' })
  @ApiQuery({ type: SupplierPageDto })
  getPage(@Query() query: SupplierPageDto, @User('_id') user: string) {
    return this.supplierService.page(query, user);
  }

  @Post('/')
  @ApiOperation({ summary: '新增' })
  @ApiBody({ type: SupplierDto })
  create(@Body() body: SupplierDto, @User('_id') user: string) {
    return this.supplierService.create(body, user);
  }

  @Put('/:id')
  @ApiOperation({ summary: '更新' })
  @ApiParam({ name: 'id', description: '品牌ID' })
  @ApiBody({ type: SupplierDto })
  update(
    @Param('id') id: string,
    @Body() body: SupplierDto,
    @User('_id') user: string,
  ) {
    return this.supplierService.update(id, body, user);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除' })
  @ApiParam({ name: 'id', description: '品牌ID' })
  delete(@Param('id') id: string) {
    return this.supplierService.delete(id);
  }

  @Get('/list')
  @ApiOperation({ summary: '列表' })
  list() {
    return this.supplierService.list();
  }

  @Get('/:id')
  @ApiOperation({ summary: '详情' })
  @ApiParam({ name: 'id', description: '品牌ID' })
  detail(@Param('id') id: string) {
    return this.supplierService.detail(id);
  }
}
