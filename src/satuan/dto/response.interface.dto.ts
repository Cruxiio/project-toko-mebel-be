// SatuanFindOneResponse is used by HandleCreateSatuan, HandleFindOneSatuan, and HandleUpdateSatuan in SatuanService
export interface SatuanFindOneResponse {
  // NOTE: field id optional karena dipakai buat response update juga
  id?: number;
  nama: string;
  satuan_terkecil: string;
  konversi: number;
  created_at?: Date;
  updated_at?: Date | null; // NULLABLE FIELD
  deleted_at?: Date | null; // NULLABLE FIELD
}

export interface SatuanFindAllResponseData {
  id: number;
  nama: string;
  satuan_terkecil: string;
  konversi: number;
  created_at?: Date;
  updated_at?: Date | null; // NULLABLE FIELD
  deleted_at?: Date | null; // NULLABLE FIELD
}

export interface SatuanFindAllResponse {
  page: number;
  per_page: number;
  data: SatuanFindAllResponseData[];
  total_page: number;
}

export interface SatuanDeleteResponse {
  message: string;
}
