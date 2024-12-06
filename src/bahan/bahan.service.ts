import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateBahanDto,
  FindAllBahanDto,
  UpdateBahanDto,
} from './dto/bahan.dto';
import {
  BahanDeleteResponse,
  BahanFindAllResponse,
  BahanFindAllResponseData,
  BahanFindOneResponse,
} from './dto/response.interface';
import { BahanRepository } from 'src/database/mongodb/repositories/bahan.repository';

@Injectable()
export class BahanService {
  constructor(private readonly bahanRepo: BahanRepository) {}

  async HandleCreateBahan(createBahanDto: CreateBahanDto) {
    // create new satuan
    const newBahanData = await this.bahanRepo.create(createBahanDto);

    // buat response
    const res: BahanFindOneResponse = {
      id: newBahanData.id,
      nama: newBahanData.nama,
      created_at: newBahanData.created_at,
      updated_at: newBahanData.updated_at,
      deleted_at: newBahanData.deleted_at,
    };
    return res;
  }

  async HandleFindAllBahan(requestFilter: FindAllBahanDto) {
    // find all satuan
    const listDataBahan = await this.bahanRepo.findAll(
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
    const totalListDataBahan = await this.bahanRepo.countAll({
      nama: requestFilter.search,
    });

    // hitung total page
    const total_page: number = Math.ceil(
      totalListDataBahan / requestFilter.per_page,
    );

    // buat response
    const res: BahanFindAllResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: listDataBahan.map((s) => {
        const formattedData: BahanFindAllResponseData = {
          id: s.id,
          nama: s.nama,
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

  async HandleFindOneBahan(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // find satuan by id
    const bahanData = await this.bahanRepo.findOne({
      id,
      deleted_at: null,
    });
    if (!bahanData) {
      throw new NotFoundException('Bahan not found');
    }

    // buat response
    const res: BahanFindOneResponse = {
      id: bahanData.id,
      nama: bahanData.nama,
      created_at: bahanData.created_at,
      updated_at: bahanData.updated_at,
      deleted_at: bahanData.deleted_at,
    };

    return res;
  }

  async HandleUpdateBahan(id: number, updateBahanDto: UpdateBahanDto) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // update data satuan
    const updatedBahanData = await this.bahanRepo.update(
      { id, deleted_at: null },
      updateBahanDto,
    );

    if (!updatedBahanData) {
      throw new NotFoundException('Bahan not found');
    }

    // buat response
    const res: BahanFindOneResponse = {
      nama: updatedBahanData.nama,
      created_at: updatedBahanData.created_at,
      updated_at: updatedBahanData.updated_at,
      deleted_at: updatedBahanData.deleted_at,
    };
    return res;
  }

  async HandleDeleteBahan(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // delete data satuan (soft delete)
    const updatedBahanData = await this.bahanRepo.update(
      { id, deleted_at: null },
      { deleted_at: new Date() },
    );

    if (!updatedBahanData) {
      throw new NotFoundException('Bahan not found');
    }

    // buat response
    const res: BahanDeleteResponse = {
      message: 'OK',
    };

    return res;
  }
}
