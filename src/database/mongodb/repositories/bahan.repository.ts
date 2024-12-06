import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Bahan, BahanDocument } from '../schemas/bahan.schema';

@Injectable()
export class BahanRepository {
  constructor(
    @InjectModel(Bahan.name)
    private readonly BahanModel: Model<BahanDocument>,
  ) {}

  async findOne(bahanFilterQuery: FilterQuery<Bahan>) {
    const bahanData = await this.BahanModel.findOne(bahanFilterQuery);
    return bahanData;
  }

  async findAll(
    bahanFilterQuery: FilterQuery<Bahan>,
    paginationQuery: any,
    showedField: any,
  ) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<Bahan> = { deleted_at: null };

    if (bahanFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: bahanFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    // ini untuk paginationnya
    const { page, per_page } = paginationQuery;
    // skip untuk mulai dari data ke berapa (mirip OFFSET pada SQL)
    const skip = (page - 1) * per_page;

    return await this.BahanModel.find(filter, showedField)
      .skip(skip)
      .limit(per_page);
  }

  // ini buat dapetin seluruh jumlah data berdasarkan syarat filter
  async countAll(bahanFilterQuery: FilterQuery<Bahan>) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<Bahan> = { deleted_at: null };

    if (bahanFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: bahanFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    return await this.BahanModel.countDocuments(filter);
  }

  async create(bahanData: Partial<Bahan>) {
    try {
      const newBahan = new this.BahanModel(bahanData);
      return await newBahan.save();
    } catch (error) {
      console.error('Error creating bahan:', error);
      throw new Error('Failed to create bahan');
    }
  }

  async update(
    bahanFilterQuery: FilterQuery<Bahan>,
    bahanData: Partial<Bahan>,
  ) {
    try {
      const updatedBahan = await this.BahanModel.findOneAndUpdate(
        bahanFilterQuery,
        bahanData,
        { new: true }, // option new: true supaya hasil find one merupakan data setelah diupdate
      );
      return updatedBahan;
    } catch (error) {
      console.error('Error update bahan:', error);
      throw new Error('Failed to update bahan');
    }
  }

  async delete(bahanFilterQuery: FilterQuery<Bahan>) {
    return await this.BahanModel.deleteOne(bahanFilterQuery);
  }

  // FUNC NON-GENERIC
  async masterFindAll(
    bahanFilterQuery: FilterQuery<Bahan>,
    paginationQuery: any,
  ) {
    return await this.findAll(bahanFilterQuery, paginationQuery, {
      id: 1,
      nama: 1,
      _id: 0,
    });
  }
}
