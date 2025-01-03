import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Satuan } from './satuan.schema';
import { Produk } from './produk.schema';

export type ProdukJasaDocument = ProdukJasa & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'produk_jasa',
})
export class ProdukJasa {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: Produk.name,
  })
  id_produk: Produk;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Satuan.name })
  id_satuan: Satuan;

  @Prop({ required: true, type: String })
  nama: string;

  @Prop({ required: true, type: Number })
  qty: number;

  @Prop({ required: true, type: Number })
  harga_satuan: number;

  @Prop({ required: true, type: Number })
  subtotal: number;

  @Prop({ type: String })
  keterangan: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;

  created_at?: Date;
  updated_at?: Date;
}

export const ProdukJasaSchema = SchemaFactory.createForClass(ProdukJasa);
