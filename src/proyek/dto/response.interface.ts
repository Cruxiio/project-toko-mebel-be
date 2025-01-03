import { Types } from 'mongoose';

// digunakan untuk input create dan update serta delete
export interface ProyekDtoDatabaseInput {
  id_customer?: Types.ObjectId;
  nama?: string;
  start?: Date;
  deadline?: Date;
  alamat_pengiriman?: string;
  status?: boolean;
  deleted_at?: Date | null;
}

// digunakan untuk response create, update, find one, dan find all
export interface ProyekFindOneResponse {
  id?: number; // dipake buat update makanya optional
  id_customer: number;
  nama_customer?: string; // dipake buat create makanya optional
  nama: string;
  start: Date;
  deadline: Date;
  alamat_pengiriman: string;
  status: boolean;
  created_at?: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}

export interface ProyekFindAllResponse {
  page: number;
  per_page: number;
  data: ProyekFindOneResponse[];
  total_page: number;
}

export interface ProyekDeleteResponse {
  message: string;
}

// buat interface proyek produk
// digunakan untuk input create dan update serta delete
export interface TeamDtoDatabaseInput {
  anggota?: Types.ObjectId[];
  deleted_at?: Date | null;
}

export interface ProyekProdukDtoDatabaseInput {
  id_proyek?: Types.ObjectId;
  id_produk?: Types.ObjectId;
  id_team?: Types.ObjectId;
  qty?: number;
  tipe?: string;
  status?: boolean;
  deleted_at?: Date | null;
}

// dipake buat response create update find all
export interface ProyekProdukFindAllResponseData {
  id?: number; // dipake buat update makanya optional
  id_proyek: number;
  nama_proyek: string;
  id_produk: number;
  nama_produk: string;
  id_team: number;
  nama_penanggung_jawab: string;
  nama_karyawan1: string;
  nama_karyawan2: string;
  qty: number;
  tipe: string;
  status: boolean;
  created_at?: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}

export interface ProyekProdukFindAllResponse {
  page: number;
  per_page: number;
  data: ProyekProdukFindAllResponseData[];
  total_page: number;
}
