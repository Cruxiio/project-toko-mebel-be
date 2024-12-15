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

export interface MasterBahanFindAllResponseData {
  id: number;
  nama: string;
}

export interface MasterBahanFindAllResponse {
  page: number;
  per_page: number;
  data: MasterBahanFindAllResponseData[];
  total_page: number;
}

export interface MasterHistoryBahanMasukFindAllResponseData {
  id: number;
  kode_nota: string;
}

export interface MasterHistoryBahanMasukFindAllResponse {
  page: number;
  per_page: number;
  data: MasterHistoryBahanMasukFindAllResponseData[];
  total_page: number;
}

export interface MasterKaryawanFindAllResponseData {
  id: number;
  nama: string;
}

export interface MasterKaryawanFindAllResponse {
  page: number;
  per_page: number;
  data: MasterKaryawanFindAllResponseData[];
  total_page: number;
}
