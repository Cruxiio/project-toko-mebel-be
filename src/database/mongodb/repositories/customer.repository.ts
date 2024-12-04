import { Injectable, NotFoundException } from '@nestjs/common';
import { Supplier, SupplierDocument } from '../schemas/supplier.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Customer, CustomerDocument } from '../schemas/customer.schema';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectModel(Customer.name)
    private readonly CustomerModel: Model<CustomerDocument>,
  ) {}

  async findOne(customerFilterQuery: FilterQuery<Supplier>) {
    const customerData = await this.CustomerModel.findOne(customerFilterQuery);
    return customerData;
  }

  async findAll(
    customerFilterQuery: FilterQuery<Supplier>,
    paginationQuery: any,
  ) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<Supplier> = { deleted_at: null };

    if (customerFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: customerFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    if (customerFilterQuery.no_telepon != null) {
      filter = { ...filter, no_telepon: customerFilterQuery.no_telepon };
    }

    // ini untuk paginationnya
    const { page, per_page } = paginationQuery;
    // skip untuk mulai dari data ke berapa (mirip OFFSET pada SQL)
    const skip = (page - 1) * per_page;

    return await this.CustomerModel.find(filter).skip(skip).limit(per_page);
  }

  // ini buat dapetin seluruh jumlah data berdasarkan syarat filter
  async countAll(customerFilterQuery: FilterQuery<Supplier>) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<Supplier> = {};

    if (customerFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: customerFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    if (customerFilterQuery.no_telepon != null) {
      filter = { ...filter, no_telepon: customerFilterQuery.no_telepon };
    }

    return await this.CustomerModel.countDocuments(filter);
  }

  async create(customerData: Partial<Supplier>) {
    try {
      const newCustomer = new this.CustomerModel(customerData);
      return await newCustomer.save();
    } catch (error) {
      console.error('Error creating customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  async update(
    customerFilterQuery: FilterQuery<Supplier>,
    customerData: Partial<Supplier>,
  ) {
    try {
      const updatedCustomer = await this.CustomerModel.findOneAndUpdate(
        customerFilterQuery,
        customerData,
        { new: true }, // option new: true supaya hasil find one merupakan data setelah diupdate
      );
      return updatedCustomer;
    } catch (error) {
      console.error('Error update customer:', error);
      throw new Error('Failed to update customer');
    }
  }

  async delete(customerFilterQuery: FilterQuery<Supplier>) {
    return await this.CustomerModel.deleteOne(customerFilterQuery);
  }
}
