import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Karyawan } from './karyawan.schema';

export type TeamDocument = Team & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'team',
})
export class Team {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  // Array of Karyawan ObjectId
  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: Karyawan.name }],
    default: [],
  })
  // Can hold populated objects or raw ObjectId strings
  anggota: (Types.ObjectId | Karyawan)[];

  @Prop({ type: Date, default: null })
  deleted_at?: Date;

  created_at?: Date;
  updated_at?: Date;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
