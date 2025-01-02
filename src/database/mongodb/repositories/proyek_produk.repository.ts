import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProyekProduk,
  ProyekProdukDocument,
} from '../schemas/proyek_produk.schema';
import { FilterQuery, Model } from 'mongoose';
import { ProyekProdukDtoDatabaseInput } from 'src/proyek/dto/response.interface';
import { FindAllProyekProdukDto } from 'src/proyek/dto/create-proyek.dto';
import { ProdukRepository } from './produk.repository';
import { ProyekRepository } from './proyek.repository';
import { TeamRepository } from './team.repository';
import { KaryawanRepository } from './karyawan.repository';
import {
  MasterFindAllKaryawanDto,
  MasterFindAllSatuanDto,
  MasterFindAllStokDto,
} from 'src/master/dto/create-master.dto';
import { Satuan, SatuanDocument } from '../schemas/satuan.schema';
import { HistoryBahanMasukDetail } from '../schemas/history_bahan_masuk_detail.schema';
import { Karyawan, KaryawanDocument } from '../schemas/karyawan.schema';

@Injectable()
export class ProyekProdukRepository {
  constructor(
    @InjectModel(ProyekProduk.name)
    private readonly proyekProdukModel: Model<ProyekProdukDocument>,
    @InjectModel(Satuan.name)
    private readonly SatuanModel: Model<SatuanDocument>,
    @InjectModel(Karyawan.name)
    private readonly karyawanModel: Model<KaryawanDocument>,
    private readonly produkRepo: ProdukRepository,
    private readonly proyekRepo: ProyekRepository,
    private readonly teamRepo: TeamRepository,
    private readonly karyawanRepo: KaryawanRepository,
  ) {}

  // GENERIC FUNCTION

  async create(createProyekProdukDto: ProyekProdukDtoDatabaseInput) {
    const proyekProduk = new this.proyekProdukModel(createProyekProdukDto);
    return await proyekProduk.save();
  }

  async update(
    ProyekProdukFilterQuery: FilterQuery<ProyekProduk>,
    proyekProdukData: ProyekProdukDtoDatabaseInput,
  ) {
    try {
      const updatedProyekProduk = await this.proyekProdukModel.findOneAndUpdate(
        ProyekProdukFilterQuery,
        proyekProdukData,
        { new: true }, // option new: true supaya hasil find one merupakan data setelah diupdate
      );
      return updatedProyekProduk;
    } catch (error) {
      console.error('Error update data produk:', error);
      throw new Error('Failed to update produk');
    }
  }

  async findOne(
    proyekProdukFilterQuery: FilterQuery<ProyekProduk>,
    showedField: any,
  ) {
    return await this.proyekProdukModel
      .findOne(proyekProdukFilterQuery, showedField.main)
      .populate({
        path: 'id_proyek',
        select: showedField.field1,
      })
      .populate({
        path: 'id_produk',
        select: showedField.field2,
      })
      .populate({
        path: 'id_team',
        select: showedField.field3,
        populate: {
          path: 'anggota',
          select: showedField.nestedField3,
        },
      });
  }

  async findAll(
    proyekProdukFilterQuery: FilterQuery<ProyekProduk>,
    showedField: any,
  ) {
    let filter: FilterQuery<ProyekProduk> = { deleted_at: null };

    filter = { ...filter, ...proyekProdukFilterQuery };

    return await this.proyekProdukModel
      .find(filter, showedField.main)
      .populate({
        path: 'id_proyek',
        select: showedField.field1,
      })
      .populate({
        path: 'id_produk',
        select: showedField.field2,
      })
      .populate({
        path: 'id_team',
        select: showedField.field3,
        populate: {
          path: 'anggota',
          select: showedField.nestedField3,
        },
      });
  }

  // NON-GENERIC FUNCTION

  async findAllPagination(
    proyekProdukFilterQuery: FilterQuery<FindAllProyekProdukDto>,
    paginationQuery: any,
    showedField: any,
  ) {
    let filter: FilterQuery<ProyekProduk> = { deleted_at: null };

    if (proyekProdukFilterQuery.id_proyek > 0) {
      // cari id proyek
      const proyekData = await this.proyekRepo.findOne(
        { id: proyekProdukFilterQuery.id_proyek },
        { main: { _id: 1 } },
      );

      if (!proyekData) {
        throw new NotFoundException('Proyek not found');
      }

      // tambahkan id_proyek ke filter
      filter = { ...filter, id_proyek: proyekData._id };
    }

    if (proyekProdukFilterQuery.id_produk > 0) {
      // cari produk
      const produkData = await this.produkRepo.findOne({
        id: proyekProdukFilterQuery.id_produk,
      });

      if (!produkData) {
        throw new NotFoundException('Produk not found');
      }

      // tambahkan id_produk ke filter
      filter = { ...filter, id_produk: produkData._id };
    }

    if (proyekProdukFilterQuery.id_karyawan > 0) {
      // cari karyawan untuk dapatkan _id nya
      const karyawanData = await this.karyawanRepo.findOne({
        id: proyekProdukFilterQuery.id_karyawan,
        deleted_at: null,
      });

      if (!karyawanData) {
        throw new NotFoundException('Karyawan not found');
      }

      // cari team
      const teamData: any = await this.teamRepo.findAll(
        { anggota: karyawanData._id },
        { main: {}, field1: 'id nama' },
      );

      if (!teamData) {
        throw new NotFoundException('Team not found');
      }

      // tambahkan id_team ke filter
      filter = {
        ...filter,
        id_team: {
          $in: teamData,
        },
      };
    }

    // filter berdasarkan tipe proyek
    if (proyekProdukFilterQuery.tipe !== '') {
      filter = { ...filter, tipe: proyekProdukFilterQuery.tipe };
    }

    // ini untuk paginationnya
    const { page, per_page } = paginationQuery;
    // skip untuk mulai dari data ke berapa (mirip OFFSET pada SQL)
    const skip = (page - 1) * per_page;

    return await this.proyekProdukModel
      .find(filter, showedField.main)
      .populate({
        path: 'id_proyek',
        select: showedField.field1,
      })
      .populate({
        path: 'id_produk',
        select: showedField.field2,
      })
      .populate({
        path: 'id_team',
        select: showedField.field3,
        populate: {
          path: 'anggota',
          select: showedField.nestedField3,
        },
      })
      .skip(skip)
      .limit(per_page);
  }

  async countAllPagination(
    proyekProdukFilterQuery: FilterQuery<FindAllProyekProdukDto>,
  ) {
    let filter: FilterQuery<ProyekProduk> = { deleted_at: null };

    if (proyekProdukFilterQuery.id_proyek > 0) {
      // cari id proyek
      const proyekData = await this.proyekRepo.findOne(
        { id: proyekProdukFilterQuery.id_proyek },
        { main: { _id: 1 } },
      );

      if (!proyekData) {
        throw new NotFoundException('Proyek not found');
      }

      // tambahkan id_proyek ke filter
      filter = { ...filter, id_proyek: proyekData };
    }

    if (proyekProdukFilterQuery.id_produk > 0) {
      // cari produk
      const produkData = await this.produkRepo.findOne({
        id: proyekProdukFilterQuery.id_produk,
      });

      if (!produkData) {
        throw new NotFoundException('Produk not found');
      }

      // tambahkan id_produk ke filter
      filter = { ...filter, id_produk: produkData._id };
    }

    return await this.proyekProdukModel.countDocuments(filter);
  }

  async masterFindAll(
    proyekProdukFilterQuery: FilterQuery<FindAllProyekProdukDto>,
    showedField: any,
  ) {
    let filter: FilterQuery<ProyekProduk> = { deleted_at: null };

    if (
      proyekProdukFilterQuery.id_proyek &&
      proyekProdukFilterQuery.id_proyek > 0
    ) {
      // cari id proyek
      const proyekData = await this.proyekRepo.findOne(
        { id: proyekProdukFilterQuery.id_proyek },
        { main: { _id: 1 } },
      );

      if (!proyekData) {
        throw new NotFoundException('Proyek not found');
      }

      // tambahkan id_proyek ke filter
      filter = { ...filter, id_proyek: proyekData._id };
    }

    return await this.proyekProdukModel
      .find(filter, showedField.main)
      .populate({
        path: 'id_proyek',
        select: showedField.field1,
      })
      .populate({
        path: 'id_produk',
        select: showedField.field2,
      })
      .populate({
        path: 'id_team',
        select: showedField.field3,
        populate: {
          path: 'anggota',
          select: showedField.nestedField3,
        },
      });
  }

  // ===============  master find all func ===============
  // yang pake id proyek produk dipindah ke sini supaya nda import loop
  async masterFindAllSatuan(
    satuanFilterQuery: FilterQuery<MasterFindAllSatuanDto>,
    showedField: any,
  ) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<Satuan> = { deleted_at: null };

    if (
      satuanFilterQuery.id_proyek_produk &&
      satuanFilterQuery.id_proyek_produk > 0
    ) {
      // cari produk id dari proyek produk
      let proyekProdukData = await this.findOne(
        {
          id: satuanFilterQuery.id_proyek_produk,
          deleted_at: null,
        },
        {
          main: {},
          field1: 'id nama',
          field2: 'id nama',
          field3: 'id',
          nestedField3: '',
        },
      );

      // cari detail bahan dari produk
      let produkData = await this.produkRepo.findOneProduk(
        {
          id: proyekProdukData ? proyekProdukData.id_produk.id : null,
          deleted_at: null,
        },
        {
          main: {},
          field1: 'id nama',
          field2: 'id nama',
        },
      );

      // ambil seluruh id satuan dari detail produk
      let detailSatuanIds = produkData
        ? produkData.detail.map((item) => item.id_satuan.id)
        : [];

      // tambahkan seluruh id satuan dari detail produk ke filterBahan
      filter = { ...filter, id: { $in: detailSatuanIds } };
    }

    if (satuanFilterQuery.search && satuanFilterQuery.search != '') {
      filter = {
        ...filter,
        nama: {
          $regex: satuanFilterQuery.search, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    if (
      satuanFilterQuery.satuan_terkecil &&
      satuanFilterQuery.satuan_terkecil != ''
    ) {
      filter = {
        ...filter,
        satuan_terkecil: satuanFilterQuery.satuan_terkecil,
      };
    }

    return await this.SatuanModel.find(filter, showedField.main);
  }

  async masterFindAllKaryawan(
    karyawanFilterQuery: FilterQuery<MasterFindAllKaryawanDto>,
    showedField: any,
  ) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<Karyawan> = { deleted_at: null };

    if (
      karyawanFilterQuery.id_proyek_produk &&
      karyawanFilterQuery.id_proyek_produk > 0
    ) {
      // cari produk id dari proyek produk
      let proyekProdukData = await this.findOne(
        {
          id: karyawanFilterQuery.id_proyek_produk,
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

      // // cari detail bahan dari produk
      // let teamData: any = await this.teamRepo.findAllAnggota(
      //   {
      //     id: proyekProdukData ? proyekProdukData.id_team.id : null,
      //     deleted_at: null,
      //   },
      //   {
      //     main: {},
      //     field1: 'id nama role',
      //   },
      // );

      // ambil seluruh id karyawan dari anggota team
      let detailKaryawanIds = proyekProdukData
        ? proyekProdukData.id_team.anggota.map((item) => item.id)
        : [];

      // tambahkan seluruh id satuan dari detail produk ke filterBahan
      filter = { ...filter, id: { $in: detailKaryawanIds } };
    }

    if (karyawanFilterQuery.search && karyawanFilterQuery.search != '') {
      filter = {
        ...filter,
        nama: {
          $regex: karyawanFilterQuery.search, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    if (karyawanFilterQuery.role && karyawanFilterQuery.role != '') {
      filter = {
        ...filter,
        role: karyawanFilterQuery.role,
      };
    }

    return await this.karyawanModel.find(filter, showedField.main);
  }
}
