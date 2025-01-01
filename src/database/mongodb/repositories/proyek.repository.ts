import { Injectable, NotFoundException } from '@nestjs/common';
import { Supplier, SupplierDocument } from '../schemas/supplier.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Proyek, ProyekDocument } from '../schemas/proyek.schema';
import { ProyekDtoDatabaseInput } from 'src/proyek/dto/response.interface';
import { CustomerRepository } from './customer.repository';

@Injectable()
export class ProyekRepository {
  constructor(
    @InjectModel(Proyek.name)
    private readonly proyekModel: Model<ProyekDocument>,
    private readonly customerRepo: CustomerRepository,
  ) {}

  async findOne(proyekFilterQuery: FilterQuery<Proyek>, showedField: any) {
    const proyekData = await this.proyekModel
      .findOne(proyekFilterQuery, showedField.main)
      .populate({
        path: 'id_customer',
        select: showedField.field1,
      });
    return proyekData;
  }

  async findAll(proyekFilterQuery: FilterQuery<Proyek>, showedField: any) {
    let filter: FilterQuery<Proyek> = { deleted_at: null };

    filter = { ...filter, ...proyekFilterQuery };

    if (proyekFilterQuery.nama && proyekFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: proyekFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    const proyekData = await this.proyekModel
      .find(filter, showedField.main)
      .populate({
        path: 'id_customer',
        select: showedField.field1,
      });
    return proyekData;
  }

  async findAllPagination(
    proyekFilterQuery: FilterQuery<Proyek>,
    paginationQuery: any,
    showedField: any,
  ) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<Proyek> = { deleted_at: null };

    if (proyekFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: proyekFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    if (proyekFilterQuery.start != null) {
      // ubah ke format date
      const startDate = new Date(proyekFilterQuery.start);
      // cek apakah valid atau tidak
      const notValid = isNaN(startDate.getTime());

      filter = {
        ...filter,
        start: notValid ? null : startDate,
      };
    }

    if (proyekFilterQuery.deadline != null) {
      // ubah ke format date
      const DeadlineDate = new Date(proyekFilterQuery.deadline);
      // cek apakah valid atau tidak
      const notValid = isNaN(DeadlineDate.getTime());

      filter = {
        ...filter,
        deadline: notValid ? null : DeadlineDate,
      };
    }

    if (proyekFilterQuery.id_customer > 0) {
      // cari supplier _id
      let customerData = await this.customerRepo.findOne({
        id: proyekFilterQuery.id_customer,
        deleted_at: null,
      });

      filter = {
        ...filter,
        id_customer: customerData ? customerData._id : null,
      };
    }

    // ini untuk paginationnya
    const { page, per_page } = paginationQuery;
    // skip untuk mulai dari data ke berapa (mirip OFFSET pada SQL)
    const skip = (page - 1) * per_page;

    return await this.proyekModel
      .find(filter, showedField.main)
      .populate({ path: 'id_customer', select: showedField.field1 })
      .skip(skip)
      .limit(per_page);
  }

  // ini buat dapetin seluruh jumlah data berdasarkan syarat filter
  async countAll(proyekFilterQuery: FilterQuery<Proyek>) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<Proyek> = { deleted_at: null };

    if (proyekFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: proyekFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    if (proyekFilterQuery.start != null) {
      // ubah ke format date
      const startDate = new Date(proyekFilterQuery.start);
      // cek apakah valid atau tidak
      const notValid = isNaN(startDate.getTime());

      filter = {
        ...filter,
        start: notValid ? null : startDate,
      };
    }

    if (proyekFilterQuery.deadline != null) {
      // ubah ke format date
      const DeadlineDate = new Date(proyekFilterQuery.deadline);
      // cek apakah valid atau tidak
      const notValid = isNaN(DeadlineDate.getTime());

      filter = {
        ...filter,
        deadline: notValid ? null : DeadlineDate,
      };
    }

    if (proyekFilterQuery.id_customer > 0) {
      // cari supplier _id
      let customerData = await this.customerRepo.findOne({
        id: proyekFilterQuery.id_customer,
        deleted_at: null,
      });

      filter = {
        ...filter,
        id_customer: customerData ? customerData._id : null,
      };
    }

    return await this.proyekModel.countDocuments(filter);
  }

  async create(proyekData: ProyekDtoDatabaseInput) {
    try {
      const newProyek = new this.proyekModel(proyekData);
      return await newProyek.save();
    } catch (error) {
      console.error('Error creating proyek:', error);
      throw new Error('Failed to create proyek');
    }
  }

  async update(
    ProyekFilterQuery: FilterQuery<Proyek>,
    proyekData: ProyekDtoDatabaseInput,
  ) {
    try {
      const updatedSupplier = await this.proyekModel.findOneAndUpdate(
        ProyekFilterQuery,
        proyekData,
        { new: true }, // option new: true supaya hasil find one merupakan data setelah diupdate
      );
      return updatedSupplier;
    } catch (error) {
      console.error('Error update proyek:', error);
      throw new Error('Failed to update proyek');
    }
  }

  async delete(proyekFilterQuery: FilterQuery<Proyek>) {
    return await this.proyekModel.deleteOne(proyekFilterQuery);
  }

  // FUNC NON-GENERIC
  // async masterFindAll(
  //   supplierFilterQuery: FilterQuery<Proyek>,
  //   paginationQuery: any,
  // ) {
  //   return await this.findAll(supplierFilterQuery, paginationQuery, {
  //     id: 1,
  //     nama: 1,
  //     _id: 0,
  //   });
  // }

  async masterFindAll(
    proyekFilterQuery: FilterQuery<Proyek>,
    showedField: any,
  ) {
    let filter: FilterQuery<Proyek> = { deleted_at: null };

    if (proyekFilterQuery.nama && proyekFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: proyekFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    const proyekData = await this.proyekModel
      .find(filter, showedField.main)
      .populate({
        path: 'id_customer',
        select: showedField.field1,
      });
    return proyekData;
  }
}
