// SupplierFindOneResponse is used by HandleCreateSupplier, HandleFindOneSupplier, and HandleUpdateSupplier in SupplierService
export interface SupplierFindOneResponse {
  // NOTE: field id optional karena dipakai buat response update juga
  id?: number;
  nama: string;
  no_rekening: string;
  nama_bank: string;
  no_telepon: string | null; // NULLABLE FIELD
  alamat: string | null; // NULLABLE FIELD
  created_at?: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}

export interface SupplierFindAllResponseData {
  id: number;
  nama: string;
  no_rekening: string;
  nama_bank: string;
  no_telepon: string | null; // NULLABLE FIELD
  alamat: string | null; // NULLABLE FIELD
  created_at?: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}

export interface SupplierFindAllResponse {
  page: number;
  per_page: number;
  data: SupplierFindAllResponseData[];
  total_page: number;
}

export interface SupplierDeleteResponse {
  message: string;
}
