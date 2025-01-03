import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
          field3: 'id nama konversi',
        },
      );

    if (!historyBahanKeluarDetailData) {
      throw new NotFoundException('ID History Bahan Keluar Detail not found');
    }

    // validate apakah id_history_bahan_keluar_detail sudah ada bahan sisa atau belum
    const bahanSisaData = await this.bahanSisaRepository.findOne(
      {
        id_history_bahan_keluar_detail: historyBahanKeluarDetailData._id,
        deleted_at: null,
      },
      {
        main: {},
        field1: 'id',
        nestedField1: '',
        nestedField2: '',
        nestedField3: 'id nama',
        nestedField4: '',
        nestedField5: 'id nama',
        field2: 'id nama satuan_terkecil',
      },
    );

    if (bahanSisaData) {
      throw new BadRequestException('Bahan Sisa already exists');
    }

    // validate id_satuan
    const satuanData = await this.satuanRepository.findOne({
      id: createBahanSisaDto.id_satuan,
      deleted_at: null,
    });

    if (!satuanData) {
      throw new NotFoundException('ID Satuan not found');
    }

    // cek apakah input qty bahan sisa melebihi qty bahan keluar detail
    if (
      createBahanSisaDto.qty * satuanData.konversi >
      historyBahanKeluarDetailData.qty *
        historyBahanKeluarDetailData.id_satuan.konversi
    ) {
      throw new BadRequestException('Input qty melebihi qty bahan keluar');
    }

    // format ke bahan input dto
    const bahanSisaInputDatabaseData: BahanSisaInputDatabaseDto = {
      id_history_bahan_keluar_detail:
        historyBahanKeluarDetailData._id as Types.ObjectId,
      id_satuan: satuanData._id as Types.ObjectId,
      qty: createBahanSisaDto.qty,
      qty_pakai: createBahanSisaDto.qty * satuanData.konversi,
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
      satuan_terkecil: satuanData.satuan_terkecil,
      qty: newBahanSisaData.qty_pakai,
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
        field2: 'id nama satuan_terkecil',
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
          satuan_terkecil: bahanSisa.id_satuan.satuan_terkecil,
          qty: bahanSisa.qty_pakai,
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

  async handleUpdateBahanSisa(
    id: number,
    updateBahanSisaDto: UpdateBahanSisaDto,
  ) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // cek apakah id bahan sisa ada atau tidak
    const bahanSisaData = await this.bahanSisaRepository.findOne(
      {
        id: id,
        deleted_at: null,
      },
      {
        main: {},
        field1: 'id',
        nestedField1: '',
        nestedField2: '',
        nestedField3: 'id nama',
        nestedField4: '',
        nestedField5: 'id nama',
        field2: 'id nama satuan_terkecil',
      },
    );

    if (!bahanSisaData) {
      throw new NotFoundException('Bahan Sisa not found');
    }

    // cari satuan data
    const satuanData = await this.satuanRepository.findOne({
      id: updateBahanSisaDto.id_satuan,
      deleted_at: null,
    });

    if (!satuanData) {
      throw new NotFoundException('Satuan not found');
    }

    if (
      updateBahanSisaDto.qty * satuanData.konversi >
      bahanSisaData.qty_pakai
    ) {
      throw new BadRequestException('Input qty melebihi stok bahan sisa');
    }

    // update qty berdasarkan id dan satuan
    const updatedBahanSisaData = await this.bahanSisaRepository.update(
      {
        id: id,
        deleted_at: null,
      },
      {
        qty_pakai:
          bahanSisaData.qty_pakai -
          updateBahanSisaDto.qty * satuanData.konversi,
      },
    );

    // buat response

    const res: FindOneBahanSisaResponse = {
      id: updatedBahanSisaData.id,
      id_history_bahan_keluar_detail:
        bahanSisaData.id_history_bahan_keluar_detail.id,
      nama_proyek:
        bahanSisaData.id_history_bahan_keluar_detail.id_history_bahan_keluar
          .id_proyek_produk.id_proyek.nama,
      nama_bahan:
        bahanSisaData.id_history_bahan_keluar_detail
          .id_history_bahan_masuk_detail.id_bahan.nama,
      id_satuan: satuanData.id,
      satuan_terkecil: satuanData.satuan_terkecil,
      qty: updatedBahanSisaData.qty_pakai,
      keterangan: updatedBahanSisaData.keterangan,
      created_at: updatedBahanSisaData.created_at,
      updated_at: updatedBahanSisaData.updated_at,
      deleted_at: updatedBahanSisaData.deleted_at,
    };

    return res;
  }

  remove(id: number) {
    return `This action removes a #${id} bahanSisa`;
  }
}
