import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ProdukJasa, ProdukJasaDocument } from '../schemas/produk_jasa.schema';
import { Connection, FilterQuery, Model } from 'mongoose';
import { FindAllProdukJasaDto } from 'src/produk-jasa/dto/create-produk-jasa.dto';
import { SatuanRepository } from './satuan.repository';
import { ProdukRepository } from './produk.repository';
import { ProdukJasaInputDatabaseDto } from 'src/produk-jasa/dto/response.interface';

@Injectable()
export class ProdukJasaRepository {
  constructor(
    @InjectModel(ProdukJasa.name)
    private readonly produkJasaModel: Model<ProdukJasaDocument>,
    @InjectConnection()
    private readonly connection: Connection,
    private readonly produkRepo: ProdukRepository,
    private readonly satuanRepo: SatuanRepository,
  ) {}

  //  GENERIC FUNCTION

  async create(produkJasaData: Partial<ProdukJasaInputDatabaseDto>) {
    try {
      const produkJasa = new this.produkJasaModel(produkJasaData);
      return await produkJasa.save();
    } catch (error) {
      console.error('Error creating produk jasa :', error);
      throw new Error('Failed to create produk jasa');
    }
  }

  async update(
    requestFilter: FilterQuery<ProdukJasa>,
    produkJasaData: Partial<ProdukJasa>,
  ) {
    try {
      const updatedData = await this.produkJasaModel.findOneAndUpdate(
        requestFilter,
        produkJasaData,
        { new: true },
      );

      return updatedData;
    } catch (error) {
      console.error('Error updating produk jasa:', error);
      throw new Error('Failed to update produk jasa');
    }
  }

  async findAll(requestFilter: FilterQuery<ProdukJasa>, showedField: any) {
    let filter: FilterQuery<ProdukJasa> = { deleted_at: null };

    filter = { ...filter, ...requestFilter };

    return await this.produkJasaModel
      .find(filter, showedField.main)
      .populate({
        path: 'id_produk',
        select: showedField.field1,
      })
      .populate({
        path: 'id_satuan',
        select: showedField.field2,
      });
  }

  async findOne(requestFilter: FilterQuery<ProdukJasa>, showedField: any) {
    return await this.produkJasaModel
      .findOne(requestFilter, showedField.main)
      .populate({
        path: 'id_produk',
        select: showedField.field1,
      })
      .populate({
        path: 'id_satuan',
        select: showedField.field2,
      });
  }

  async delete(requestFilter: FilterQuery<ProdukJasa>) {
    try {
      // hapus produk jasa
      await this.produkJasaModel.deleteOne({
        id: requestFilter.id,
      });

      // cari data counters produk jasa
      const countersData = await this.connection
        .collection('counters')
        .findOne({
          id: 'produk_jasa_id_counter',
        });

      // restore id auto increment produk jasa
      if (countersData && countersData.seq > 0) {
        await this.connection
          .collection('counters')
          .updateOne(
            { id: 'produk_jasa_id_counter' },
            { $set: { seq: countersData.seq - 1 } },
          );
      }
    } catch (error) {
      console.error('Error deleting produk jasa:', error);
      throw new Error('Failed to delete produk jasa');
    }
  }

  // NON GENERIC FUNCTION

  async findAllPagination(
    requestFilter: FilterQuery<FindAllProdukJasaDto>,
    paginationQuery: any,
    showedField: any,
  ) {
    let filter: FilterQuery<ProdukJasa> = { deleted_at: null };

    // filter by search (like)
    if (requestFilter.search && requestFilter.search != '') {
      filter = {
        ...filter,
        nama: {
          $regex: requestFilter.search, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    // filter by id_produk
    if (requestFilter.id_produk && requestFilter.id_produk > 0) {
      // cari _id produk dari id_produk
      const produkData = await this.produkRepo.findOne({
        id: requestFilter.id_produk,
      });

      filter = { ...filter, id_produk: produkData ? produkData._id : null };
    }

    // filter by id_satuan
    if (requestFilter.id_satuan && requestFilter.id_satuan > 0) {
      // cari _id satuan dari id_satuan
      const satuanData = await this.satuanRepo.findOne({
        id: requestFilter.id_satuan,
      });

      filter = { ...filter, id_satuan: satuanData ? satuanData._id : null };
    }

    // ini untuk paginationnya
    const { page, per_page } = paginationQuery;
    // skip untuk mulai dari data ke berapa (mirip OFFSET pada SQL)
    const skip = (page - 1) * per_page;

    return await this.produkJasaModel
      .find(filter, showedField.main)
      .populate({
        path: 'id_produk',
        select: showedField.field1,
      })
      .populate({
        path: 'id_satuan',
        select: showedField.field2,
      })
      .skip(skip)
      .limit(per_page);
  }

  async countAll(requestFilter: FilterQuery<FindAllProdukJasaDto>) {
    let filter: FilterQuery<ProdukJasa> = { deleted_at: null };

    // filter by search (like)
    if (requestFilter.search && requestFilter.search != '') {
      filter = {
        ...filter,
        nama: {
          $regex: requestFilter.search, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    // filter by id_produk
    if (requestFilter.id_produk && requestFilter.id_produk > 0) {
      // cari _id produk dari id_produk
      const produkData = await this.produkRepo.findOne({
        id: requestFilter.id_produk,
      });

      filter = { ...filter, id_produk: produkData ? produkData._id : null };
    }

    // filter by id_satuan
    if (requestFilter.id_satuan && requestFilter.id_satuan > 0) {
      // cari _id satuan dari id_satuan
      const satuanData = await this.satuanRepo.findOne({
        id: requestFilter.id_satuan,
      });

      filter = { ...filter, id_satuan: satuanData ? satuanData._id : null };
    }

    return await this.produkJasaModel.countDocuments(filter);
  }
}
