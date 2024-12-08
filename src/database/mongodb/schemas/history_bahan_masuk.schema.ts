import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Supplier } from './supplier.schema';
import {
  HistoryBahanMasukDetail,
  HistoryBahanMasukDetailSchema,
} from './history_bahan_masuk_detail.schema';

export type HistoryBahanMasukDocument = HistoryBahanMasuk & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'history_bahan_masuk',
})
export class HistoryBahanMasuk {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: String, unique: true })
  kode_nota: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Supplier.name })
  id_supplier: Supplier;

  @Prop({ required: true, type: Date })
  tgl_nota: Date;

  @Prop({
    required: true,
    type: String,
  })
  no_spb: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;

  created_at?: Date;
  updated_at?: Date;
}

export const HistoryBahanMasukSchema =
  SchemaFactory.createForClass(HistoryBahanMasuk);
