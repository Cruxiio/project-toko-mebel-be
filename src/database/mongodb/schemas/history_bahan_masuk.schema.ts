import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
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
  _id?: Types.ObjectId;

  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: String })
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

// Buat partial index
HistoryBahanMasukSchema.index(
  { kode_nota: 1 },
  {
    unique: true,
    // ini buat kasi tau kalau constraint unique pada kode_nota hanya berlaku ketika deleted_at: null
    partialFilterExpression: { deleted_at: null },
  },
);
