import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KaryawanDocument = Karyawan & Document;

@Schema({ timestamps: true, collection: 'karyawan' })
export class Karyawan {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: String })
  nama: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const KaryawanSchema = SchemaFactory.createForClass(Karyawan);
