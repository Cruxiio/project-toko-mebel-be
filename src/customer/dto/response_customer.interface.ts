// CustomerFindOneResponse is used by HandleCreateCustomer, HandleFindOneCustomer, and HandleUpdateCustomer in CustomerService
export interface CustomerFindOneResponse {
  // NOTE: field id optional karena dipakai buat response update juga
  id?: number;
  nama: string;
  no_telepon: string;
  alamat: string;
  created_at?: Date;
  updated_at?: Date | null; // NULLABLE FIELD
  deleted_at?: Date | null; // NULLABLE FIELD
}

export interface CustomerFindAllResponseData {
  id: number;
  nama: string;
  no_telepon: string;
  alamat: string;
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
