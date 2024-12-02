import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Bahan } from './bahan.schema';
import { Satuan } from './satuan.schema';
import { BahanSisa } from './bahan_sisa.schema';

export type HistoryBahanKeluarDetailDocument = HistoryBahanKeluarDetail &
  Document;

@Schema({ timestamps: true, collection: 'history_bahan_keluar_detail' })
export class HistoryBahanKeluarDetail {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'bahan' })
  id_bahan: Bahan;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'satuan' })
  id_satuan: Satuan;

  @Prop({ required: true, type: Number })
  qty: number;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'bahan_sisa' })
  sisa: BahanSisa;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const HistoryBahanKeluarDetailSchema = SchemaFactory.createForClass(
  HistoryBahanKeluarDetail,
);
