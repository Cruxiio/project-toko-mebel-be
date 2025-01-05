interface HPPDetailItem {
  id_bahan: number;
  nama_bahan: string;
  qty: number;
  nama_satuan: string;
  keterangan: string;
  harga_satuan: number;
  total_harga: number;
}

interface HPPKayuDetailItem extends HPPDetailItem {
  qty_realisasi: number;
  harga_satuan_realisasi: number;
  total_harga_realisasi: number;
}

interface HPPReportData {
  jenis_proyek: string;
  sj_no: string;
  acc: string;
  marketing: string;
  nama_customer: string;
  tipe_proyek: string;
  alamat_pengiriman: string;
  produk: string;
  start_date: string;
  deadline_date: string;
  nama_penanggung_jawab: string;
  total_bahan: number;
  harian: number;
  borongan: number;
  grand_total: number;
}

// HPP kayu report data
interface HPPKayuReportData extends HPPReportData {
  detail: HPPKayuDetailItem[];
}

// HPP resin dan finishing report data
interface HPPAllReportData extends HPPReportData {
  detail: HPPDetailItem[];
}
