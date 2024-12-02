import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Supplier } from './supplier.schema';
import {
  HistoryBahanMasukDetail,
  HistoryBahanMasukDetailSchema,
} from './history_bahan_masuk_detail.schema';

export type HistoryBahanMasukDocument = HistoryBahanMasuk & Document;

@Schema({ timestamps: true, collection: 'history_bahan_masuk' })
export class HistoryBahanMasuk {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: String })
  kode_nota: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'supplier' })
  id_supplier: Supplier;

  @Prop({ required: true, type: Date })
  tgl_nota: Date;

  @Prop({
    required: true,
    type: String,
  })
  no_spb: string;

  @Prop({ type: [HistoryBahanMasukDetailSchema], required: true })
  detail: HistoryBahanMasukDetail[];

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const HistoryBahanMasukSchema =
  SchemaFactory.createForClass(HistoryBahanMasuk);
