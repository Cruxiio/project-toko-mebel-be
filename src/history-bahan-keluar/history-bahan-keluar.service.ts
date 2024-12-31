import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateHistoryBahanKeluarDto,
  UpdateHistoryBahanKeluarDto,
} from './dto/create-history-bahan-keluar.dto';
import { ProyekProdukRepository } from 'src/database/mongodb/repositories/proyek_produk.repository';
import { KaryawanRepository } from 'src/database/mongodb/repositories/karyawan.repository';
import { HistoryBahanKeluarRepository } from 'src/database/mongodb/repositories/historyBahanKeluar.repository';
import {
  HistoryBahanKeluarFindOneResponse,
  HistoryKeluarDtoDatabaseInput,
} from './dto/response.interface';
import { Types } from 'mongoose';

@Injectable()
export class HistoryBahanKeluarService {
  constructor(
    private readonly proyekProdukRepository: ProyekProdukRepository,
    private readonly karyawanRepository: KaryawanRepository,
    private readonly historyBahanKeluarRepository: HistoryBahanKeluarRepository,
  ) {}
  async HandleCreateHistoryBahanKeluar(
    createHistoryBahanKeluarDto: CreateHistoryBahanKeluarDto,
  ) {
    // validate id_proyek_produk
    const proyekProdukData = await this.proyekProdukRepository.findOne(
      {
        id: createHistoryBahanKeluarDto.id_proyek_produk,
        deleted_at: null,
      },
      {
        main: {},
        field1: 'id nama',
        field2: 'id nama',
        field3: 'id',
        nestedField3: 'id nama',
      },
    );

    if (!proyekProdukData) {
      throw new NotFoundException('Proyek produk not found');
    }

    // validate id_karyawan
    const karyawanData = await this.karyawanRepository.findOne({
      id: createHistoryBahanKeluarDto.id_karyawan,
      deleted_at: null,
    });

    if (!karyawanData) {
      throw new NotFoundException('Karyawan not found');
    }

    // validate detail
    const detailInputDatabase =
      await this.historyBahanKeluarRepository.validateDetailArray(
        createHistoryBahanKeluarDto.detail,
      );

    const historyBahanKeluarInputDatabase: HistoryKeluarDtoDatabaseInput = {
      id_proyek_produk: proyekProdukData._id as Types.ObjectId,
      id_karyawan: karyawanData._id as Types.ObjectId,
      detail: detailInputDatabase,
    };

    // create ke database
    const newHistoryBahanKeluarData =
      await this.historyBahanKeluarRepository.create(
        historyBahanKeluarInputDatabase,
      );

    // update stok bahan
    const updatedStokBahan =
      await this.historyBahanKeluarRepository.updateStokBahanMasukDetail(
        createHistoryBahanKeluarDto.detail,
      );

    // buat response
    const res: HistoryBahanKeluarFindOneResponse = {
      id: newHistoryBahanKeluarData.id,
      id_proyek_produk: proyekProdukData.id,
      nama_produk: proyekProdukData.id_produk.nama,
      nama_proyek: proyekProdukData.id_proyek.nama,
      id_karyawan: karyawanData.id,
      nama_karyawan: karyawanData.nama,
      created_at: newHistoryBahanKeluarData.created_at,
      updated_at: newHistoryBahanKeluarData.updated_at,
      deleted_at: newHistoryBahanKeluarData.deleted_at,
    };

    return res;
  }

  findAll() {
    return `This action returns all historyBahanKeluar`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historyBahanKeluar`;
  }

  update(id: number, updateHistoryBahanKeluarDto: UpdateHistoryBahanKeluarDto) {
    return `This action updates a #${id} historyBahanKeluar`;
  }

  remove(id: number) {
    return `This action removes a #${id} historyBahanKeluar`;
  }
}
