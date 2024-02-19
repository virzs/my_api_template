import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectDto } from './dto/project.dto';
import { User } from 'src/public/decorator/route-user.decoratpr';

@ApiTags('项目')
@Controller('system/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('/')
  @ApiOperation({ summary: '项目详情' })
  async detail() {
    return await this.projectService.detail();
  }

  @Post('/')
  @ApiOperation({ summary: '新增项目' })
  async create(@Body() body: ProjectDto, @User('_id') user: string) {
    return await this.projectService.create(body, user);
  }

  @Put('/:id')
  @ApiOperation({ summary: '更新项目' })
  async update(
    @Param('id') id: string,
    @Body() body: ProjectDto,
    @User('_id') user: string,
  ) {
    return await this.projectService.update(id, body, user);
  }
}
