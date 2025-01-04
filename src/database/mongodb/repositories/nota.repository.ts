import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import {
  HistoryBahanMasuk,
  HistoryBahanMasukDocument,
} from '../schemas/history_bahan_masuk.schema';
import { SatuanRepository } from './satuan.repository';
import { BahanRepository } from './bahan.repository';
import { HistoryBahanMasukDetailData } from 'src/history-masuk/dto/response.interface';
import { SupplierRepository } from './supplier.repository';
import { Nota, NotaDocument } from '../schemas/nota.schema';
import { FindAllNotaDto, NotaDetailDto } from 'src/nota/dto/create-nota.dto';
import {
  NotaDetailDatabaseInput,
  NotaDtoDatabaseInput,
} from 'src/nota/dto/response.interface';

@Injectable()
export class NotaRepository {
  constructor(
    @InjectModel(Nota.name)
    private readonly notaModel: Model<NotaDocument>,
    @InjectModel(HistoryBahanMasuk.name)
    private readonly historyBahanMasukModel: Model<HistoryBahanMasukDocument>,
    private readonly satuanRepo: SatuanRepository,
    private readonly bahanRepo: BahanRepository,
    private readonly supplierRepo: SupplierRepository,
  ) {}

  async findOne(notaFilterQuery: FilterQuery<Nota>) {
    const notaData = await this.notaModel.findOne(notaFilterQuery);
    return notaData;
  }

  // MASIH NDA NDE PAKE
  async findAll(
    historyBahanMasukFilterQuery: FilterQuery<HistoryBahanMasuk>,
    paginationQuery: any,
    showedField: any,
  ) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<HistoryBahanMasuk> = { deleted_at: null };

    if (historyBahanMasukFilterQuery.kode_nota != '') {
      filter = {
        ...filter,
        kode_nota: {
          $regex: historyBahanMasukFilterQuery.kode_nota, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    if (historyBahanMasukFilterQuery.id_supplier != null) {
      let supplierData = await this.supplierRepo.findOne({
        id: historyBahanMasukFilterQuery.id_supplier,
        deleted_at: null,
      });

      filter = {
        ...filter,
        id_supplier: supplierData ? supplierData._id : null,
      };
    }

    if (historyBahanMasukFilterQuery.tgl_nota != null) {
      // ubah ke format date
      const tglNota = new Date(historyBahanMasukFilterQuery.tgl_nota);
      // cek apakah valid atau tidak
      const notValid = isNaN(tglNota.getTime());
      filter = {
        ...filter,
        tgl_nota: notValid ? null : tglNota,
      };
    }

    return await this.historyBahanMasukModel
      .find(filter, showedField)
      .populate({
        path: 'id_supplier',
        select: 'id',
      });
  }

  async create(notaData: Partial<NotaDtoDatabaseInput>) {
    try {
      // buat history bahan masuk
      const newNota = new this.notaModel({
        id_history_bahan_masuk: notaData.id_history_bahan_masuk,
        total_pajak: notaData.total_pajak,
        diskon_akhir: notaData.diskon_akhir,
        total_harga: notaData.total_harga,
        detail: notaData.detail,
      });
      await newNota.save();

      return newNota;
    } catch (error) {
      console.error('Error creating nota atau nota detail:', error);
      throw new Error('Failed to nota atau nota detail');
    }
  }

  async update(
    notaFilterQuery: FilterQuery<Nota>,
    notaData: Partial<NotaDtoDatabaseInput>,
  ) {
    try {
      const newNota = await this.notaModel.findOneAndUpdate(
        notaFilterQuery,
        notaData,
        { new: true }, // option new: true supaya hasil find one merupakan data setelah diupdate
      );

      return newNota;
    } catch (error) {
      console.error('Error update nota atau nota detail:', error);
      throw new Error('Failed to update nota atau nota detail');
    }
  }

  // FUNC NON-GENERIC

  async findOneNota(notaFilterQuery: FilterQuery<Nota>, showedField: any) {
    // cari seluruh history bahan masuk detail berdasarkan id history bahan masuk
    return await this.notaModel
      .findOne(notaFilterQuery, showedField.main)
      .populate({
        path: 'id_history_bahan_masuk', // Populate data bahan
        select: showedField.field1, // Ambil hanya field id dari koleksi history_bahan_masuk
        populate: {
          path: 'id_supplier', // Populate data supplier
          select: showedField.nestedField1, // Ambil hanya field id dari koleksi supplier
        },
      })
      .populate({
        path: 'detail.id_bahan', // Populate data bahan
        select: showedField.field2, // Ambil hanya field id dari koleksi bahan
      })
      .populate({
        path: 'detail.id_satuan', // Populate data satuan
        select: showedField.field3, // Ambil hanya field id dari koleksi satuan
      });
  }

  // findAllHistoryBahanMasukDetail untuk tampilin stok sekarang berdasarkan tanggal nota/surat jalan
  async findAllNota(
    notaFilterQuery: FilterQuery<FindAllNotaDto>,
    paginationQuery: any,
    showedField: any,
  ) {
    let filter: FilterQuery<FindAllNotaDto> = {
      deleted_at: null,
    };

    // digunakan untuk filter pada history bahan masuk
    //BAD PRACTICE PAKE ANY JANGAN DITIRU
    let tempFilter: any = {
      deleted_at: null,
    };

    if (notaFilterQuery.search != '') {
      tempFilter = {
        ...tempFilter,
        kode_nota: {
          $regex: notaFilterQuery.search, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    if (notaFilterQuery.tgl_nota != null) {
      // ubah ke format date
      const tglNota = new Date(notaFilterQuery.tgl_nota);
      // cek apakah valid atau tidak
      const notValid = isNaN(tglNota.getTime());

      tempFilter = {
        ...tempFilter,
        tgl_nota: notValid ? null : tglNota,
      };
    }

    if (notaFilterQuery.id_supplier > 0) {
      // cari supplier _id
      let supplierData = await this.supplierRepo.findOne({
        id: notaFilterQuery.id_supplier,
        deleted_at: null,
      });

      tempFilter = {
        ...tempFilter,
        id_supplier: supplierData ? supplierData._id : null,
      };
    }

    // cari history bahan masuk yang sesuai dengan tempFilter
    let historyBahanMasukData = await this.historyBahanMasukModel.find(
      tempFilter,
      { _id: 1 },
    );

    // tambahkan seluruh _id history bahan masuk yang sesuai dengan tempFilter
    filter = {
      ...filter,
      id_history_bahan_masuk: {
        $in: historyBahanMasukData,
      },
    };

    if (notaFilterQuery.tgl_input != null) {
      // ubah ke format date
      const tglInput = new Date(notaFilterQuery.tgl_input);
      // cek apakah valid atau tidak
      const notValid = isNaN(tglInput.getTime());

      let startDate = null;
      let endDate = null;
      if (!notValid) {
        startDate = new Date(tglInput.setHours(0, 0, 0, 0));
        endDate = new Date(tglInput.setHours(23, 59, 59, 999));
      }

      filter = {
        ...filter,
        created_at: notValid
          ? null
          : {
              $gte: startDate,
              $lte: endDate,
            },
      };
    }

    // ini untuk paginationnya
    const { page, per_page } = paginationQuery;
    // skip untuk mulai dari data ke berapa (mirip OFFSET pada SQL)
    const skip = (page - 1) * per_page;

    return await this.notaModel
      .find(filter, showedField.main)
      .populate({
        path: 'id_history_bahan_masuk', // Populate data bahan
        select: showedField.field1, // Ambil hanya field id dari koleksi history_bahan_masuk
        populate: {
          path: 'id_supplier', // Populate data supplier
          select: showedField.nestedField1,
        },
      })
      .skip(skip)
      .limit(per_page);
  }

  async countAllNota(notaFilterQuery: FilterQuery<FindAllNotaDto>) {
    let filter: FilterQuery<FindAllNotaDto> = {
      deleted_at: null,
    };

    // digunakan untuk filter pada history bahan masuk
    //BAD PRACTICE PAKE ANY JANGAN DITIRU
    let tempFilter: any = {
      deleted_at: null,
    };

    if (notaFilterQuery.search != '') {
      tempFilter = {
        ...tempFilter,
        kode_nota: notaFilterQuery.search,
      };
    }

    if (notaFilterQuery.tgl_nota != null) {
      // ubah ke format date
      const tglNota = new Date(notaFilterQuery.tgl_nota);
      // cek apakah valid atau tidak
      const notValid = isNaN(tglNota.getTime());

      tempFilter = {
        ...tempFilter,
        tgl_nota: notValid ? null : tglNota,
      };
    }

    if (notaFilterQuery.id_supplier > 0) {
      // cari supplier _id
      let supplierData = await this.supplierRepo.findOne({
        id: notaFilterQuery.id_supplier,
        deleted_at: null,
      });

      tempFilter = {
        ...tempFilter,
        id_supplier: supplierData ? supplierData._id : null,
      };
    }

    // cari history bahan masuk yang sesuai dengan tempFilter
    let historyBahanMasukData = await this.historyBahanMasukModel.find(
      tempFilter,
      { _id: 1 },
    );

    // tambahkan seluruh _id history bahan masuk yang sesuai dengan tempFilter
    filter = {
      ...filter,
      id_history_bahan_masuk: {
        $in: historyBahanMasukData,
      },
    };

    if (notaFilterQuery.tgl_input != null) {
      // ubah ke format date
      const tglInput = new Date(notaFilterQuery.tgl_input);
      // cek apakah valid atau tidak
      const notValid = isNaN(tglInput.getTime());

      let startDate = null;
      let endDate = null;
      if (!notValid) {
        startDate = new Date(tglInput.setHours(0, 0, 0, 0));
        endDate = new Date(tglInput.setHours(23, 59, 59, 999));
      }

      filter = {
        ...tempFilter,
        created_at: notValid
          ? null
          : {
              $gte: startDate,
              $lte: endDate,
            },
      };
    }

    return this.notaModel.countDocuments(filter);
  }

  // async masterFindAll(
  //   customerFilterQuery: FilterQuery<HistoryBahanMasuk>,
  //   paginationQuery: any,
  // ) {
  //   return await this.findAll(customerFilterQuery, paginationQuery, {
  //     id: 1,
  //     nama: 1,
  //     _id: 0,
  //   });
  // }

  // validateDetailArray digunakan untuk validasi detail array, dan mengembalikannya dalam bentuk data yang siap dimasukkan ke database
  /*
    TODO: ganti supaya validate id bahan dan satuan detail array nda satu2 di for loop
  */
  async validateDetailArray(
    notaDetail: NotaDetailDto[],
    historyBahanMasukDetail: HistoryBahanMasukDetailData[],
  ): Promise<NotaDetailDatabaseInput[]> {
    let temp: NotaDetailDatabaseInput[] = [];

    // cek apakah jumlah detail nota dan history bahan masuk detail sama
    if (notaDetail.length != historyBahanMasukDetail.length) {
      throw new BadRequestException(
        'Jumlah detail item pada nota tidak sesuai detail item pada stok bahan masuk',
      );
    }

    for (let i = 0; i < notaDetail.length; i++) {
      const d = notaDetail[i];

      //cek id_supplier valid
      let bahanData = await this.bahanRepo.findOne({
        id: d.id_bahan,
        deleted_at: null,
      });

      if (!bahanData) {
        throw new NotFoundException('Bahan not found');
      }

      //cek id_supplier valid
      let satuanData = await this.satuanRepo.findOne({
        id: d.id_satuan,
        deleted_at: null,
      });

      if (!satuanData) {
        throw new NotFoundException('Satuan not found');
      }

      // cek apakah isi detail nota sesuai history bahan masuk detail
      let ada = historyBahanMasukDetail.some(
        (h) =>
          h.id_bahan == d.id_bahan &&
          h.id_satuan == d.id_satuan &&
          h.qty == d.qty,
      );

      if (!ada) {
        throw new BadRequestException(
          'Detail nota tidak sesuai dengan detail history bahan masuk',
        );
      }

      // hitung total harga
      let subtotal = d.qty * d.harga_satuan;

      // hitung jumlah diskon
      let jumlahDiskon = (d.diskon / 100) * subtotal;

      // pastikan decimal jumlahDiskon maksimal 2 digit di belakang koma
      jumlahDiskon = parseFloat(jumlahDiskon.toFixed(2));

      subtotal = subtotal - jumlahDiskon;

      // pastikan decimal subtotal maksimal 2 digit di belakang koma
      subtotal = parseFloat(subtotal.toFixed(2));

      const newNotaDetail: NotaDetailDatabaseInput = {
        id_bahan: bahanData._id as Types.ObjectId,
        id_satuan: satuanData._id as Types.ObjectId,
        qty: d.qty,
        harga_satuan: d.harga_satuan,
        diskon: d.diskon,
        subtotal: subtotal,
      };

      temp.push(newNotaDetail);
    }

    return temp;
  }
}
