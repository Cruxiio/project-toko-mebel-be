import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProyekDto,
  CreateProyekProdukDto,
  FindAllProyekDto,
  FindAllProyekProdukDto,
  UpdateProyekDto,
  UpdateProyekProdukDto,
} from './dto/create-proyek.dto';
import { ProyekRepository } from 'src/database/mongodb/repositories/proyek.repository';
import { CustomerRepository } from 'src/database/mongodb/repositories/customer.repository';
import { Types } from 'mongoose';
import {
  ProyekDeleteResponse,
  ProyekDtoDatabaseInput,
  ProyekFindAllResponse,
  ProyekFindOneResponse,
  ProyekProdukDtoDatabaseInput,
  ProyekProdukFindAllResponse,
  ProyekProdukFindAllResponseData,
  TeamDtoDatabaseInput,
} from './dto/response.interface';
import { TeamRepository } from 'src/database/mongodb/repositories/team.repository';
import { CreateProdukDto } from 'src/produk/dto/create-produk.dto';
import { ProdukRepository } from 'src/database/mongodb/repositories/produk.repository';
import { ProyekProdukRepository } from 'src/database/mongodb/repositories/proyek_produk.repository';
import { HelperService } from 'src/helper/helper.service';

@Injectable()
export class ProyekService {
  constructor(
    private readonly proyekRepo: ProyekRepository,
    private readonly customerRepo: CustomerRepository,
    private readonly teamRepo: TeamRepository,
    private readonly produkRepo: ProdukRepository,
    private readonly proyekProdukRepo: ProyekProdukRepository,
    private readonly helperService: HelperService,
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

    // cek nama proyek sudah dipakai atau belum
    const proyekData = await this.proyekRepo.findOne(
      {
        nama: {
          $regex: `^${createProyekDto.nama}$`, // nama harus persis bukan like
          $options: 'i', // i artinya case-insensitive
        },
        deleted_at: null,
      },
      {
        main: {},
        field1: 'id nama',
      },
    );

    if (proyekData) {
      throw new BadRequestException('Nama proyek already exists');
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
      status: newProyekData.status,
      created_at: newProyekData.created_at,
      updated_at: newProyekData.updated_at,
      deleted_at: newProyekData.deleted_at,
    };

    return res;
  }

  async handleFindAllProyek(requestFilter: FindAllProyekDto) {
    // find all satuan
    const listDataProyek = await this.proyekRepo.findAllPagination(
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
          status: s.status,
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
      status: proyekData.status,
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

    // cek nama proyek sudah dipakai atau belum
    const ada = await this.proyekRepo.findOne(
      {
        nama: {
          $regex: `^${updateProyekDto.nama}$`, // nama harus persis bukan like
          $options: 'i', // i artinya case-insensitive
        },
        deleted_at: null,
      },
      {
        main: {},
        field1: 'id nama',
      },
    );

    if (ada && id != ada.id) {
      throw new BadRequestException('Nama proyek already exists');
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
      status: updatedProyekData.status,
      created_at: updatedProyekData.created_at,
      updated_at: updatedProyekData.updated_at,
      deleted_at: updatedProyekData.deleted_at,
    };

    return res;
  }

  async handleUpdateStatusProyek(id: number) {
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

    if (proyekData.status) {
      throw new BadRequestException('Proyek already completed');
    }

    // buat proyek input database interface
    const proyekInputDB: ProyekDtoDatabaseInput = {
      status: true,
    };

    const updatedProyekData = await this.proyekRepo.update(
      { id, deleted_at: null },
      proyekInputDB,
    );

    // buat response
    const res: ProyekDeleteResponse = {
      message: 'OK',
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

    // delete proyek
    const deletedProyekData = await this.proyekRepo.update(
      { id, deleted_at: null },
      { deleted_at: new Date() },
    );

    // find all proyek produk by id proyek
    const listProyekProdukData = await this.proyekProdukRepo.findAll(
      {
        id_proyek: proyekData._id,
      },
      {
        main: {},
        field1: '',
        field2: '',
        field3: '',
        nestedField3: '',
      },
    );

    for (let i = 0; i < listProyekProdukData.length; i++) {
      const proyekProdukData = listProyekProdukData[i];

      // delete proyek produk
      const deletedProyekProdukData = await this.proyekProdukRepo.update(
        { id: proyekProdukData.id, deleted_at: null },
        { deleted_at: new Date() },
      );

      // delete semua bahan yang ada pada produk di proyek produk
      const deletedProdukData = await this.produkRepo.update(
        { _id: proyekProdukData.id_produk, deleted_at: null },
        { deleted_at: new Date() },
      );
    }

    const res: ProyekDeleteResponse = {
      message: 'OK',
    };

    return res;
  }

  async handleCreateProyekProduk(createProyekProdukDto: CreateProyekProdukDto) {
    //validasi id proyek
    const proyekData = await this.proyekRepo.findOne(
      {
        id: createProyekProdukDto.id_proyek,
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

    // cek apakah team id sudah unique semua atau tidak
    const isKaryawanUnique = this.helperService.cekUnique([
      createProyekProdukDto.id_penanggung_jawab,
      createProyekProdukDto.id_karyawan1,
      createProyekProdukDto.id_karyawan2,
    ]);

    if (!isKaryawanUnique) {
      throw new BadRequestException(
        'Seluruh karyawan yang dipilih harus unique',
      );
    }

    //validasi id karyawan
    const teamData = await this.teamRepo.validateKaryawanIDs([
      createProyekProdukDto.id_penanggung_jawab,
      createProyekProdukDto.id_karyawan1,
      createProyekProdukDto.id_karyawan2,
    ]);

    // buat team
    const newTeamData = await this.teamRepo.create({
      anggota: teamData,
    });

    // ambil data anggota team
    // harus pake any supaya bisa baca field hasil populate karyawan
    // kenapa nda bisa baca properti nama karena field hasil popuplate tidak dikenali oleh validasi type typescript padahal datanya ada
    const anggotaTeamData: any = await this.teamRepo.findAllAnggota(
      {
        _id: newTeamData._id,
        deleted_at: null,
      },
      {
        main: {},
        field1: 'id nama role',
      },
    );

    // buat produk
    const newProdukData = await this.produkRepo.create({
      nama: createProyekProdukDto.nama_produk,
      detail: [],
    });

    // buat proyek produk
    const proyekProdukInputData: ProyekProdukDtoDatabaseInput = {
      id_proyek: proyekData._id as Types.ObjectId,
      id_produk: newProdukData._id as Types.ObjectId,
      id_team: newTeamData._id as Types.ObjectId,
      qty: createProyekProdukDto.qty,
      tipe: createProyekProdukDto.tipe,
    };

    // buat proyek produk
    const newProyekProdukData = await this.proyekProdukRepo.create(
      proyekProdukInputData,
    );

    const res: ProyekProdukFindAllResponseData = {
      id_proyek: proyekData.id,
      nama_proyek: proyekData.nama,
      id_produk: newProdukData.id,
      nama_produk: newProdukData.nama,
      id_team: newTeamData.id,
      nama_penanggung_jawab: anggotaTeamData.anggota[0].nama,
      nama_karyawan1: anggotaTeamData.anggota[1].nama,
      nama_karyawan2: anggotaTeamData.anggota[2].nama,
      qty: newProyekProdukData.qty,
      tipe: newProyekProdukData.tipe,
      status: newProyekProdukData.status,
      created_at: newProyekProdukData.created_at,
      updated_at: newProyekProdukData.updated_at,
      deleted_at: newProyekProdukData.deleted_at,
    };

    return res;
  }

  async handleUpdateProyekProduk(
    id: number,
    id_proyek_produk: number,
    updateProyekProdukDto: UpdateProyekProdukDto,
  ) {
    // cek apakah id proyek adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id proyek must be a number');
    }

    // cek apakah id proyek produk adalah int atau bukan
    if (Number.isNaN(id_proyek_produk)) {
      throw new BadRequestException('id proyek produk must be a number');
    }

    // find proyek produk by id
    // harus pake any supaya bisa baca field hasil populate produk
    const proyekProdukData = await this.proyekProdukRepo.findOne(
      {
        id: id_proyek_produk,
        deleted_at: null,
      },
      {
        main: {},
        field1: 'id nama',
        field2: 'id nama',
        field3: 'id',
        nestedField3: 'id nama role',
      },
    );

    if (!proyekProdukData) {
      throw new NotFoundException('Proyek Produk not found');
    }

    //validasi id proyek
    const proyekData = await this.proyekRepo.findOne(
      {
        id: id,
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

    // update nama produk
    const updatedProdukData = await this.produkRepo.update(
      { _id: proyekProdukData.id_produk, deleted_at: null },
      { nama: updateProyekProdukDto.nama_produk },
    );

    // cek apakah team id sudah unique semua atau tidak
    const isKaryawanUnique = this.helperService.cekUnique([
      updateProyekProdukDto.id_penanggung_jawab,
      updateProyekProdukDto.id_karyawan1,
      updateProyekProdukDto.id_karyawan2,
    ]);

    if (!isKaryawanUnique) {
      throw new BadRequestException(
        'Seluruh karyawan yang dipilih harus unique',
      );
    }

    //validasi id karyawan
    const teamData = await this.teamRepo.validateKaryawanIDs([
      updateProyekProdukDto.id_penanggung_jawab,
      updateProyekProdukDto.id_karyawan1,
      updateProyekProdukDto.id_karyawan2,
    ]);

    // update anggota team
    const updatedTeamData = await this.teamRepo.update(
      { id: proyekProdukData.id_team.id, deleted_at: null },
      {
        anggota: teamData,
      },
    );

    // ambil data anggota team
    // harus pake any supaya bisa baca field hasil populate karyawan
    // kenapa nda bisa baca properti nama karena field hasil popuplate tidak dikenali oleh validasi type typescript padahal datanya ada
    const anggotaTeamData: any = await this.teamRepo.findAllAnggota(
      {
        _id: updatedTeamData._id,
        deleted_at: null,
      },
      {
        main: {},
        field1: 'id nama role',
      },
    );

    // update proyek produk
    const proyekProdukInputData: ProyekProdukDtoDatabaseInput = {
      id_proyek: proyekData._id as Types.ObjectId,
      id_team: updatedTeamData._id as Types.ObjectId,
      qty: updateProyekProdukDto.qty,
      tipe: updateProyekProdukDto.tipe,
    };

    // update proyek produk
    const updatedProyekProdukData = await this.proyekProdukRepo.update(
      { id: proyekProdukData.id, deleted_at: null },
      proyekProdukInputData,
    );

    const res: ProyekProdukFindAllResponseData = {
      id: proyekProdukData.id,
      id_proyek: proyekData.id,
      nama_proyek: proyekData.nama,
      id_produk: proyekProdukData.id_produk.id,
      nama_produk: updatedProdukData.nama,
      id_team: updatedTeamData.id,
      nama_penanggung_jawab: anggotaTeamData.anggota[0].nama,
      nama_karyawan1: anggotaTeamData.anggota[1].nama,
      nama_karyawan2: anggotaTeamData.anggota[2].nama,
      qty: updatedProyekProdukData.qty,
      tipe: updatedProyekProdukData.tipe,
      status: updatedProyekProdukData.status,
      created_at: updatedProyekProdukData.created_at,
      updated_at: updatedProyekProdukData.updated_at,
      deleted_at: updatedProyekProdukData.deleted_at,
    };

    return res;
  }

  async handleUpdateStatusProyekProduk(id: number, id_proyek_produk: number) {
    // cek apakah id proyek adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id proyek must be a number');
    }

    // cek apakah id proyek produk adalah int atau bukan
    if (Number.isNaN(id_proyek_produk)) {
      throw new BadRequestException('id proyek produk must be a number');
    }

    // find proyek produk by id
    // harus pake any supaya bisa baca field hasil populate produk
    const proyekProdukData = await this.proyekProdukRepo.findOne(
      {
        id: id_proyek_produk,
        deleted_at: null,
      },
      {
        main: {},
        field1: 'id nama',
        field2: 'id nama',
        field3: 'id',
        nestedField3: 'id nama role',
      },
    );

    if (!proyekProdukData) {
      throw new NotFoundException('Proyek Produk not found');
    }

    //validasi id proyek
    const proyekData = await this.proyekRepo.findOne(
      {
        id: id,
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

    if (proyekProdukData.status) {
      throw new BadRequestException('Produk already completed');
    }

    // update proyek produk
    const proyekProdukInputData: ProyekProdukDtoDatabaseInput = {
      status: true,
    };

    // update proyek produk
    const updatedProyekProdukData = await this.proyekProdukRepo.update(
      { id: proyekProdukData.id, deleted_at: null },
      proyekProdukInputData,
    );

    const res: ProyekDeleteResponse = {
      message: 'OK',
    };

    return res;
  }

  // async handleFindOneProyekProduk(id: number) {
  //   // cek apakah id adalah int atau bukan
  //   if (Number.isNaN(id)) {
  //     throw new BadRequestException('id must be a number');
  //   }

  //   // find proyek produk by id
  //   const proyekProdukData = await this.proyekProdukRepo.findOne(
  //     {
  //       id,
  //       deleted_at: null,
  //     },
  //     {
  //       main: {},
  //       field1: 'id nama',
  //       field2: 'id nama',
  //       field3: 'id',
  //       nestedField3: 'id nama role',
  //     },
  //   );
  // }

  async handleFindAllProyekProduk(requestFilter: FindAllProyekProdukDto) {
    // find all proyek produk
    const listDataProyekProduk: any =
      await this.proyekProdukRepo.findAllPagination(
        {
          id_proyek: requestFilter.id_proyek,
          id_produk: requestFilter.id_produk,
          id_karyawan: requestFilter.id_karyawan,
          tipe: requestFilter.tipe,
        },
        {
          page: requestFilter.page,
          per_page: requestFilter.per_page,
        },
        {
          main: {},
          field1: 'id nama',
          field2: 'id nama',
          field3: 'id',
          nestedField3: 'id nama role',
        },
      );

    // dapatkan total seluruh data berdasarkan hasil filter
    const totalListDataProyekProduk =
      await this.proyekProdukRepo.countAllPagination({
        id_proyek: requestFilter.id_proyek,
        id_produk: requestFilter.id_produk,
        id_karyawan: requestFilter.id_karyawan,
        tipe: requestFilter.tipe,
      });

    // hitung total page
    const total_page: number = Math.ceil(
      totalListDataProyekProduk / requestFilter.per_page,
    );

    // buat response
    const res: ProyekProdukFindAllResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: listDataProyekProduk.map((s) => {
        const formattedData: ProyekProdukFindAllResponseData = {
          id: s.id,
          id_proyek: s.id_proyek.id,
          nama_proyek: s.id_proyek.nama,
          id_produk: s.id_produk.id,
          nama_produk: s.id_produk.nama,
          id_team: s.id_team.id,
          nama_penanggung_jawab: s.id_team.anggota[0].nama,
          nama_karyawan1: s.id_team.anggota[1].nama,
          nama_karyawan2: s.id_team.anggota[2].nama,
          qty: s.qty,
          tipe: s.tipe,
          status: s.status,
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

  async handleDeleteProyekProduk(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // find proyek produk by id
    const proyekProdukData = await this.proyekProdukRepo.findOne(
      {
        id,
        deleted_at: null,
      },
      {
        main: {},
        field1: 'id nama',
      },
    );

    if (!proyekProdukData) {
      throw new NotFoundException('Proyek Produk not found');
    }

    // delete proyek produk
    const deletedProyekProdukData = await this.proyekProdukRepo.update(
      { id, deleted_at: null },
      { deleted_at: new Date() },
    );

    // delete semua bahan yang ada pada produk di proyek produk
    const deletedProdukData = await this.produkRepo.update(
      { _id: proyekProdukData.id_produk, deleted_at: null },
      { deleted_at: new Date() },
    );

    const res: ProyekDeleteResponse = {
      message: 'OK',
    };

    return res;
  }
}
