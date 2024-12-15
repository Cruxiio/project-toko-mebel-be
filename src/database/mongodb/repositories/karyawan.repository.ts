import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Karyawan, KaryawanDocument } from '../schemas/karyawan.schema';

@Injectable()
export class KaryawanRepository {
  constructor(
    @InjectModel(Karyawan.name)
    private readonly karyawanModel: Model<KaryawanDocument>,
  ) {}

  async findOne(karyawanFilterQuery: FilterQuery<Karyawan>) {
    const karyawanData = await this.karyawanModel.findOne(karyawanFilterQuery);
    return karyawanData;
  }

  async findAll(
    karyawanFilterQuery: FilterQuery<Karyawan>,
    paginationQuery: any,
    showedField: any,
  ) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<Karyawan> = { deleted_at: null };

    if (karyawanFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: karyawanFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    if (karyawanFilterQuery.role != '') {
      filter = {
        ...filter,
        role: karyawanFilterQuery.role,
      };
    }

    // ini untuk paginationnya
    const { page, per_page } = paginationQuery;
    // skip untuk mulai dari data ke berapa (mirip OFFSET pada SQL)
    const skip = (page - 1) * per_page;

    return await this.karyawanModel
      .find(filter, showedField)
      .skip(skip)
      .limit(per_page);
  }

  // ini buat dapetin seluruh jumlah data berdasarkan syarat filter
  async countAll(karyawanFilterQuery: FilterQuery<Karyawan>) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<Karyawan> = { deleted_at: null };

    if (karyawanFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: karyawanFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    return await this.karyawanModel.countDocuments(filter);
  }

  async create(karyawanData: Partial<Karyawan>) {
    try {
      const newKaryawan = new this.karyawanModel(karyawanData);
      return await newKaryawan.save();
    } catch (error) {
      console.error('Error creating karyawan:', error);
      throw new Error('Failed to create karyawan');
    }
  }

  async update(
    karyawanFilterQuery: FilterQuery<Karyawan>,
    karyawanData: Partial<Karyawan>,
  ) {
    try {
      const updatedKaryawan = await this.karyawanModel.findOneAndUpdate(
        karyawanFilterQuery,
        karyawanData,
        { new: true }, // option new: true supaya hasil find one merupakan data setelah diupdate
      );
      return updatedKaryawan;
    } catch (error) {
      console.error('Error update karyawan:', error);
      throw new Error('Failed to update karyawan');
    }
  }

  async delete(karyawanFilterQuery: FilterQuery<Karyawan>) {
    return await this.karyawanModel.deleteOne(karyawanFilterQuery);
  }

  // FUNC NON-GENERIC
  async masterFindAll(
    karyawanFilterQuery: FilterQuery<Karyawan>,
    paginationQuery: any,
  ) {
    return await this.findAll(karyawanFilterQuery, paginationQuery, {
      id: 1,
      nama: 1,
      _id: 0,
    });
  }
}
