import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateSatuanDto,
  FindAllSatuanDto,
  UpdateSatuanDto,
} from './dto/satuan.dto';
import { SatuanRepository } from 'src/database/mongodb/repositories/satuan.repository';
import {
  SatuanDeleteResponse,
  SatuanFindAllResponse,
  SatuanFindAllResponseData,
  SatuanFindOneResponse,
} from './dto/response.interface.dto';

@Injectable()
export class SatuanService {
  constructor(private readonly satuanRepo: SatuanRepository) {}

  async HandleCreateSatuan(createSatuanDto: CreateSatuanDto) {
    // create new satuan
    const newSatuanData = await this.satuanRepo.create(createSatuanDto);

    // buat response
    const res: SatuanFindOneResponse = {
      id: newSatuanData.id,
      nama: newSatuanData.nama,
      satuan_terkecil: newSatuanData.satuan_terkecil,
      konversi: newSatuanData.konversi,
      created_at: newSatuanData.created_at,
      updated_at: newSatuanData.updated_at,
      deleted_at: newSatuanData.deleted_at,
    };
    return res;
  }

  async HandleFindAllSatuan(requestFilter: FindAllSatuanDto) {
    // find all satuan
    const listDataSatuan = await this.satuanRepo.findAll(
      {
        nama: requestFilter.search,
      },
      {
        page: requestFilter.page,
        per_page: requestFilter.per_page,
      },
      {},
    );

    // dapatkan total seluruh data berdasarkan hasil filter
    const totalListDataSatuan = await this.satuanRepo.countAll({
      nama: requestFilter.search,
    });

    // hitung total page
    const total_page: number = Math.ceil(
      totalListDataSatuan / requestFilter.per_page,
    );

    // buat response
    const res: SatuanFindAllResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: listDataSatuan.map((s) => {
        const formattedData: SatuanFindAllResponseData = {
          id: s.id,
          nama: s.nama,
          satuan_terkecil: s.satuan_terkecil,
          konversi: s.konversi,
          created_at: s.created_at,
          updated_at: s.updated_at,
          deleted_at: s.deleted_at,
        };
        return formattedData;
      }),
      total_page: total_page,
    };

    return res;
  }

  async HandleFindOneSatuan(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // find satuan by id
    const satuanData = await this.satuanRepo.findOne({
      id,
      deleted_at: null,
    });
    if (!satuanData) {
      throw new NotFoundException('Satuan not found');
    }

    // buat response
    const res: SatuanFindOneResponse = {
      id: satuanData.id,
      nama: satuanData.nama,
      satuan_terkecil: satuanData.satuan_terkecil,
      konversi: satuanData.konversi,
      created_at: satuanData.created_at,
      updated_at: satuanData.updated_at,
      deleted_at: satuanData.deleted_at,
    };

    return res;
  }

  async HandleUpdateSatuan(id: number, updateSatuanDto: UpdateSatuanDto) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // update data satuan
    const updatedSatuanData = await this.satuanRepo.update(
      { id, deleted_at: null },
      updateSatuanDto,
    );

    if (!updatedSatuanData) {
      throw new NotFoundException('Satuan not found');
    }

    // buat response
    const res: SatuanFindOneResponse = {
      nama: updatedSatuanData.nama,
      satuan_terkecil: updatedSatuanData.satuan_terkecil,
      konversi: updatedSatuanData.konversi,
      created_at: updatedSatuanData.created_at,
      updated_at: updatedSatuanData.updated_at,
      deleted_at: updatedSatuanData.deleted_at,
    };
    return res;
  }

  async HandleDeleteSatuan(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // delete data satuan (soft delete)
    const updatedSatuanData = await this.satuanRepo.update(
      { id, deleted_at: null },
      { deleted_at: new Date() },
    );

    if (!updatedSatuanData) {
      throw new NotFoundException('Satuan not found');
    }

    // buat response
    const res: SatuanDeleteResponse = {
      message: 'OK',
    };

    return res;
  }
}
