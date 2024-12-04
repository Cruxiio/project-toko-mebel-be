import { Injectable, NotFoundException } from '@nestjs/common';
import { Supplier, SupplierDocument } from '../schemas/supplier.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class SupplierRepository {
  constructor(
    @InjectModel(Supplier.name)
    private readonly SupplierModel: Model<SupplierDocument>,
  ) {}

  async findOne(supplierFilterQuery: FilterQuery<Supplier>) {
    const supplierData = await this.SupplierModel.findOne(supplierFilterQuery);
    return supplierData;
  }

  async findAll(
    supplierFilterQuery: FilterQuery<Supplier>,
    paginationQuery: any,
  ) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<Supplier> = { deleted_at: null };

    if (supplierFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: supplierFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    if (supplierFilterQuery.no_telepon != null) {
      filter = { ...filter, no_telepon: supplierFilterQuery.no_telepon };
    }

    // ini untuk paginationnya
    const { page, per_page } = paginationQuery;
    // skip untuk mulai dari data ke berapa (mirip OFFSET pada SQL)
    const skip = (page - 1) * per_page;

    return await this.SupplierModel.find(filter).skip(skip).limit(per_page);
  }

  // ini buat dapetin seluruh jumlah data berdasarkan syarat filter
  async countAll(supplierFilterQuery: FilterQuery<Supplier>) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<Supplier> = { deleted_at: null };

    if (supplierFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: supplierFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    if (supplierFilterQuery.no_telepon != null) {
      filter = { ...filter, no_telepon: supplierFilterQuery.no_telepon };
    }

    return await this.SupplierModel.countDocuments(filter);
  }

  async create(supplierData: Partial<Supplier>) {
    try {
      const newSupplier = new this.SupplierModel(supplierData);
      return await newSupplier.save();
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw new Error('Failed to create supplier');
    }
  }

  async update(
    supplierFilterQuery: FilterQuery<Supplier>,
    supplierData: Partial<Supplier>,
  ) {
    try {
      const updatedSupplier = await this.SupplierModel.findOneAndUpdate(
        supplierFilterQuery,
        supplierData,
        { new: true }, // option new: true supaya hasil find one merupakan data setelah diupdate
      );
      return updatedSupplier;
    } catch (error) {
      console.error('Error update supplier:', error);
      throw new Error('Failed to update supplier');
    }
  }

  async delete(supplierFilterQuery: FilterQuery<Supplier>) {
    return await this.SupplierModel.deleteOne(supplierFilterQuery);
  }
}
