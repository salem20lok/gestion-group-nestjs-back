import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
  @Prop({ type: String, required: true, index: true, unique: true, trim: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  groupManger: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: User.name,
  })
  users: string[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
