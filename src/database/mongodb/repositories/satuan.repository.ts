import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Satuan, SatuanDocument } from '../schemas/satuan.schema';

@Injectable()
export class SatuanRepository {
  constructor(
    @InjectModel(Satuan.name)
    private readonly SatuanModel: Model<SatuanDocument>,
  ) {}

  async findOne(satuanFilterQuery: FilterQuery<Satuan>) {
    const satuanData = await this.SatuanModel.findOne(satuanFilterQuery);
    return satuanData;
  }

  async findAll(satuanFilterQuery: FilterQuery<Satuan>, showedField: any) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<Satuan> = { deleted_at: null };

    if (satuanFilterQuery.nama && satuanFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: satuanFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    filter = { ...filter, ...satuanFilterQuery };

    return await this.SatuanModel.find(filter, showedField);
  }

  async findAllPagination(
    satuanFilterQuery: FilterQuery<Satuan>,
    paginationQuery: any,
    showedField: any,
  ) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<Satuan> = { deleted_at: null };

    if (satuanFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: satuanFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    // ini untuk paginationnya
    const { page, per_page } = paginationQuery;
    // skip untuk mulai dari data ke berapa (mirip OFFSET pada SQL)
    const skip = (page - 1) * per_page;

    return await this.SatuanModel.find(filter, showedField)
      .skip(skip)
      .limit(per_page);
  }

  // ini buat dapetin seluruh jumlah data berdasarkan syarat filter
  async countAll(satuanFilterQuery: FilterQuery<Satuan>) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<Satuan> = { deleted_at: null };

    if (satuanFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: satuanFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    return await this.SatuanModel.countDocuments(filter);
  }

  async create(satuanData: Partial<Satuan>) {
    try {
      const newSatuan = new this.SatuanModel(satuanData);
      return await newSatuan.save();
    } catch (error) {
      console.error('Error creating satuan:', error);
      throw new Error('Failed to create satuan');
    }
  }

  async update(
    satuanFilterQuery: FilterQuery<Satuan>,
    satuanData: Partial<Satuan>,
  ) {
    try {
      const updatedSatuan = await this.SatuanModel.findOneAndUpdate(
        satuanFilterQuery,
        satuanData,
        { new: true }, // option new: true supaya hasil find one merupakan data setelah diupdate
      );
      return updatedSatuan;
    } catch (error) {
      console.error('Error update satuan:', error);
      throw new Error('Failed to update satuan');
    }
  }

  async delete(satuanFilterQuery: FilterQuery<Satuan>) {
    return await this.SatuanModel.deleteOne(satuanFilterQuery);
  }

  // FUNC NON-GENERIC

  /* NOTE:
  ----------------------------------------------------------------------------------
  Master find all satuan function dipindah ke proyek_produk.repository.ts supaya nda import loop 
  ----------------------------------------------------------------------------------
  */
}
