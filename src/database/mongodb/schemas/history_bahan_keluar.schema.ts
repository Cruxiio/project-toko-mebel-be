import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

import { HistoryBahanMasuk } from './history_bahan_masuk.schema';
import { Proyek } from './proyek.schema';
import { Karyawan } from './karyawan.schema';
import {
  HistoryBahanKeluarDetail,
  HistoryBahanKeluarDetailSchema,
} from './history_bahan_keluar_detail.schema';
import { Produk } from './produk.schema';

export type HistoryBahanKeluarDocument = HistoryBahanKeluar & Document;

/*
  NOTE: INI FK MASIH BELUM JELAS KARENA BAHAN SISA HARUS BISA AKSES ID_PROYEK DISINI
*/

@Schema({ timestamps: true, collection: 'history_bahan_keluar' })
export class HistoryBahanKeluar {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: 'history_bahan_masuk',
  })
  id_history_bahan_masuk: HistoryBahanMasuk;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'proyek' })
  id_proyek: Proyek;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'karyawan' })
  id_karyawan: Karyawan;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'produk' })
  id_produk: Produk;

  @Prop({ type: [HistoryBahanKeluarDetailSchema], required: true })
  detail: HistoryBahanKeluarDetail[];

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const HistoryBahanKeluarSchema =
  SchemaFactory.createForClass(HistoryBahanKeluar);
