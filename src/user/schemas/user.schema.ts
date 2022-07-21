import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { RoleEnum } from '../../auth/authorization/role.enum';
import { Group } from '../../group/schemas/groupe.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true, index: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true, default: 'images/avatar.png' })
  avatar: string;

  @Prop({
    type: [String],
    required: true,
    default: RoleEnum.User,
    enum: RoleEnum,
  })
  roles: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Group.name,
  })
  group: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
