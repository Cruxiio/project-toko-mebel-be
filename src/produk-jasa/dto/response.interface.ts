import { Types } from 'mongoose';

export interface ProdukJasaInputDatabaseDto {
  id_produk: Types.ObjectId;
  id_satuan: Types.ObjectId;
  nama: string;
  qty: number;
  harga_satuan: number;
  subtotal: number;
  keterangan?: string;
}

export interface ProdukJasaFindOneResponse {
  id: number;
  id_produk: number;
  nama_produk: string;
  id_satuan: number;
  nama_satuan: string;
  nama: string;
  qty: number;
  harga_satuan: number;
  subtotal: number;
  keterangan?: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface ProdukJasaFindAllResponseData
  extends ProdukJasaFindOneResponse {}

export interface ProdukJasaFindAllResponse {
  page: number;
  per_page: number;
  data: ProdukJasaFindAllResponseData[];
  total_page: number;
}

export interface ProdukJasaDeleteResponse {
  message: string;
}
