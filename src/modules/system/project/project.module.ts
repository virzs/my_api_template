import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from 'src/schemas/project';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Project',
        schema: ProjectSchema,
        collection: 'project',
      },
    ]),
  ],
})
export class ProjectModule {}
