import { Types } from 'mongoose';

// database input

export interface HistoryBahanKeluarDetailDatabaseInput {
  id?: number;

  id_history_bahan_keluar?: Types.ObjectId;

  id_history_bahan_masuk_detail: Types.ObjectId;

  id_satuan: Types.ObjectId;

  qty: number;
}

export class HistoryKeluarDtoDatabaseInput {
  id_proyek_produk: Types.ObjectId;

  id_karyawan: Types.ObjectId;

  detail: HistoryBahanKeluarDetailDatabaseInput[];
}

// response

export interface HistoryBahanKeluarDetailData {
  id?: number;
  id_history_bahan_masuk_detail?: number;
  nama_bahan: string;
  id_satuan?: number;
  satuan_terkecil?: string;
  nama_satuan: string;
  qty: number;
}

export interface HistoryBahanKeluarFindOneResponse {
  id?: number;
  id_proyek_produk: number;
  nama_proyek: string;
  nama_produk: string;
  id_karyawan: number;
  nama_karyawan: string;
  created_at?: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}

export interface HistoryBahanKeluarDetailFindOneResponse {
  id: number;
  id_history_bahan_keluar: number;
  nama_proyek: string;
  id_history_bahan_masuk_detail: number;
  nama_bahan: string;
  id_satuan: number;
  nama_satuan: string;
  qty: number;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface HistoryBahanKeluarDetailFindOneByIDResponse
  extends HistoryBahanKeluarFindOneResponse {
  detail: HistoryBahanKeluarDetailData[];
}

export interface HistoryBahanKeluarFindAllResponseData
  extends HistoryBahanKeluarFindOneResponse {}

export interface HistoryBahanKeluarFindAllResponse {
  page: number;
  per_page: number;
  data: HistoryBahanKeluarFindAllResponseData[];
  total_page: number;
}

export interface LaporanStokBahanKeluarResponseData {
  tgl_bahan_keluar: string;
  id_bahan: number;
  nama_bahan: string;
  qty: number;
  nama_satuan: string;
  nama_customer: string;
  nama_karyawan: string;
}

export interface LaporanStokBahanKeluarResponse {
  data: LaporanStokBahanKeluarResponseData[];
}
