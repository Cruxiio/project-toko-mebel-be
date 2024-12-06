// HistoryBahanMasukFindOneResponse digunakan untuk response create update dan find one
export interface HistoryBahanMasukFindOneResponse {
  id?: number;
  kode_nota: string;
  id_supplier: number;
  tgl_nota: Date;
  no_spb: number;
  created_at?: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}
