import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
  @Prop({ type: String, required: true, index: true, unique: true, trim: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    required: true,
  })
  groupManger: {
    $ref: string;
    $id: mongoose.Schema.Types.ObjectId;
  };
}

export const GroupSchema = SchemaFactory.createForClass(Group);
