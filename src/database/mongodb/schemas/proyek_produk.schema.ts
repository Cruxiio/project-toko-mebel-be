import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Proyek } from './proyek.schema';
import { Produk } from './produk.schema';
import { KaryawanTeam } from './karyawan_team.schema';

export type ProyekProdukDocument = ProyekProduk & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'proyek_produk',
})
export class ProyekProduk {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Proyek.name })
  id_proyek: Proyek;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Produk.name })
  id_produk: Produk;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: KaryawanTeam.name })
  id_karyawan_team: KaryawanTeam;

  @Prop({ required: true, type: Number, min: 1 })
  qty: number;

  @Prop({
    required: true,
    type: String,
    enum: ['kayu', 'finishing', 'resin'],
  })
  tipe: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;

  created_at?: Date;
  updated_at?: Date;
}

export const ProyekProdukSchema = SchemaFactory.createForClass(ProyekProduk);
