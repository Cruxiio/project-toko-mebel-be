import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Bahan } from './bahan.schema';
import { Satuan } from './satuan.schema';

export type HistoryBahanMasukDetailDocument = HistoryBahanMasukDetail &
  Document;

@Schema({ timestamps: true, collection: 'history_bahan_masuk_detail' })
export class HistoryBahanMasukDetail {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'bahan' })
  id_bahan: Bahan;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'satuan' })
  id_satuan: Satuan;

  @Prop({ required: true, type: Number })
  qty: number;

  @Prop({ required: true, type: Number })
  qtyPakai: number;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const HistoryBahanMasukDetailSchema = SchemaFactory.createForClass(
  HistoryBahanMasukDetail,
);
