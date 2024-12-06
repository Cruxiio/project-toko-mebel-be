export interface BahanFindOneResponse {
  // NOTE: field id optional karena dipakai buat response update juga
  id?: number;
  nama: string;
  created_at?: Date;
  updated_at?: Date | null; // NULLABLE FIELD
  deleted_at?: Date | null; // NULLABLE FIELD
}

export interface BahanFindAllResponseData {
  id: number;
  nama: string;
  created_at?: Date;
  updated_at?: Date | null; // NULLABLE FIELD
  deleted_at?: Date | null; // NULLABLE FIELD
}

export interface BahanFindAllResponse {
  page: number;
  per_page: number;
  data: BahanFindAllResponseData[];
  total_page: number;
}

export interface BahanDeleteResponse {
  message: string;
}
