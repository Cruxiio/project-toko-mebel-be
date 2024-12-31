import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateHistoryBahanKeluarDto,
  FindAllHistoryBahanKeluarDto,
  UpdateHistoryBahanKeluarDto,
} from './dto/create-history-bahan-keluar.dto';
import { ProyekProdukRepository } from 'src/database/mongodb/repositories/proyek_produk.repository';
import { KaryawanRepository } from 'src/database/mongodb/repositories/karyawan.repository';
import { HistoryBahanKeluarRepository } from 'src/database/mongodb/repositories/historyBahanKeluar.repository';
import {
  HistoryBahanKeluarDetailData,
  HistoryBahanKeluarDetailFindOneByIDResponse,
  HistoryBahanKeluarFindAllResponse,
  HistoryBahanKeluarFindAllResponseData,
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
  async handleCreateHistoryBahanKeluar(
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

  async handleFindAllHistoryBahanKeluar(
    requestFilter: FindAllHistoryBahanKeluarDto,
  ) {
    // list history bahan keluar data
    const listHistoryBahanKeluarData =
      await this.historyBahanKeluarRepository.findAllPagination(
        {
          id_proyek_produk: requestFilter.id_proyek_produk,
          id_karyawan: requestFilter.id_karyawan,
        },
        { page: requestFilter.page, per_page: requestFilter.per_page },
        {
          main: {},
          field1: 'id',
          nestedField1: 'id nama',
          nestedField2: 'id nama',
          field2: 'id nama',
        },
      );

    // dapatkan total seluruh data berdasarkan hasil filter
    const totalListDataProyek =
      await this.historyBahanKeluarRepository.countAll({
        id_proyek_produk: requestFilter.id_proyek_produk,
        id_karyawan: requestFilter.id_karyawan,
      });

    // hitung total page
    const total_page: number = Math.ceil(
      totalListDataProyek / requestFilter.per_page,
    );

    // buat response
    const res: HistoryBahanKeluarFindAllResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: listHistoryBahanKeluarData.map((h) => {
        const formattedData: HistoryBahanKeluarFindAllResponseData = {
          id: h.id,
          id_proyek_produk: h.id_proyek_produk.id,
          nama_produk: h.id_proyek_produk.id_produk.nama,
          nama_proyek: h.id_proyek_produk.id_proyek.nama,
          id_karyawan: h.id_karyawan.id,
          nama_karyawan: h.id_karyawan.nama,
          created_at: h.created_at,
          updated_at: h.updated_at,
          deleted_at: h.deleted_at,
        };
        return formattedData;
      }),
      total_page: total_page,
    };

    return res;
  }

  async handleFindOneHistoryBahanKeluar(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // find History Bahan Masuk by id
    const historyBahanKeluarData =
      await this.historyBahanKeluarRepository.findOne(
        {
          id,
          deleted_at: null,
        },
        {
          main: {},
          field1: 'id',
          nestedField1: 'id nama',
          nestedField2: 'id nama',
          field2: 'id nama',
        },
      );

    if (!historyBahanKeluarData) {
      throw new NotFoundException('History Bahan Keluar not found');
    }

    const detailData =
      await this.historyBahanKeluarRepository.findOneByHistoryBahanKeluarByID(
        {
          id: historyBahanKeluarData.id,
          deleted_at: null,
        },
        {
          main: {},
          field1: 'id',
          nestedField1: 'id nama',
          field2: 'id nama',
        },
      );

    // buat response
    const res: HistoryBahanKeluarDetailFindOneByIDResponse = {
      id: historyBahanKeluarData.id,
      id_proyek_produk: historyBahanKeluarData.id_proyek_produk.id,
      nama_produk: historyBahanKeluarData.id_proyek_produk.id_produk.nama,
      nama_proyek: historyBahanKeluarData.id_proyek_produk.id_proyek.nama,
      id_karyawan: historyBahanKeluarData.id_karyawan.id,
      nama_karyawan: historyBahanKeluarData.id_karyawan.nama,
      detail: detailData.map((d) => {
        const formattedData: HistoryBahanKeluarDetailData = {
          id: d.id,
          id_history_bahan_masuk_detail: d.id_history_bahan_masuk_detail.id,
          nama_bahan: d.id_history_bahan_masuk_detail.id_bahan.nama,
          id_satuan: d.id_satuan.id,
          nama_satuan: d.id_satuan.nama,
          qty: d.qty,
        };
        return formattedData;
      }),
      created_at: historyBahanKeluarData.created_at,
      updated_at: historyBahanKeluarData.updated_at,
      deleted_at: historyBahanKeluarData.deleted_at,
    };

    return res;
  }
}
