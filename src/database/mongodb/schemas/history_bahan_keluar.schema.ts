import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Karyawan } from './karyawan.schema';
import { ProyekProduk } from './proyek_produk.schema';

export type HistoryBahanKeluarDocument = HistoryBahanKeluar & Document;

/*
  NOTE: INI FK MASIH BELUM JELAS KARENA BAHAN SISA HARUS BISA AKSES ID_PROYEK DISINI
*/

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'history_bahan_keluar',
})
export class HistoryBahanKeluar {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: ProyekProduk.name })
  id_proyek_produk: ProyekProduk;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Karyawan.name })
  id_karyawan: Karyawan;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;

  created_at?: Date;
  updated_at?: Date;
}

export const HistoryBahanKeluarSchema =
  SchemaFactory.createForClass(HistoryBahanKeluar);
