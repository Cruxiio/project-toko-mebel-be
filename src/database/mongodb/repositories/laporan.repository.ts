import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProyekProdukRepository } from './proyek_produk.repository';
import { ProdukRepository } from './produk.repository';
import { ProdukJasaRepository } from './produkJasa.repository';
import { ProyekRepository } from './proyek.repository';
import { HistoryBahanKeluarRepository } from './historyBahanKeluar.repository';
import { HistoryBahanMasukRepository } from './historyBahanMasuk.repository';
import { NotaRepository } from './nota.repository';
import { CreateLaporanHPPDto } from 'src/laporan/dto/create-laporan.dto';
import { Types } from 'mongoose';

@Injectable()
export class LaporanRepository {
  constructor(
    private readonly proyekProdukRepo: ProyekProdukRepository,
    private readonly produkRepo: ProdukRepository,
    private readonly produkJasaRepo: ProdukJasaRepository,
    private readonly proyekRepo: ProyekRepository,
    private readonly historyBahanKeluarRepo: HistoryBahanKeluarRepository,
    private readonly historyBahanMasukRepo: HistoryBahanMasukRepository,
    private readonly notaRepo: NotaRepository,
  ) {}

  async laporanHPPKayu(filterLaporanHppKayu: CreateLaporanHPPDto) {
    // cari data proyek produk by id proyek produk
    const proyekProdukData = await this.proyekProdukRepo.findOne(
      { id: filterLaporanHppKayu.id_proyek_produk, deleted_at: null },
      {
        main: {},
        field1: '',
        field2: 'id',
        field3: '',
        nestedField3: '',
      },
    );

    if (!proyekProdukData) {
      throw new NotFoundException('ID Proyek Produk tidak ditemukan');
    }

    // cari data produk by id produk
    const produkData = await this.produkRepo.findOneProduk(
      {
        id: proyekProdukData ? proyekProdukData.id_produk.id : 0,
        deleted_at: null,
      },
      {
        main: {},
        field1: 'id nama',
        field2: 'id nama konversi satuan_terkecil',
      },
    );

    // buat map untuk data produk
    let produkMap = new Map();
    produkData.detail.map((d) => {
      if (!produkMap.has(`${d.id_bahan.id}`)) {
        produkMap.set(`${d.id_bahan.id}`, {
          id_bahan: d.id_bahan.id,
          nama_bahan: d.id_bahan.nama,
          id_satuan: d.id_satuan.id,
          nama_satuan: d.id_satuan.nama,
          satuan_terkecil: d.id_satuan.satuan_terkecil,
          konversi: d.id_satuan.konversi,
          qty: d.qty,
          qty_pakai: d.qty * d.id_satuan.konversi, // ini buat yang nanti dikurangi
          keterangan: d.keterangan,
        });
      } else {
        console.log('ERROR: Duplicate id_bahan in produk detail');
        throw new BadRequestException('Duplicate id_bahan in produk detail');
      }
    });

    // cari data produkJasa by id produk
    const produkJasaData = await this.produkJasaRepo.findAll(
      {
        id_produk: produkData ? produkData._id : null,
        deleted_at: null,
      },
      {
        main: {},
        field1: '',
        field2: 'id nama',
      },
    );

    // cari data history bahan keluar by id proyek produk
    const historyBahanKeluarData = await this.historyBahanKeluarRepo.findAll(
      {
        id_proyek_produk: proyekProdukData ? proyekProdukData._id : null,
        deleted_at: null,
      },
      {
        main: {},
        field1: '',
        nestedField1: '',
        nestedField2: '',
        field2: '',
      },
    );

    const historyBahanKeluarIds = historyBahanKeluarData.map((h) => h._id);

    // cari data history bahan keluar detail by id history bahan keluar
    const historyBahanKeluarDetailData =
      await this.historyBahanKeluarRepo.findAllDetail(
        {
          id_history_bahan_keluar: { $in: historyBahanKeluarIds },
          deleted_at: null,
        },
        {
          main: {},
          field1: '',
          nestedField1: '',
          nestedField2: '',
          field2: 'id',
          nestedField3: 'id nama',
          nestedFiedl4: 'id nama konversi satuan_terkecil',
          nestedField5: '_id id',
          field3: 'id nama konversi satuan_terkecil',
        },
      );

    //   reduce history bahan keluar detail data
    const dataRealisasiTanpaHarga = historyBahanKeluarDetailData.reduce(
      (map, curr) => {
        let id_history_bahan_masuk =
          curr.id_history_bahan_masuk_detail.id_history_bahan_masuk.id;
        let id_bahan = curr.id_history_bahan_masuk_detail.id_bahan.id;
        let id_satuan = curr.id_satuan.id;
        let konversi_stok =
          curr.id_history_bahan_masuk_detail.id_satuan.konversi;

        if (!map.has(`${id_history_bahan_masuk}_${id_bahan}`)) {
          // jika index belum ada maka tambahkan ke map
          map.set(`${id_history_bahan_masuk}_${id_bahan}`, {
            id_history_bahan_masuk: id_history_bahan_masuk,
            id_bahan: id_bahan,
            nama_bahan: curr.id_history_bahan_masuk_detail.id_bahan.nama,
            id_satuan: id_satuan,
            satuan_terkecil: curr.id_satuan.satuan_terkecil,
            konversi_stok: konversi_stok,
            qty: curr.qty * curr.id_satuan.konversi,
          });
        } else {
          let temp = map.get(`${id_history_bahan_masuk}_${id_bahan}`);
          temp.qty += curr.qty * curr.id_satuan.konversi;
          map.set(`${id_history_bahan_masuk}_${id_bahan}`, temp);
        }

        return map;
      },
      new Map(),
    );
    console.log(dataRealisasiTanpaHarga);

    const historyBahanMasukIds = historyBahanKeluarDetailData.map(
      (hd) => hd.id_history_bahan_masuk_detail.id_history_bahan_masuk._id,
    );

    // console.log('historyBahanMasukIds', historyBahanMasukIds);

    // buat unique id history bahan masuk
    const uniqueHistoryBahanMasukIds = [...new Set(historyBahanMasukIds)];

    console.log('uniqueHistoryBahanMasukIds', uniqueHistoryBahanMasukIds);

    // cari data nota by id history bahan masuk
    const notaDataAndDetails = await this.notaRepo.findAllNotaAndNotaDetail(
      {
        id_history_bahan_masuk: { $in: uniqueHistoryBahanMasukIds },
        deleted_at: null,
      },
      {
        main: {},
        field1: '_id id',
        nestedField1: '',
        field2: 'id nama',
        field3: 'id nama konversi satuan_terkecil',
      },
    );

    // buat map untuk urutkan data nota berdasarkan harga satuan terendah / tertinggi dari id bahan
    const notaMap = new Map();
    notaDataAndDetails.forEach((nota) => {
      nota.detail.forEach((d) => {
        if (!notaMap.has(d.id_bahan.id)) {
          // jika belum ada maka tambahkan ke map
          notaMap.set(d.id_bahan.id, d);
        } else if (notaMap.get(d.id_bahan.id).harga_satuan > d.harga_satuan) {
          //  klo sudah ada dan harga satuan lebih murah maka ganti dgn yang baru
          notaMap.set(d.id_bahan.id, d);
        }
      });
    });

    // console.log('notaDataAndDetails', notaDataAndDetails);

    // cek apakah jumlah data nota dan unique history bahan masuk
    if (notaDataAndDetails.length !== uniqueHistoryBahanMasukIds.length) {
      // ubah array of object jadi array of string supaya bisa pakai includes
      let foundHistoryBahanMasukIds = notaDataAndDetails.map((uh) =>
        uh.id_history_bahan_masuk._id.toString(),
      );

      //  cari _id history bahan masuk yang tidak ada di notaDataAndDetails
      const notFound_id = uniqueHistoryBahanMasukIds.filter(
        (id) => !foundHistoryBahanMasukIds.includes(id.toString()),
      );

      // cari data history bahan masuk yang tidak ada di notaDataAndDetails
      const data = await this.historyBahanMasukRepo.findOne({
        _id: notFound_id[0],
        deleted_at: null,
      });

      throw new BadRequestException(
        `Data Nota dengan kode nota ${data.kode_nota} belum dimasukkan`,
      );
    }

    let detailLaporanHPPKayu: HPPKayuDetailItem[] = [];
    // buat array data HPPKayuDetailItem
    for (let i = 0; i < notaDataAndDetails.length; i++) {
      const nota = notaDataAndDetails[i];

      for (let j = 0; j < nota.detail.length; j++) {
        const d = nota.detail[j];
        let rencana_bahan = produkMap.get(`${d.id_bahan.id}`);
        let dataRealisasi = dataRealisasiTanpaHarga.get(
          `${nota.id_history_bahan_masuk.id}_${d.id_bahan.id}`,
        );
        let konversiNota = d.id_satuan.konversi;

        // kurangi qty_pakai produk sebanyak qty nota
        rencana_bahan.qty_pakai -= d.qty * d.id_satuan.konversi;

        if (rencana_bahan.qty_pakai < 0) {
          rencana_bahan.qty_pakai = -1;
        }

        // save qty pakai kembali ke produkMap
        produkMap.set(`${d.id_bahan.id}`, rencana_bahan);

        // format data
        const formattedData: HPPKayuDetailItem = {
          id_bahan: d.id_bahan.id,
          nama_bahan: d.id_bahan.nama,
          qty: rencana_bahan.qty_pakai >= 0 ? d.qty : 0, // qty nota
          nama_satuan: d.id_satuan.nama,
          keterangan: rencana_bahan.keterangan,
          harga_satuan: d.harga_satuan,
          total_harga:
            rencana_bahan.qty_pakai >= 0 ? d.qty * d.harga_satuan : 0,
          qty_realisasi: dataRealisasi ? dataRealisasi.qty / konversiNota : 0,
          harga_satuan_realisasi: d.harga_satuan,
          total_harga_realisasi: dataRealisasi
            ? (dataRealisasi.qty / konversiNota) * d.harga_satuan
            : 0,
        };

        detailLaporanHPPKayu.push(formattedData);
      }
    }

    // cari qty_pakai dari produkMap yang masih lebih dari 0
    // ini buat klo jumlah bahan di produk detail > jumlah bahan di nota pembelian akibat ada sisa bahan
    notaMap.forEach((value, key) => {
      const rencanaBahanData = produkMap.get(`${key}`);
      if (rencanaBahanData.qty_pakai > 0) {
        const formattedData: HPPKayuDetailItem = {
          id_bahan: rencanaBahanData.id_bahan,
          nama_bahan: rencanaBahanData.nama_bahan,
          qty: rencanaBahanData.qty_pakai / value.konversi,
          nama_satuan: value.id_satuan.nama,
          keterangan: rencanaBahanData.keterangan,
          harga_satuan: value.harga_satuan,
          total_harga:
            (rencanaBahanData.qty_pakai / value.konversi) * value.harga_satuan,
          qty_realisasi: rencanaBahanData.qty_pakai / value.konversi,
          harga_satuan_realisasi: value.harga_satuan,
          total_harga_realisasi:
            (rencanaBahanData.qty_pakai / value.konversi) * value.harga_satuan,
        };

        detailLaporanHPPKayu.push(formattedData);
      }
    });

    // buat detail laporan kayu untuk jasa
    for (let i = 0; i < produkJasaData.length; i++) {
      const data = produkJasaData[i];

      const formattedData: HPPKayuDetailItem = {
        id_bahan: 0, // buat tandai klo itu id jasa
        nama_bahan: data.nama,
        qty: data.qty,
        nama_satuan: data.id_satuan.nama,
        keterangan: data.keterangan,
        harga_satuan: data.harga_satuan,
        total_harga: data.qty * data.harga_satuan,
        qty_realisasi: data.qty,
        harga_satuan_realisasi: data.harga_satuan,
        total_harga_realisasi: data.qty * data.harga_satuan,
      };

      detailLaporanHPPKayu.push(formattedData);
    }

    // reduce detail laporan hpp kayu
    // supaya kalau ada id bahan yang kembar dan harga satuan sama digabungkan
    const reducedDetailLaporanHPPKayu = detailLaporanHPPKayu.reduce(
      (map, curr) => {
        let key = `${curr.id_bahan}_${curr.harga_satuan}`;
        if (!map.has(key)) {
          map.set(key, curr);
        } else {
          let temp = map.get(key);
          temp.qty_realisasi += curr.qty_realisasi;
          temp.total_harga_realisasi += curr.total_harga_realisasi;
          map.set(key, temp);
        }

        return map;
      },
      new Map(),
    );

    let result = [...reducedDetailLaporanHPPKayu.values()];

    console.log('detailLaporanHPPKayu', result);

    return result;
  }
}
