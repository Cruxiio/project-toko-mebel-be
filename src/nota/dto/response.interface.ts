import exp from 'constants';
import { Types } from 'mongoose';

export interface NotaDetailArrayData {
  id_bahan: number;
  nama_bahan: string;
  id_satuan: number;
  nama_satuan: string;
  qty: number;
  harga_satuan: number;
  diskon: number;
  subtotal: number;
}

// NotaFindOneResponse digunakan untuk response create dan find all
// NOTE: karena isinya bakal mirip sama FindAllNotaResponseData jadi pakai ini aja
export interface NotaFindOneResponse {
  id?: number;
  kode_nota: string;
  id_supplier: number;
  nama_suplier?: string;
  tgl_nota: Date;
  total_pajak: number;
  diskon_akhir: number;
  total_harga: number;
  created_at?: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}

export interface NotaFindAllResponseData extends NotaFindOneResponse {
  nama_bank?: string;
  no_rekening?: string;
}

export interface NotaFindAllResponse {
  page: number;
  per_page: number;
  data: NotaFindAllResponseData[];
  total_page: number;
}

//
export interface NotaFindOneFullDataResponse extends NotaFindOneResponse {
  detail: NotaDetailArrayData[];
}

export interface NotaDetailDatabaseInput {
  id_bahan: Types.ObjectId;

  id_satuan: Types.ObjectId;

  qty: number;

  harga_satuan: number;

  diskon: number;

  subtotal: number;
}

export class NotaDtoDatabaseInput {
  id_history_bahan_masuk: Types.ObjectId;

  total_pajak: number;

  diskon_akhir: number;

  total_harga: number;

  detail: NotaDetailDatabaseInput[];
}
