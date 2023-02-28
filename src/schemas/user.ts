import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class UsersSchema {
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: false, sparse: true, unique: true })
  email: string;

  @Prop({ type: String, required: false })
  avatar: string;

  @Prop({ type: String })
  salt: string;

  @Prop({ type: Boolean, default: false })
  isAdmin: boolean;

  @Prop({ type: Boolean, default: false })
  initWebsite: boolean;
}

export default SchemaFactory.createForClass(UsersSchema);
