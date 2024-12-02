import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema({ timestamps: true, collection: 'team' })
export class Team {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: String })
  nama: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
