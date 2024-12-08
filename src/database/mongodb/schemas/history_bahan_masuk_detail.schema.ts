import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Bahan } from './bahan.schema';
import { Satuan } from './satuan.schema';
import { HistoryBahanMasuk } from './history_bahan_masuk.schema';

export type HistoryBahanMasukDetailDocument = HistoryBahanMasukDetail &
  Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'history_bahan_masuk_detail',
})
export class HistoryBahanMasukDetail {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: HistoryBahanMasuk.name,
  })
  id_history_bahan_masuk: HistoryBahanMasuk;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Bahan.name })
  id_bahan: Bahan;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Satuan.name })
  id_satuan: Satuan;

  @Prop({ required: true, type: Number })
  qty: number;

  @Prop({ required: true, type: Number, min: 0 })
  qtyPakai: number;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;

  created_at?: Date;
  updated_at?: Date;
}

export const HistoryBahanMasukDetailSchema = SchemaFactory.createForClass(
  HistoryBahanMasukDetail,
);
