import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BahanSisa, BahanSisaDocument } from '../schemas/bahan_sisa.schema';
import { FilterQuery, Model } from 'mongoose';
import { BahanSisaInputDatabaseDto } from 'src/bahan-sisa/dto/response.interface';
import { FindAllBahanSisaDto } from 'src/bahan-sisa/dto/create-bahan-sisa.dto';
import { SatuanRepository } from './satuan.repository';
import { ProyekRepository } from './proyek.repository';
import { ProyekProdukRepository } from './proyek_produk.repository';
import { HistoryBahanKeluarRepository } from './historyBahanKeluar.repository';
import { HistoryBahanMasukRepository } from './historyBahanMasuk.repository';

@Injectable()
export class BahanSisaRepository {
  constructor(
    @InjectModel(BahanSisa.name)
    private readonly bahanSisaModel: Model<BahanSisaDocument>,
    private readonly satuanRepository: SatuanRepository,
    private readonly proyekRepo: ProyekRepository,
    private readonly proyekProdukRepo: ProyekProdukRepository,
    private readonly historyBahanKeluarRepository: HistoryBahanKeluarRepository,
    private readonly historyBahanMasukRepository: HistoryBahanMasukRepository,
  ) {}

  async create(bahanSisaData: BahanSisaInputDatabaseDto) {
    try {
      const newBahanSisa = new this.bahanSisaModel({
        id_history_bahan_keluar_detail:
          bahanSisaData.id_history_bahan_keluar_detail,
        id_satuan: bahanSisaData.id_satuan,
        qty: bahanSisaData.qty,
        keterangan: bahanSisaData.keterangan,
      });
      await newBahanSisa.save();

      return newBahanSisa;
    } catch (error) {
      console.error('Error creating bahan sisa:', error);
      throw new Error('Failed to create bahan sisa');
    }
  }

  async update(
    requestFilter: FilterQuery<BahanSisa>,
    bahanSisaData: Partial<BahanSisaInputDatabaseDto>,
  ) {
    try {
      const updatedData = await this.bahanSisaModel.findOneAndUpdate(
        requestFilter,
        bahanSisaData,
        { new: true }, // option new: true supaya hasil find one merupakan data setelah diupdate
      );

      return updatedData;
    } catch (error) {
      console.error('Error updating bahan sisa:', error);
      throw new Error('Failed to update bahan sisa');
    }
  }

  async findAll(requestFilter: FilterQuery<BahanSisa>, showField: any) {
    let filter: FilterQuery<BahanSisa> = { deleted_at: null };

    filter = { ...filter, ...requestFilter };

    return await this.bahanSisaModel.find(filter, showField.main);
  }

  async findOne(requestFilter: FilterQuery<BahanSisa>, showField: any) {
    return await this.bahanSisaModel.findOne(requestFilter, showField);
  }

  async filterFindAllPagination(
    requestFilter: FilterQuery<FindAllBahanSisaDto>,
  ) {
    let filter: FilterQuery<BahanSisa> = {};
    let history_bahan_keluar_detail_filter: any = {};
    // filter by id_history_bahan_masuk_detail
    if (
      requestFilter.id_history_bahan_masuk_detail &&
      requestFilter.id_history_bahan_masuk_detail > 0
    ) {
      // cari _id history bahan masuk detail dari id_history_bahan_masuk_detail
      const historyBahanMasukDetailData =
        await this.historyBahanMasukRepository.findOneHistoryBahanMasukDetail(
          {
            id: requestFilter.id_history_bahan_masuk_detail,
          },
          {
            main: { _id: 1, id: 1 },
            field1: '',
            nestedField1: '',
            field2: '',
            field3: '',
          },
        );

      // tambahkan _id history_bahan_masuk_detail ke filter history bahan keluar detail
      history_bahan_keluar_detail_filter = {
        id_history_bahan_masuk_detail: historyBahanMasukDetailData
          ? historyBahanMasukDetailData._id
          : null,
      };
    }

    // filter by id_satuan
    if (requestFilter.id_satuan && requestFilter.id_satuan > 0) {
      const satuanData = await this.satuanRepository.findOne({
        id: requestFilter.id_satuan,
        deleted_at: null,
      });

      filter = { ...filter, id_satuan: satuanData ? satuanData._id : null };
    }

    // filter by id_proyek
    if (requestFilter.id_proyek && requestFilter.id_proyek > 0) {
      // cari _id proyek dari id_proyek
      const proyekData = await this.proyekRepo.findOne(
        {
          id: requestFilter.id_proyek,
          deleted_at: null,
        },
        {
          main: { _id: 1, id: 1 },
          field1: '',
        },
      );

      // cari semua proyek produk yang dimiliki proyek
      const proyekProdukData = await this.proyekProdukRepo.findAll(
        {
          id_proyek: proyekData ? proyekData._id : null,
        },
        {
          main: { _id: 1, id: 1 },
          field1: '',
          field2: '',
          field3: '',
          nestedField3: '',
        },
      );

      const proyekProdukIds = proyekProdukData.map((p) => p._id);

      // cari semua history bahan keluar yang dimiliki proyek produk
      const historyBahanKeluarData =
        await this.historyBahanKeluarRepository.findAll(
          {
            id_proyek_produk: { $in: proyekProdukIds },
          },
          {
            main: { _id: 1, id: 1 },
            field1: '',
            nestedField1: '',
            nestedField2: '',
            field2: '',
          },
        );

      const historyBahanKeluarIds = historyBahanKeluarData.map((h) => h._id);

      //add historyBahanKeluarIds ke filter history bahan keluar detail
      history_bahan_keluar_detail_filter = {
        ...history_bahan_keluar_detail_filter,
        id_history_bahan_keluar: { $in: historyBahanKeluarIds },
      };
    }

    // cari semua history bahan keluar detail yang dimiliki history bahan keluar
    const historyBahanKeluarDetailData =
      await this.historyBahanKeluarRepository.findAllDetail(
        history_bahan_keluar_detail_filter,
        {
          main: { id: 1, _id: 1 },
          field1: '',
          nestedField1: '',
          nestedField2: '',
          field2: '',
          nestedField3: '',
          field3: '',
        },
      );

    const historyBahanKeluarDetailIds = historyBahanKeluarDetailData.map(
      (h) => h._id,
    );

    filter = {
      ...filter,
      id_history_bahan_keluar_detail: { $in: historyBahanKeluarDetailIds },
    };

    return filter;
  }

  async findAllPagination(
    requestFilter: FilterQuery<FindAllBahanSisaDto>,
    paginationQuery: any,
    showedField: any,
  ) {
    let filter: FilterQuery<BahanSisa> = { deleted_at: null, qty: { $gt: 0 } };

    // filter berdasarkan requestFilter
    const filteredRequest = await this.filterFindAllPagination(requestFilter);

    filter = { ...filter, ...filteredRequest };

    // ini untuk paginationnya
    const { page, per_page } = paginationQuery;
    // skip untuk mulai dari data ke berapa (mirip OFFSET pada SQL)
    const skip = (page - 1) * per_page;

    return await this.bahanSisaModel
      .find(filter, showedField.main)
      .populate({
        path: 'id_history_bahan_keluar_detail',
        select: showedField.field1,
        populate: [
          {
            path: 'id_history_bahan_keluar',
            select: showedField.nestedField1,
            populate: {
              path: 'id_proyek_produk',
              select: showedField.nestedField2,
              populate: {
                path: 'id_proyek',
                select: showedField.nestedField3,
              },
            },
          },
          {
            path: 'id_history_bahan_masuk_detail',
            select: showedField.nestedField4,
            populate: { path: 'id_bahan', select: showedField.nestedField5 },
          },
        ],
      })
      .populate({
        path: 'id_satuan',
        select: showedField.field2,
      })
      .skip(skip)
      .limit(per_page);
  }

  async countAll(requestFilter: FilterQuery<FindAllBahanSisaDto>) {
    let filter: FilterQuery<BahanSisa> = { deleted_at: null, qty: { $gt: 0 } };

    // filter berdasarkan requestFilter
    const filteredRequest = await this.filterFindAllPagination(requestFilter);

    filter = { ...filter, ...filteredRequest };

    return await this.bahanSisaModel.countDocuments(filter);
  }
}
