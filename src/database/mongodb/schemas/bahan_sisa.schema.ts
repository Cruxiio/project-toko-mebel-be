import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Satuan } from './satuan.schema';
import { HistoryBahanKeluarDetail } from './history_bahan_keluar_detail.schema';

export type BahanSisaDocument = BahanSisa & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'bahan_sisa',
})
export class BahanSisa {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: HistoryBahanKeluarDetail.name,
  })
  id_history_bahan_keluar_detail: HistoryBahanKeluarDetail;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Satuan.name })
  id_satuan: Satuan;

  @Prop({ required: true, type: Number })
  qty: number;

  @Prop({ type: Number, default: 0 })
  qty_pakai: number;

  @Prop({ type: String })
  keterangan: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;

  created_at?: Date;
  updated_at?: Date;
}

export const BahanSisaSchema = SchemaFactory.createForClass(BahanSisa);
