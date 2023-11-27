import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PageDto } from 'src/public/dto/page';
import { Project } from 'src/schemas/project';
import { Response } from 'src/utils/response';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
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
}
