// CustomerFindOneResponse is used by HandleCreateCustomer, HandleFindOneCustomer, and HandleUpdateCustomer in CustomerService
export interface CustomerFindOneResponse {
  // NOTE: field id optional karena dipakai buat response update juga
  id?: number;
  nama: string;
  no_rekening: string | null; // NULLABLE FIELD
  nama_bank: string | null; // NULLABLE FIELD
  no_telepon: string | null; // NULLABLE FIELD
  alamat: string | null; // NULLABLE FIELD
  created_at?: Date;
  updated_at?: Date | null; // NULLABLE FIELD
  deleted_at?: Date | null; // NULLABLE FIELD
}

export interface CustomerFindAllResponseData {
  id: number;
  nama: string;
  no_rekening: string | null; // NULLABLE FIELD
  nama_bank: string | null; // NULLABLE FIELD
  no_telepon: string | null; // NULLABLE FIELD
  alamat: string | null; // NULLABLE FIELD
  created_at?: Date;
  updated_at?: Date | null; // NULLABLE FIELD
  deleted_at?: Date | null; // NULLABLE FIELD
}

export interface CustomerFindAllResponse {
  page: number;
  per_page: number;
  data: CustomerFindAllResponseData[];
  total_page: number;
}

export interface CustomerDeleteResponse {
  message: string;
}
