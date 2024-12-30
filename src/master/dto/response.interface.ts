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
  data: MasterSatuanFindAllResponseData[];
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
  data: MasterKaryawanFindAllResponseData[];
}

export interface MasterStokFindAllResponseData {
  id: number;
  nama: string;
  tgl_stok: Date;
}

export interface MasterStokFindAllResponse {
  data: MasterStokFindAllResponseData[];
}

export interface MasterProyekFindAllResponseData {
  id: number;
  nama: string;
}

export interface MasterProyekFindAllResponse {
  data: MasterProyekFindAllResponseData[];
}

export interface MasterProyekProdukFindAllResponseData {
  id: number;
  nama: string;
  tipe: string;
}

export interface MasterProyekProdukFindAllResponse {
  data: MasterProyekProdukFindAllResponseData[];
}
