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
import { BrandService } from './brand.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BrandPageDto } from './dto/page.dto';
import { BrandDto } from './dto/brand.dto';
import { RouteUser, User } from 'src/public/decorator/route-user.decoratpr';

@ApiTags('3D打印/品牌')
@Controller('3dPrint/brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get('/')
  @ApiOperation({ summary: '品牌' })
  @ApiQuery({ type: BrandPageDto })
  getPage(@Query() query: BrandPageDto) {
    return this.brandService.page(query);
  }

  @Post('/')
  @ApiOperation({ summary: '新增' })
  @ApiBody({ type: BrandDto })
  create(@Body() body: BrandDto, @User() user: RouteUser) {
    return this.brandService.create(body, user);
  }

  @Put('/:id')
  @ApiOperation({ summary: '更新' })
  @ApiParam({ name: 'id', description: '品牌ID' })
  @ApiBody({ type: BrandDto })
  update(
    @Param('id') id: string,
    @Body() body: BrandDto,
    @User() user: RouteUser,
  ) {
    return this.brandService.update(id, body, user);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除' })
  @ApiParam({ name: 'id', description: '品牌ID' })
  delete(@Param('id') id: string) {
    return this.brandService.delete(id);
  }

  @Get('/list')
  @ApiOperation({ summary: '列表' })
  list() {
    return this.brandService.list();
  }

  @Get('/:id')
  @ApiOperation({ summary: '详情' })
  @ApiParam({ name: 'id', description: '品牌ID' })
  detail(@Param('id') id: string) {
    return this.brandService.detail(id);
  }
}
