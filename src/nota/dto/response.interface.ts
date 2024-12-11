import { Types } from 'mongoose';

// NotaFindOneResponse digunakan untuk response create update dan find one
export interface NotaFindOneResponse {
  id?: number;
  kode_nota: string;
  id_supplier: number;
  tgl_nota: Date;
  total_pajak: number;
  diskon_akhir: number;
  total_harga: number;
  created_at?: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
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
