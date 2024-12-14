// KaryawanFindOneResponse is used by HandleCreateKaryawan, HandleFindOneKaryawan, HandleFindAllKaryawan, and HandleUpdateKaryawan in KaryawanService
export interface KaryawanFindOneResponse {
  id?: number;
  nama: string;
  role: string;
  created_at?: Date;
  updated_at?: Date | null; // NULLABLE FIELD
  deleted_at?: Date | null; // NULLABLE FIELD
}

export interface KaryawanFindAllResponse {
  page: number;
  per_page: number;
  data: KaryawanFindOneResponse[];
  total_page: number;
}

export interface KaryawanDeleteResponse {
  message: string;
}
