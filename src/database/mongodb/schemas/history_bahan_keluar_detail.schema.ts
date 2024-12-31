import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Bahan } from './bahan.schema';
import { Satuan } from './satuan.schema';
import { BahanSisa } from './bahan_sisa.schema';
import { HistoryBahanKeluar } from './history_bahan_keluar.schema';
import { HistoryBahanMasukDetail } from './history_bahan_masuk_detail.schema';

export type HistoryBahanKeluarDetailDocument = HistoryBahanKeluarDetail &
  Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'history_bahan_keluar_detail',
})
export class HistoryBahanKeluarDetail {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: HistoryBahanKeluar.name,
  })
  id_history_bahan_keluar: HistoryBahanKeluar;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: HistoryBahanMasukDetail.name,
  })
  id_history_bahan_masuk_detail: HistoryBahanMasukDetail;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Satuan.name })
  id_satuan: Satuan;

  @Prop({ required: true, type: Number })
  qty: number;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;

  created_at?: Date;
  updated_at?: Date;
}

export const HistoryBahanKeluarDetailSchema = SchemaFactory.createForClass(
  HistoryBahanKeluarDetail,
);
