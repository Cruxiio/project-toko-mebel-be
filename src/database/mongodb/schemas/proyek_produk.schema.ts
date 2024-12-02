import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Team } from './team.schema';
import { Proyek } from './proyek.schema';
import { Produk } from './produk.schema';

export type ProyekProdukDocument = ProyekProduk & Document;

@Schema({ timestamps: true, collection: 'proyek_produk' })
export class ProyekProduk {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'proyek' })
  id_proyek: Proyek;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'produk' })
  id_produk: Produk;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'team' })
  id_team: Team;

  @Prop({
    required: true,
    type: String,
    enum: ['kayu', 'finishing', 'resin'],
  })
  tipe: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const ProyekProdukSchema = SchemaFactory.createForClass(ProyekProduk);
