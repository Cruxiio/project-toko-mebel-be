import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Bahan } from './bahan.schema';
import { Satuan } from './satuan.schema';

export type NotaDetailDocument = NotaDetail & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'nota_detail',
})
export class NotaDetail {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Bahan.name })
  id_bahan: Bahan;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Satuan.name })
  id_satuan: Satuan;

  @Prop({ required: true, type: Number })
  qty: number;

  @Prop({ required: true, type: Number })
  harga_satuan: number;

  @Prop({ type: Number, default: 0 })
  diskon: number;

  @Prop({ required: true, type: Number })
  subtotal: number;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;

  created_at?: Date;
  updated_at?: Date;
}

export const NotaDetailSchema = SchemaFactory.createForClass(NotaDetail);
