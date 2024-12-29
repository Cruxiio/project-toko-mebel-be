import { Types } from 'mongoose';

// digunakan di produk find one response
export interface ProdukDetailArrayData {
  id_bahan: number;

  nama_bahan: string;

  id_satuan: number;

  nama_satuan: string;

  qty: number;

  qtyPakai: number;

  keterangan: string;
}

export interface ProdukFindAllResponse {
  id?: number;

  nama: string;

  created_at?: Date;

  updated_at?: Date | null;

  deleted_at?: Date | null;
}

export interface ProdukFindOneResponse extends ProdukFindAllResponse {
  detail: ProdukDetailArrayData[];
}

export interface ProdukDetailDatabaseInput {
  id_bahan: Types.ObjectId;

  id_satuan: Types.ObjectId;

  qty: number;

  qtyPakai: number;

  keterangan: string;
}

// ini dipake buat update dan delete
export class ProdukDtoDatabaseInput {
  nama?: string;

  detail?: ProdukDetailDatabaseInput[];

  deleted_at?: Date;
}

export interface ProdukDeleteResponse {
  message: string;
}
