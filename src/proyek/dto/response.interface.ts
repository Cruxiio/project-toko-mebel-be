import { Types } from 'mongoose';

// digunakan untuk input create dan update serta delete
export interface ProyekDtoDatabaseInput {
  id_customer?: Types.ObjectId;
  nama?: string;
  start?: Date;
  deadline?: Date;
  alamat_pengiriman?: string;
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
