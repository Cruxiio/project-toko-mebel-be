import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Bahan } from './bahan.schema';
import { Satuan } from './satuan.schema';

export type ProdukDetailDocument = ProdukDetail & Document;

@Schema({ timestamps: true, collection: 'produk_detail' })
export class ProdukDetail {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'bahan' })
  id_bahan: Bahan;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'satuan' })
  id_satuan: Satuan;

  @Prop({ required: true, type: Number })
  qty: number;

  @Prop({ type: String })
  keterangan: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const ProdukDetailSchema = SchemaFactory.createForClass(ProdukDetail);
