import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLaporanHPPDto } from './dto/create-laporan.dto';
import { LaporanRepository } from 'src/database/mongodb/repositories/laporan.repository';
import { ProyekProdukRepository } from 'src/database/mongodb/repositories/proyek_produk.repository';
import { ProyekRepository } from 'src/database/mongodb/repositories/proyek.repository';
import { HelperService } from 'src/helper/helper.service';

@Injectable()
export class LaporanService {
  constructor(
    private readonly laporanRepository: LaporanRepository,
    private readonly proyekProdukRepo: ProyekProdukRepository,
    private readonly proyekRepo: ProyekRepository,
    private readonly helperService: HelperService,
  ) {}
  async laporanHPPKayu(createLaporanDto: CreateLaporanHPPDto) {
    // cari data proyek produk by id proyek produk
    const proyekProdukData = await this.proyekProdukRepo.findOne(
      { id: createLaporanDto.id_proyek_produk, deleted_at: null },
      {
        main: {},
        field1: 'id',
        field2: 'id nama',
        field3: '',
        nestedField3: '',
      },
    );

    if (!proyekProdukData) {
      throw new NotFoundException('ID Proyek Produk tidak ditemukan');
    }

    // cari data proyek by id proyek produk
    const proyekData = await this.proyekRepo.findOne(
      { id: proyekProdukData.id_proyek.id, deleted_at: null },
      {
        main: {},
        field1: 'id nama',
      },
    );

    // cari detail laporan HPP Kayu + validate
    const detailLaporanHppKayu =
      await this.laporanRepository.laporanHPPKayu(createLaporanDto);

    let totalBahan = detailLaporanHppKayu.reduce(
      (acc, curr) => acc + curr.total_harga_realisasi,
      0,
    );

    // buat response
    const res: HPPKayuReportData = {
      jenis_proyek: createLaporanDto.jenis_proyek,
      sj_no: createLaporanDto.sj_no,
      acc: createLaporanDto.acc,
      marketing: createLaporanDto.marketing,
      nama_customer: proyekData.id_customer.nama,
      tipe_proyek: proyekProdukData.tipe,
      alamat_pengiriman: proyekData.alamat_pengiriman,
      produk: proyekProdukData.id_produk.nama,
      start_date: this.helperService.formatDatetoString(proyekData.start),
      deadline_date: this.helperService.formatDatetoString(proyekData.deadline),
      nama_penanggung_jawab: createLaporanDto.nama_penanggung_jawab,
      total_bahan: totalBahan,
      harian: createLaporanDto.total_harian,
      borongan: createLaporanDto.total_borongan,
      grand_total:
        createLaporanDto.total_harian +
        createLaporanDto.total_borongan +
        totalBahan,
      detail: detailLaporanHppKayu,
    };

    return res;
  }

  findAll() {
    return `This action returns all laporan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} laporan`;
  }

  remove(id: number) {
    return `This action removes a #${id} laporan`;
  }
}
