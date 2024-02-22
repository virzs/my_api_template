import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PageDto } from 'src/public/dto/page';
import { Project } from 'src/modules/system/project/schemas/project';
import { Response } from 'src/utils/response';
import { ProjectName } from './schemas/ref-names';
import { ProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(ProjectName) private readonly projectModel: Model<Project>,
  ) {}

  async list(query: PageDto) {
    const { page = 1, pageSize = 10 } = query;

    const projects = await this.projectModel
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const total = await this.projectModel.countDocuments();

    return Response.page(projects, { page, pageSize, total });
  }

  async create(body: ProjectDto, user: string) {
    const result = await this.projectModel.create({ ...body, creator: user });
    return result;
  }

  async update(id: string, body: ProjectDto, user: string) {
    console.log(body);
    const result = await this.projectModel.findByIdAndUpdate(
      id,
      { ...body, updater: user },
      {
        new: true,
      },
    );
    return result;
  }

  async detail() {
    // 当前始终只有一条，多项目配置以后看情况修改
    const project = await this.projectModel.findOne().exec();
    return project ?? ({} as Project);
  }

  async publicDetail(): Promise<Partial<Project>> {
    const project = (await this.projectModel.findOne().exec()).toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ...rest } = project ?? ({} as Project);
    return rest;
  }
}
