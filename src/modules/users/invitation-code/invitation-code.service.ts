import { Injectable } from '@nestjs/common';
import { InvitationCodeName } from '../schemas/ref-names';
import { InvitationCode } from '../schemas/invitation-code';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InvitationCodeDto } from './dto/invitation-code.dto';

@Injectable()
export class InvitationCodeService {
  constructor(
    @InjectModel(InvitationCodeName)
    private readonly codeModel: Model<InvitationCode>,
  ) {}

  async codeList(id: string) {
    const result = await this.codeModel.find({ creator: id });
    return result;
  }

  async create(user, data: InvitationCodeDto) {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    const result = await this.codeModel.create({
      ...data,
      code,
      creator: user,
    });
    return result;
  }

  //   useCount++
  async updateUseCount(code: string) {
    const result = await this.codeModel
      .findOneAndUpdate({ code }, { $inc: { useCount: 1 } })
      .exec();
    return result;
  }

  //   change status
  async changeStatus(code: string, status: number) {
    const result = await this.codeModel
      .findOneAndUpdate(
        {
          code,
        },
        {
          status,
        },
      )
      .exec();
    return result;
  }

  async checkCode(code: string) {
    const result = await this.codeModel.findOne({ code, status: 0 }).exec();
    return result;
  }

  //   更新邀请码使用人users
  async updateUsers(code: string, user: string) {
    const result = await this.codeModel
      .findOneAndUpdate(
        {
          code,
        },
        {
          $push: {
            users: user,
          },
          $inc: {
            useCount: 1,
          },
        },
      )
      .exec();
    return result;
  }
}
