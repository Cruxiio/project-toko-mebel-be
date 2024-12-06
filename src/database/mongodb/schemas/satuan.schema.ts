import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SatuanDocument = Satuan & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'satuan',
})
export class Satuan {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: String })
  nama: string;

  @Prop({ required: true, type: String })
  satuan_terkecil: string;

  @Prop({ required: true, type: Number, min: 1 })
  konversi: number;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;

  created_at?: Date;
  updated_at?: Date;
}

export const SatuanSchema = SchemaFactory.createForClass(Satuan);
