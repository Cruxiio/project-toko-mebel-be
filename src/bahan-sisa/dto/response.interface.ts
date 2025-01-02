import { Types } from 'mongoose';

export interface FindOneBahanSisaResponse {
  id: number;
  id_history_bahan_keluar_detail: number;
  nama_proyek: string;
  nama_bahan: string;
  id_satuan: number;
  nama_satuan: string;
  qty: number;
  keterangan: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface FindAllBahanSisaResponseData
  extends FindOneBahanSisaResponse {}

export interface FindAllBahanSisaResponse {
  page: number;
  per_page: number;
  data: FindAllBahanSisaResponseData[];
  total_page: number;
}

export interface BahanSisaInputDatabaseDto {
  id_history_bahan_keluar_detail: Types.ObjectId;
  id_satuan: Types.ObjectId;
  qty: number;
  keterangan: string;
}
