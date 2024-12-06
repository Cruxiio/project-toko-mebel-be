export interface MasterSupplierFindAllResponseData {
  id: number;
  nama: string;
}

export interface MasterSupplierFindAllResponse {
  page: number;
  per_page: number;
  data: MasterSupplierFindAllResponseData[];
  total_page: number;
}

export interface MasterCustomerFindAllResponseData {
  id: number;
  nama: string;
}

export interface MasterCustomerFindAllResponse {
  page: number;
  per_page: number;
  data: MasterCustomerFindAllResponseData[];
  total_page: number;
}

export interface MasterSatuanFindAllResponseData {
  id: number;
  nama: string;
}

export interface MasterSatuanFindAllResponse {
  page: number;
  per_page: number;
  data: MasterSatuanFindAllResponseData[];
  total_page: number;
}
