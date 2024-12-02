import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Satuan } from './satuan.schema';
import { HistoryBahanKeluarDetail } from './history_bahan_keluar_detail.schema';

export type BahanSisaDocument = BahanSisa & Document;

@Schema({ timestamps: true, collection: 'bahan_sisa' })
export class BahanSisa {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'satuan' })
  id_satuan: Satuan;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: 'history_bahan_keluar_detail',
  })
  id_history_bahan_keluar_detail: HistoryBahanKeluarDetail;

  @Prop({ required: true, type: Number })
  qty: number;

  @Prop({ type: String })
  keterangan: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const BahanSisaSchema = SchemaFactory.createForClass(BahanSisa);
