import { Types } from 'mongoose';

// HistoryBahanMasukFindOneResponse digunakan untuk response create update dan find one
export interface HistoryBahanMasukFindOneResponse {
  id?: number;
  kode_nota: string;
  id_supplier: number;
  tgl_nota: Date;
  no_spb: string;
  created_at?: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}

export interface HistoryBahanMasukDetailData {
  id?: number;
  id_bahan?: number;
  nama_bahan?: string;
  id_satuan?: number;
  nama_satuan?: string;
  qty: number;
  qty_pakai?: number;
}

export interface StokFindAllResponseData extends HistoryBahanMasukDetailData {
  id?: number;
  id_history_bahan_masuk?: number;
  tgl_nota: Date;
  nama_bahan: string;
  nama_satuan: string;
  created_at?: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}

export interface StokFindAllResponse {
  page: number;
  per_page: number;
  data: StokFindAllResponseData[];
  total_page: number;
}

export interface LaporanStokBahanMasukResponseData
  extends StokFindAllResponseData {
  nama_supplier: string;
  no_spb: string;
}

export interface LaporanStokBahanMasukResponse {
  data: LaporanStokBahanMasukResponseData[];
}

// HistoryBahanMasukDetailFindOneByIDResponse untuk tampung hasil find one by history bahan masuk ID
export interface HistoryBahanMasukDetailFindOneByIDResponse
  extends HistoryBahanMasukFindOneResponse {
  detail: HistoryBahanMasukDetailData[];
}

/* NOTE:
HistoryBahanMasukDetailDatabaseInput dan HistoryMasukDtoDatabaseInput digunakan untuk sebagai template interface untuk input data hist bahan masuk biasa dan detail ke database

karena di mongodb meminta _id untuk reference ke collection lain, maka id_supplier, id_bahan, dan id_satuan diubah menjadi Types.ObjectId
*/
export interface HistoryBahanMasukDetailDatabaseInput {
  id_bahan: Types.ObjectId;

  id_satuan: Types.ObjectId;

  qtyPakai: number;

  qty: number;
}

export class HistoryMasukDtoDatabaseInput {
  kode_nota: string;

  id_supplier: Types.ObjectId;

  tgl_nota: Date;

  no_spb: string;

  detail: HistoryBahanMasukDetailDatabaseInput[];
}

export class HistoryBahanMasukDetailUpdateDatabaseInput {
  id: number;

  qtyPakai: number;
}

export interface HistoryBahanMasukFindAllResponseData {
  id: number;
  kode_nota: string;
  id_supplier: number;
  tgl_nota: Date;
  no_spb: string;
  created_at?: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}

export interface HistoryBahanMasukFindAllResponse {
  page: number;
  per_page: number;
  data: HistoryBahanMasukFindAllResponseData[];
  total_page: number;
}
