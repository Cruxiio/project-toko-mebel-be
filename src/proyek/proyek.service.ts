import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProyekDto,
  FindAllProyekDto,
  UpdateProyekDto,
} from './dto/create-proyek.dto';
import { ProyekRepository } from 'src/database/mongodb/repositories/proyek.repository';
import { CustomerRepository } from 'src/database/mongodb/repositories/customer.repository';
import { Types } from 'mongoose';
import {
  ProyekDeleteResponse,
  ProyekDtoDatabaseInput,
  ProyekFindAllResponse,
  ProyekFindOneResponse,
} from './dto/response.interface';

@Injectable()
export class ProyekService {
  constructor(
    private readonly proyekRepo: ProyekRepository,
    private readonly customerRepo: CustomerRepository,
  ) {}
  async handleCreateProyek(createProyekDto: CreateProyekDto) {
    // validasi id customer
    const customerData = await this.customerRepo.findOne({
      id: createProyekDto.id_customer,
      deleted_at: null,
    });

    if (!customerData) {
      throw new NotFoundException('Customer not found');
    }

    // validasi start < deadline
    if (createProyekDto.deadline <= createProyekDto.start) {
      throw new BadRequestException(
        'Deadline date must be greater than start date',
      );
    }

    // buat proyek input database interface
    let proyekInputDB: ProyekDtoDatabaseInput = {
      id_customer: customerData._id as Types.ObjectId,
      nama: createProyekDto.nama,
      start: createProyekDto.start,
      deadline: createProyekDto.deadline,
      alamat_pengiriman: createProyekDto.alamat_pengiriman,
    };

    // create new proyek
    const newProyekData = await this.proyekRepo.create(proyekInputDB);

    const res: ProyekFindOneResponse = {
      id: newProyekData.id,
      id_customer: customerData.id,
      nama: newProyekData.nama,
      start: newProyekData.start,
      deadline: newProyekData.deadline,
      alamat_pengiriman: newProyekData.alamat_pengiriman,
      created_at: newProyekData.created_at,
      updated_at: newProyekData.updated_at,
      deleted_at: newProyekData.deleted_at,
    };

    return res;
  }

  async handleFindAllProyek(requestFilter: FindAllProyekDto) {
    // find all satuan
    const listDataProyek = await this.proyekRepo.findAll(
      {
        nama: requestFilter.search,
        id_customer: requestFilter.id_customer,
        start: requestFilter.start,
        deadline: requestFilter.deadline,
      },
      {
        page: requestFilter.page,
        per_page: requestFilter.per_page,
      },
      {
        main: {},
        field1: 'id nama',
      },
    );

    // dapatkan total seluruh data berdasarkan hasil filter
    const totalListDataProyek = await this.proyekRepo.countAll({
      nama: requestFilter.search,
    });

    // hitung total page
    const total_page: number = Math.ceil(
      totalListDataProyek / requestFilter.per_page,
    );

    // buat response
    const res: ProyekFindAllResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: listDataProyek.map((s) => {
        const formattedData: ProyekFindOneResponse = {
          id: s.id,
          nama: s.nama,
          id_customer: s.id_customer.id,
          nama_customer: s.id_customer.nama,
          start: s.start,
          deadline: s.deadline,
          alamat_pengiriman: s.alamat_pengiriman,
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

  async handleFindOneProyek(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // find satuan by id
    const proyekData = await this.proyekRepo.findOne(
      {
        id,
        deleted_at: null,
      },
      {
        main: {},
        field1: 'id nama',
      },
    );

    if (!proyekData) {
      throw new NotFoundException('Proyek not found');
    }

    // buat response
    const res: ProyekFindOneResponse = {
      id: proyekData.id,
      id_customer: proyekData.id_customer.id,
      nama_customer: proyekData.id_customer.nama,
      nama: proyekData.nama,
      start: proyekData.start,
      deadline: proyekData.deadline,
      alamat_pengiriman: proyekData.alamat_pengiriman,
      created_at: proyekData.created_at,
      updated_at: proyekData.updated_at,
      deleted_at: proyekData.deleted_at,
    };

    return res;
  }

  async handleUpdateProyek(id: number, updateProyekDto: UpdateProyekDto) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // find proyek by id
    const proyekData = await this.proyekRepo.findOne(
      {
        id,
        deleted_at: null,
      },
      {
        main: {},
        field1: 'id nama',
      },
    );

    if (!proyekData) {
      throw new NotFoundException('Proyek not found');
    }

    // validasi id customer
    const customerData = await this.customerRepo.findOne({
      id: updateProyekDto.id_customer,
      deleted_at: null,
    });

    if (!customerData) {
      throw new NotFoundException('Customer not found');
    }

    // validasi start < deadline
    if (updateProyekDto.deadline <= updateProyekDto.start) {
      throw new BadRequestException(
        'Deadline date must be greater than start date',
      );
    }

    // buat proyek input database interface
    let proyekInputDB: ProyekDtoDatabaseInput = {
      id_customer: customerData._id as Types.ObjectId,
      nama: updateProyekDto.nama,
      start: updateProyekDto.start,
      deadline: updateProyekDto.deadline,
      alamat_pengiriman: updateProyekDto.alamat_pengiriman,
    };

    const updatedProyekData = await this.proyekRepo.update(
      { id, deleted_at: null },
      proyekInputDB,
    );

    // buat response
    const res: ProyekFindOneResponse = {
      id_customer: customerData.id,
      nama: updatedProyekData.nama,
      start: updatedProyekData.start,
      deadline: updatedProyekData.deadline,
      alamat_pengiriman: updatedProyekData.alamat_pengiriman,
      created_at: updatedProyekData.created_at,
      updated_at: updatedProyekData.updated_at,
      deleted_at: updatedProyekData.deleted_at,
    };

    return res;
  }

  async handleDeleteProyek(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // find proyek by id
    const proyekData = await this.proyekRepo.findOne(
      {
        id,
        deleted_at: null,
      },
      {
        main: {},
        field1: 'id nama',
      },
    );

    if (!proyekData) {
      throw new NotFoundException('Proyek not found');
    }

    const deletedProyekData = await this.proyekRepo.update(
      { id, deleted_at: null },
      { deleted_at: new Date() },
    );

    const res: ProyekDeleteResponse = {
      message: 'OK',
    };

    return res;
  }
}
