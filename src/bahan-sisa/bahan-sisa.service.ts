import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateBahanSisaDto,
  FindAllBahanSisaDto,
  UpdateBahanSisaDto,
} from './dto/create-bahan-sisa.dto';
import { BahanSisaRepository } from 'src/database/mongodb/repositories/bahanSisa.repository';
import { HistoryBahanKeluarRepository } from 'src/database/mongodb/repositories/historyBahanKeluar.repository';
import { SatuanRepository } from 'src/database/mongodb/repositories/satuan.repository';
import {
  BahanSisaInputDatabaseDto,
  FindAllBahanSisaResponse,
  FindAllBahanSisaResponseData,
  FindOneBahanSisaResponse,
} from './dto/response.interface';
import { Types } from 'mongoose';

@Injectable()
export class BahanSisaService {
  constructor(
    private readonly bahanSisaRepository: BahanSisaRepository,
    private readonly historyBahanKeluarRepository: HistoryBahanKeluarRepository,
    private readonly satuanRepository: SatuanRepository,
  ) {}
  async handleCreateBahanSisa(createBahanSisaDto: CreateBahanSisaDto) {
    // validate id_history_bahan_keluar_detail
    const historyBahanKeluarDetailData: any =
      await this.historyBahanKeluarRepository.findOneByHistoryBahanKeluarDetailByID(
        {
          id: createBahanSisaDto.id_history_bahan_keluar_detail,
          deleted_at: null,
        },
        {
          main: {},
          field1: '',
          nestedField1: '',
          nestedField2: 'id nama',
          field2: '',
          nestedField3: 'id nama',
          field3: 'id nama',
        },
      );

    if (!historyBahanKeluarDetailData) {
      throw new NotFoundException('ID History Bahan Keluar Detail not found');
    }

    // validate id_satuan
    const satuanData = await this.satuanRepository.findOne({
      id: createBahanSisaDto.id_satuan,
      deleted_at: null,
    });

    if (!satuanData) {
      throw new NotFoundException('ID Satuan not found');
    }

    // format ke bahan input dto
    const bahanSisaInputDatabaseData: BahanSisaInputDatabaseDto = {
      id_history_bahan_keluar_detail:
        historyBahanKeluarDetailData._id as Types.ObjectId,
      id_satuan: satuanData._id as Types.ObjectId,
      qty: createBahanSisaDto.qty,
      keterangan: createBahanSisaDto.keterangan,
    };

    // create bahan sisa
    const newBahanSisaData = await this.bahanSisaRepository.create(
      bahanSisaInputDatabaseData,
    );

    // buat response
    const res: FindOneBahanSisaResponse = {
      id: newBahanSisaData.id,
      id_history_bahan_keluar_detail:
        createBahanSisaDto.id_history_bahan_keluar_detail,
      nama_proyek:
        historyBahanKeluarDetailData.id_history_bahan_keluar.id_proyek_produk
          .id_proyek.nama,
      nama_bahan:
        historyBahanKeluarDetailData.id_history_bahan_masuk_detail.id_bahan
          .nama,
      id_satuan: satuanData.id,
      nama_satuan: satuanData.nama,
      qty: createBahanSisaDto.qty,
      keterangan: newBahanSisaData.keterangan,
      created_at: newBahanSisaData.created_at,
      updated_at: newBahanSisaData.updated_at,
      deleted_at: newBahanSisaData.deleted_at,
    };

    return res;
  }

  async handleFindAllBahanSisa(requestFilter: FindAllBahanSisaDto) {
    // list bahan sisa data
    const listBahanSisaData = await this.bahanSisaRepository.findAllPagination(
      {
        id_proyek: requestFilter.id_proyek,
        id_history_bahan_masuk_detail:
          requestFilter.id_history_bahan_masuk_detail,
        id_satuan: requestFilter.id_satuan,
      },
      {
        page: requestFilter.page,
        per_page: requestFilter.per_page,
      },
      {
        main: {},
        field1: 'id',
        nestedField1: '',
        nestedField2: '',
        nestedField3: 'id nama',
        nestedField4: '',
        nestedField5: 'id nama',
        field2: 'id nama',
      },
    );

    // dapatkan total seluruh data berdasarkan hasil filter
    const totalListDataBahanSisa = await this.bahanSisaRepository.countAll({
      id_proyek: requestFilter.id_proyek,
      id_history_bahan_masuk_detail:
        requestFilter.id_history_bahan_masuk_detail,
      id_satuan: requestFilter.id_satuan,
    });

    // hitung total page
    const total_page: number = Math.ceil(
      totalListDataBahanSisa / requestFilter.per_page,
    );

    // buat response
    const res: FindAllBahanSisaResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: listBahanSisaData.map((bahanSisa) => {
        const formattedData: FindAllBahanSisaResponseData = {
          id: bahanSisa.id,
          id_history_bahan_keluar_detail:
            bahanSisa.id_history_bahan_keluar_detail.id,
          nama_proyek:
            bahanSisa.id_history_bahan_keluar_detail.id_history_bahan_keluar
              .id_proyek_produk.id_proyek.nama,
          nama_bahan:
            bahanSisa.id_history_bahan_keluar_detail
              .id_history_bahan_masuk_detail.id_bahan.nama,
          id_satuan: bahanSisa.id_satuan.id,
          nama_satuan: bahanSisa.id_satuan.nama,
          qty: bahanSisa.qty,
          keterangan: bahanSisa.keterangan,
          created_at: bahanSisa.created_at,
          updated_at: bahanSisa.updated_at,
          deleted_at: bahanSisa.deleted_at,
        };
        return formattedData;
      }),
      total_page: total_page,
    };

    return res;
  }

  findOne(id: number) {
    return `This action returns a #${id} bahanSisa`;
  }

  update(id: number, updateBahanSisaDto: UpdateBahanSisaDto) {
    return `This action updates a #${id} bahanSisa`;
  }

  remove(id: number) {
    return `This action removes a #${id} bahanSisa`;
  }
}
