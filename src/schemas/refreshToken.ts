import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ type: User })
  user: User;

  @Prop({ type: Date })
  expires: Date;

  @Prop({ type: Number, default: 0 })
  count: number;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
