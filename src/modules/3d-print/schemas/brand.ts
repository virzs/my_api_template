import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema from 'src/public/schema/base.schema';

@Schema({ timestamps: true })
export class Brand extends BaseSchema {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String })
  nameEn: string;

  @Prop({ type: String })
  logo: string;

  @Prop({ type: String })
  description: string;

  //   品牌类型，0：3D打印机，1：3D打印耗材，2：3D打印服务，3：3D打印软件，4：3D扫描仪 Array 类型
  @Prop({ type: [{ type: Number }] })
  type: number[];

  @Prop({ type: String })
  url: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
