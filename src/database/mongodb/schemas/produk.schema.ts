import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProdukDetail, ProdukDetailSchema } from './produk_detail.schema';

export type ProdukDocument = Produk & Document;

@Schema({ timestamps: true, collection: 'produk' })
export class Produk {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: String })
  nama: string;

  @Prop({ type: [ProdukDetailSchema], required: true })
  detail: ProdukDetail[];

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const ProdukSchema = SchemaFactory.createForClass(Produk);
