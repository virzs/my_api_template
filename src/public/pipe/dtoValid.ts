import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
class DefaultDTOValidationPipe implements PipeTransform<any> {
  private toValidate(metaType: Type<any>): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metaType === type);
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!value || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value, {
      excludeExtraneousValues: true,
    });
    // 删除未验证的值及非法值
    const deleteUndefined = instanceToPlain(object);

    for (const i in deleteUndefined) {
      if (deleteUndefined[i] === undefined || deleteUndefined[i] === '') {
        delete deleteUndefined[i];
      }
    }

    const delObj = plainToClass(metatype, deleteUndefined);
    const errors = await validate(delObj);

    if (errors.length > 0) {
      console.error('request error', errors);
      const msg = Object.values(errors[0].constraints)[0]; // 只需要取第一个错误信息并返回即可
      throw new BadRequestException(`Validation failed: ${msg}`);
    }
    return deleteUndefined;
  }
}

export default DefaultDTOValidationPipe;
