import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateKaryawanDto,
  FindAllKaryawanDto,
  UpdateKaryawanDto,
} from './dto/create-karyawan.dto';
import { KaryawanRepository } from 'src/database/mongodb/repositories/karyawan.repository';
import {
  KaryawanDeleteResponse,
  KaryawanFindAllResponse,
  KaryawanFindOneResponse,
} from './dto/response.interface';

@Injectable()
export class KaryawanService {
  constructor(private readonly karyawanRepo: KaryawanRepository) {}
  async handleCreateKaryawan(createKaryawanDto: CreateKaryawanDto) {
    // cek nama karyawan sudah dipakai atau belum
    const karyawanData = await this.karyawanRepo.findOne({
      nama: {
        $regex: `^${createKaryawanDto.nama}$`, // nama harus persis bukan like
        $options: 'i', // i artinya case-insensitive
      },
      deleted_at: null,
    });

    if (karyawanData) {
      throw new BadRequestException('Nama karyawan already exists');
    }

    // create new karyawan
    const newKaryawanData = await this.karyawanRepo.create(createKaryawanDto);

    // buat response
    const res: KaryawanFindOneResponse = {
      id: newKaryawanData.id,
      nama: newKaryawanData.nama,
      role: newKaryawanData.role,
      created_at: newKaryawanData.created_at,
      updated_at: newKaryawanData.updated_at,
      deleted_at: newKaryawanData.deleted_at,
    };
    return res;
  }

  async handleFindAllKaryawan(requestFilter: FindAllKaryawanDto) {
    // find all karyawan
    const listDataKaryawan = await this.karyawanRepo.findAll(
      {
        nama: requestFilter.search,
        role: requestFilter.role,
      },
      {
        page: requestFilter.page,
        per_page: requestFilter.per_page,
      },
      {},
    );

    // dapatkan total seluruh data berdasarkan hasil filter
    const totalListDataKaryawan = await this.karyawanRepo.countAll({
      nama: requestFilter.search,
    });

    // hitung total page
    const total_page: number = Math.ceil(
      totalListDataKaryawan / requestFilter.per_page,
    );

    // buat response
    const res: KaryawanFindAllResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: listDataKaryawan.map((s) => {
        const formattedData: KaryawanFindOneResponse = {
          id: s.id,
          nama: s.nama,
          role: s.role,
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

  async handleFindOneKaryawan(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // find karyawan by id
    const karyawanData = await this.karyawanRepo.findOne({
      id,
      deleted_at: null,
    });
    if (!karyawanData) {
      throw new NotFoundException('Karyawan not found');
    }

    // buat response
    const res: KaryawanFindOneResponse = {
      id: karyawanData.id,
      nama: karyawanData.nama,
      role: karyawanData.role,
      created_at: karyawanData.created_at,
      updated_at: karyawanData.updated_at,
      deleted_at: karyawanData.deleted_at,
    };

    return res;
  }

  async handleUpdateKaryawan(id: number, updateKaryawanDto: UpdateKaryawanDto) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // cek nama karyawan sudah dipakai atau belum
    const karyawanData = await this.karyawanRepo.findOne({
      nama: {
        $regex: `^${updateKaryawanDto.nama}$`, // nama harus persis bukan like
        $options: 'i', // i artinya case-insensitive
      },
      deleted_at: null,
    });

    if (karyawanData && karyawanData.id != id) {
      throw new BadRequestException('Nama karyawan already exists');
    }

    // update data karyawan
    const updatedKaryawanData = await this.karyawanRepo.update(
      { id, deleted_at: null },
      updateKaryawanDto,
    );

    if (!updatedKaryawanData) {
      throw new NotFoundException('Karyawan not found');
    }

    // buat response
    const res: KaryawanFindOneResponse = {
      nama: updatedKaryawanData.nama,
      role: updatedKaryawanData.role,
      created_at: updatedKaryawanData.created_at,
      updated_at: updatedKaryawanData.updated_at,
      deleted_at: updatedKaryawanData.deleted_at,
    };
    return res;
  }

  async hanldeDeleteKaryawan(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // delete data karyawan (soft delete)
    const updatedKaryawanData = await this.karyawanRepo.update(
      { id, deleted_at: null },
      { deleted_at: new Date() },
    );

    if (!updatedKaryawanData) {
      throw new NotFoundException('Karyawan not found');
    }

    // buat response
    const res: KaryawanDeleteResponse = {
      message: 'OK',
    };

    return res;
  }
}
