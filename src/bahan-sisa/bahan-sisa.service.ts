import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateBahanSisaDto,
  UpdateBahanSisaDto,
} from './dto/create-bahan-sisa.dto';
import { BahanSisaRepository } from 'src/database/mongodb/repositories/bahanSisa.repository';
import { HistoryBahanKeluarRepository } from 'src/database/mongodb/repositories/historyBahanKeluar.repository';
import { SatuanRepository } from 'src/database/mongodb/repositories/satuan.repository';
import {
  BahanSisaInputDatabaseDto,
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

  findAll() {
    return `This action returns all bahanSisa`;
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
