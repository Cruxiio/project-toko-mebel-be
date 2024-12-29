import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Bahan } from './bahan.schema';
import { Satuan } from './satuan.schema';

export type ProdukDetailDocument = ProdukDetail & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'produk_detail',
})
export class ProdukDetail {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Bahan.name })
  id_bahan: Bahan;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Satuan.name })
  id_satuan: Satuan;

  @Prop({ required: true, type: Number })
  qty: number;

  @Prop({ required: true, type: Number })
  qtyPakai: number;

  @Prop({ type: String, default: null })
  keterangan: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;

  created_at?: Date;
  updated_at?: Date;
}

export const ProdukDetailSchema = SchemaFactory.createForClass(ProdukDetail);
