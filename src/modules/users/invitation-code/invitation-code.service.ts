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
    const result = await this.codeModel
      .find({ creator: id })
      .populate('roles')
      .exec();
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
    let result = await this.codeModel
      .findOneAndUpdate({ code }, { $inc: { useCount: 1 } }, { new: true })
      .exec();

    if (result && result.useCount >= result.maxUse) {
      result = await this.codeModel
        .findOneAndUpdate({ code }, { $set: { status: 1 } }, { new: true })
        .exec();
    }

    return result;
  }

  //   change status
  async changeStatus(_id: string) {
    const result = await this.codeModel
      .findByIdAndUpdate(_id, {
        status: 2,
      })
      .exec();
    return result;
  }

  async checkCode(code: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await this.codeModel
      .findOne({
        code,
        status: 0,
        $or: [{ expire: { $exists: false } }, { expire: { $gte: today } }],
        $expr: { $lt: ['$useCount', '$maxUse'] },
      })
      .exec();

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
