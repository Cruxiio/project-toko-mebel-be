import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, FilterQuery, Model, Types } from 'mongoose';
import {
  HistoryBahanMasuk,
  HistoryBahanMasukDocument,
} from '../schemas/history_bahan_masuk.schema';
import { SatuanRepository } from './satuan.repository';
import { BahanRepository } from './bahan.repository';
import {
  CreateHistoryMasukDto,
  FindAllStokDto,
  HistoryBahanMasukDetailDto,
} from 'src/history-masuk/dto/create-history-masuk.dto';
import {
  HistoryBahanMasukDetailDatabaseInput,
  HistoryBahanMasukDetailUpdateDatabaseInput,
  HistoryMasukDtoDatabaseInput,
} from 'src/history-masuk/dto/response.interface';
import {
  HistoryBahanMasukDetail,
  HistoryBahanMasukDetailDocument,
} from '../schemas/history_bahan_masuk_detail.schema';
import { SupplierRepository } from './supplier.repository';
import { MasterFindAllStokDto } from 'src/master/dto/create-master.dto';
import { ProyekProdukRepository } from './proyek_produk.repository';
import { ProdukRepository } from './produk.repository';
import { HelperService } from 'src/helper/helper.service';

@Injectable()
export class HistoryBahanMasukRepository {
  constructor(
    @InjectModel(HistoryBahanMasuk.name)
    private readonly historyBahanMasukModel: Model<HistoryBahanMasukDocument>,
    @InjectModel(HistoryBahanMasukDetail.name)
    private readonly historyBahanMasukModelDetail: Model<HistoryBahanMasukDetailDocument>,
    private readonly satuanRepo: SatuanRepository,
    private readonly bahanRepo: BahanRepository,
    private readonly supplierRepo: SupplierRepository,
    private readonly proyekProdukRepo: ProyekProdukRepository,
    private readonly produkRepo: ProdukRepository,
    private readonly helperService: HelperService,
  ) {}

  async findOne(historyBahanMasukFilterQuery: FilterQuery<HistoryBahanMasuk>) {
    const HistoryBahanMasukData = await this.historyBahanMasukModel.findOne(
      historyBahanMasukFilterQuery,
    );
    return HistoryBahanMasukData;
  }

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

    // ini untuk paginationnya
    const { page, per_page } = paginationQuery;
    // skip untuk mulai dari data ke berapa (mirip OFFSET pada SQL)
    const skip = (page - 1) * per_page;

    return await this.historyBahanMasukModel
      .find(filter, showedField)
      .populate({
        path: 'id_supplier',
        select: 'id',
      })
      .skip(skip)
      .limit(per_page);
  }

  // ini buat dapetin seluruh jumlah data berdasarkan syarat filter
  async countAll(historyBahanMasukFilterQuery: FilterQuery<HistoryBahanMasuk>) {
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

    return await this.historyBahanMasukModel.countDocuments(filter);
  }

  async create(historyBahanMasukData: Partial<HistoryMasukDtoDatabaseInput>) {
    try {
      // buat history bahan masuk
      const newHistoryBahanMasuk = new this.historyBahanMasukModel({
        id_supplier: historyBahanMasukData.id_supplier,
        kode_nota: historyBahanMasukData.kode_nota,
        tgl_nota: historyBahanMasukData.tgl_nota,
        no_spb: historyBahanMasukData.no_spb,
      });
      await newHistoryBahanMasuk.save();

      // // buat history bahan masuk detail
      for (let i = 0; i < historyBahanMasukData.detail.length; i++) {
        const d = historyBahanMasukData.detail[i];

        // buat history bahan masuk detail
        const newHistoryBahanMasukDetail =
          new this.historyBahanMasukModelDetail({
            id_history_bahan_masuk: newHistoryBahanMasuk._id as Types.ObjectId,
            id_bahan: d.id_bahan,
            id_satuan: d.id_satuan,
            qty: d.qty,
            qtyPakai: d.qtyPakai,
          });
        await newHistoryBahanMasukDetail.save();
      }

      return newHistoryBahanMasuk;
    } catch (error) {
      console.error(
        'Error creating bahan masuk atau bahan masuk detail:',
        error,
      );
      throw new Error('Failed to create bahan masuk atau bahan masuk detail');
    }
  }

  async update(
    historyBahanMasukFilterQuery: FilterQuery<HistoryBahanMasuk>,
    historyBahanMasukData: Partial<HistoryMasukDtoDatabaseInput>,
  ) {
    try {
      // delete history bahan masuk yang lama
      const oldHistoryBahanMasukData =
        await this.historyBahanMasukModel.findOneAndUpdate(
          historyBahanMasukFilterQuery,
          { deleted_at: new Date() },
          { new: true }, // option new: true supaya hasil find one merupakan data setelah diupdate
        );

      // delete history bahan masuk detail yang lama
      await this.historyBahanMasukModelDetail.updateMany(
        {
          id_history_bahan_masuk: oldHistoryBahanMasukData._id,
        },
        { deleted_at: new Date() },
      );

      // buat history bahan masuk dan history bahan masuk detail baru
      const newHistoryBahanMasuk = await this.create(historyBahanMasukData);

      return newHistoryBahanMasuk;
    } catch (error) {
      console.error('Error update bahan masuk atau bahan masuk detail:', error);
      throw new Error('Failed to update bahan masuk atau bahan masuk detail');
    }
  }

  // ini buat find history bahan masuk detail by history bahan masuk detail  id
  async findOneHistoryBahanMasukDetail(
    historyBahanMasukDetailFilterQuery: FilterQuery<HistoryBahanMasukDetail>,
    showedField: any,
  ) {
    return await this.historyBahanMasukModelDetail
      .findOne(historyBahanMasukDetailFilterQuery, showedField.main)
      .populate({
        path: 'id_history_bahan_masuk', // Populate data id_history_bahan_masuk
        select: showedField.field1, // Ambil hanya field id dari koleksi
        populate: {
          path: 'id_supplier', // Populate data supplier
          select: showedField.nestedField1, // Ambil hanya field id dari koleksi
        },
      })
      .populate({
        path: 'id_bahan', // Populate data bahan
        select: showedField.field2, // Ambil hanya field id dari koleksi Bahan
      })
      .populate({
        path: 'id_satuan', // Populate data satuan
        select: showedField.field3, // Ambil hanya field id dari koleksi Satuan
      });
  }

  // =============== FUNC NON-GENERIC ===============

  async findAllDetailByHistoryBahanMasukID(
    historyBahanMasukFilterQuery: FilterQuery<HistoryBahanMasuk>,
    showedField: any,
  ) {
    // cari data history bahan masuk
    const historyBahanMasukData = await this.findOne(
      historyBahanMasukFilterQuery,
    );

    // cari seluruh history bahan masuk detail berdasarkan id history bahan masuk
    return await this.historyBahanMasukModelDetail
      .find(
        { id_history_bahan_masuk: historyBahanMasukData._id, deleted_at: null },
        showedField.main,
      )
      .populate({
        path: 'id_bahan', // Populate data bahan
        select: showedField.field1, // Ambil hanya field id dari koleksi Bahan
      })
      .populate({
        path: 'id_satuan', // Populate data satuan
        select: showedField.field2, // Ambil hanya field id dari koleksi Satuan
      });
  }

  async findAllDetail(
    stokFilterQuery: FilterQuery<HistoryBahanMasukDetail>,
    showedField: any,
  ) {
    let filter: FilterQuery<HistoryBahanMasukDetail> = {
      deleted_at: null,
      qtyPakai: { $gt: 0 },
    };

    filter = { ...filter, ...stokFilterQuery };

    return await this.historyBahanMasukModelDetail
      .find(filter, showedField.main)
      .populate({
        path: 'id_history_bahan_masuk', // Populate data bahan
        select: showedField.field1, // Ambil hanya field id dari koleksi history_bahan_masuk
        populate: {
          path: 'id_supplier', // Populate data supplier
          select: showedField.nestedField1,
        },
      })
      .populate({
        path: 'id_bahan', // Populate data bahan
        select: showedField.field2, // Ambil hanya field id dari koleksi Bahan
      })
      .populate({
        path: 'id_satuan', // Populate data satuan
        select: showedField.field3, // Ambil hanya field id dari koleksi Satuan
      });
  }

  async updateQtyStokBatch(
    stokData: HistoryBahanMasukDetailUpdateDatabaseInput[],
  ) {
    const bulkOps = stokData.map((item) => ({
      updateOne: {
        filter: { id: item.id }, // Filter berdasarkan id produk
        update: { $set: { qtyPakai: item.qtyPakai } }, // Set stok baru
      },
    }));

    return await this.historyBahanMasukModelDetail.bulkWrite(bulkOps); // Eksekusi bulkWrite
  }

  // findAllHistoryBahanMasukDetail untuk tampilin stok sekarang berdasarkan tanggal nota/surat jalan
  async findAllStok(
    StokFilterQuery: FilterQuery<FindAllStokDto>,
    paginationQuery: any,
    showedField: any,
  ) {
    let filter: FilterQuery<HistoryBahanMasukDetail> = {
      deleted_at: null,
      qtyPakai: { $gt: 0 },
    };

    if (StokFilterQuery.search != '') {
      // cari seluruh nama bahan yang mengandung keyword search
      let bahanData = await this.bahanRepo.findAllWithoutPagination(
        {
          nama: {
            $regex: StokFilterQuery.search, // like isi regex
            $options: 'i', // i artinya case-insensitive
          },
        },
        { _id: 1 },
      );

      // tambahkan seluruh _id bahan yang namanya mengandung keyword search ke filter
      filter = {
        ...filter,
        id_bahan: {
          $in: bahanData,
        },
      };
    }

    if (StokFilterQuery.tgl_nota != null) {
      // ubah ke format date
      const tglNota = new Date(StokFilterQuery.tgl_nota);
      // cek apakah valid atau tidak
      const notValid = isNaN(tglNota.getTime());

      // cari seluruh history bahan masuk yang tgl nota = request tgl nota
      let historyBahanMasukData = await this.historyBahanMasukModel.find(
        {
          deleted_at: null,
          tgl_nota: notValid ? null : tglNota,
        },
        { _id: 1 },
      );

      // tambahkan seluruh _id history bahan masuk yang sesuai dengan request tgl nota
      filter = {
        ...filter,
        id_history_bahan_masuk: {
          $in: historyBahanMasukData,
        },
      };
    }

    if (StokFilterQuery.id_supplier > 0) {
      let supplierData = await this.supplierRepo.findOne({
        id: StokFilterQuery.id_supplier,
        deleted_at: null,
      });

      // cari seluruh history bahan masuk yang tgl nota = request tgl nota
      let historyBahanMasukData = await this.historyBahanMasukModel.find(
        {
          deleted_at: null,
          id_supplier: supplierData ? supplierData._id : null,
        },
        { _id: 1 },
      );

      filter = {
        ...filter,
        id_history_bahan_masuk: {
          $in: historyBahanMasukData,
        },
      };
    }

    // ini untuk paginationnya
    const { page, per_page } = paginationQuery;
    // skip untuk mulai dari data ke berapa (mirip OFFSET pada SQL)
    const skip = (page - 1) * per_page;

    return await this.historyBahanMasukModelDetail
      .find(filter, showedField.main)
      .populate({
        path: 'id_history_bahan_masuk', // Populate data bahan
        select: showedField.field1, // Ambil hanya field id dari koleksi history_bahan_masuk
        populate: {
          path: 'id_supplier', // Populate data supplier
          select: showedField.nestedField1,
        },
      })
      .populate({
        path: 'id_bahan', // Populate data bahan
        select: showedField.field2, // Ambil hanya field id dari koleksi Bahan
      })
      .populate({
        path: 'id_satuan', // Populate data satuan
        select: showedField.field3, // Ambil hanya field id dari koleksi Satuan
      })
      .skip(skip)
      .limit(per_page);
  }

  async countAllStok(StokFilterQuery: FilterQuery<FindAllStokDto>) {
    let filter: FilterQuery<HistoryBahanMasukDetail> = {
      deleted_at: null,
      qtyPakai: { $gt: 0 },
    };

    if (StokFilterQuery.search != '') {
      // cari seluruh nama bahan yang mengandung keyword search
      let bahanData = await this.bahanRepo.findAllWithoutPagination(
        {
          nama: {
            $regex: StokFilterQuery.search, // like isi regex
            $options: 'i', // i artinya case-insensitive
          },
        },
        { _id: 1 },
      );

      // tambahkan seluruh _id bahan yang namanya mengandung keyword search ke filter
      filter = {
        ...filter,
        id_bahan: {
          $in: bahanData,
        },
      };
    }

    if (StokFilterQuery.tgl_nota != null) {
      // ubah ke format date
      const tglNota = new Date(StokFilterQuery.tgl_nota);
      // cek apakah valid atau tidak
      const notValid = isNaN(tglNota.getTime());

      // cari seluruh history bahan masuk yang tgl nota = request tgl nota
      let historyBahanMasukData = await this.historyBahanMasukModel.find(
        {
          deleted_at: null,
          tgl_nota: notValid ? null : tglNota,
        },
        { _id: 1 },
      );

      // tambahkan seluruh _id history bahan masuk yang sesuai dengan request tgl nota
      filter = {
        ...filter,
        id_history_bahan_masuk: {
          $in: historyBahanMasukData,
        },
      };
    }

    if (StokFilterQuery.id_supplier > 0) {
      let supplierData = await this.supplierRepo.findOne({
        id: StokFilterQuery.id_supplier,
        deleted_at: null,
      });

      filter = {
        ...filter,
        id_supplier: supplierData ? supplierData._id : null,
      };
    }

    return this.historyBahanMasukModelDetail.countDocuments(filter);
  }

  async masterFindAllStok(
    stokFilterQuery: FilterQuery<MasterFindAllStokDto>,
    showedField: any,
  ) {
    let filter: FilterQuery<HistoryBahanMasukDetail> = {
      deleted_at: null,
      qtyPakai: { $gt: 0 },
    };

    let filterBahan: any = {};

    if (stokFilterQuery.id_proyek_produk > 0) {
      // cari produk id dari proyek produk
      let proyekProdukData = await this.proyekProdukRepo.findOne(
        {
          id: stokFilterQuery.id_proyek_produk,
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

      // ambil seluruh id bahan dari detail produk
      let detailBahanIds = produkData
        ? produkData.detail.map((item) => item.id_bahan.id)
        : [];

      // tambahkan seluruh id bahan dari detail produk ke filterBahan
      filterBahan = { ...filterBahan, id: { $in: detailBahanIds } };
    }

    if (stokFilterQuery.search != '') {
      // tambahkan keyword ke filterBahan
      filterBahan = {
        ...filterBahan,
        nama: {
          $regex: stokFilterQuery.search, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    // cari seluruh nama bahan yang mengandung keyword search
    let bahanData = await this.bahanRepo.findAllWithoutPagination(filterBahan, {
      _id: 1,
    });

    // tambahkan _id bahan hasil filterBahan ke filter
    filter = {
      ...filter,
      id_bahan: {
        $in: bahanData,
      },
    };

    return await this.historyBahanMasukModelDetail
      .find(filter, showedField.main)
      .populate({
        path: 'id_history_bahan_masuk', // Populate data bahan
        select: showedField.field1, // Ambil hanya field id dari koleksi history_bahan_masuk
        populate: {
          path: 'id_supplier', // Populate data supplier
          select: showedField.nestedField1,
        },
      })
      .populate({
        path: 'id_bahan', // Populate data bahan
        select: showedField.field2, // Ambil hanya field id dari koleksi Bahan
      })
      .populate({
        path: 'id_satuan', // Populate data satuan
        select: showedField.field3, // Ambil hanya field id dari koleksi Satuan
      });
  }

  // validateDetailArray digunakan untuk validasi detail array, dan mengembalikannya dalam bentuk data yang siap dimasukkan ke database
  async validateDetailArray(
    historyBahanMasukDetail: HistoryBahanMasukDetailDto[],
  ): Promise<HistoryBahanMasukDetailDatabaseInput[]> {
    let temp: HistoryBahanMasukDetailDatabaseInput[] = [];

    // simpan seluruh id bahan dalam bentuk array
    let bahanIds = historyBahanMasukDetail.map((d) => d.id_bahan);

    // cek apakah seluruh id bahan unique
    let isBahanIdsUnique = this.helperService.cekUnique(bahanIds);

    if (!isBahanIdsUnique) {
      throw new BadRequestException('Seluruh bahan yang dipilih harus unique');
    }

    // cek apakah id bahan exist
    let listBahanData = await this.bahanRepo.findAllWithoutPagination(
      {
        id: { $in: bahanIds },
      },
      {
        id: 1,
        _id: 1,
      },
    );

    if (listBahanData.length != bahanIds.length) {
      throw new NotFoundException('One of ID Bahan not found');
    }

    // buat mapping id bahan supaya bisa diformatting ke ProdukDetailDatabaseInput
    let bahanMap: Map<number, Types.ObjectId> = new Map();
    listBahanData.forEach((s) => {
      bahanMap.set(s.id, s._id as Types.ObjectId);
    });

    // simpan seluruh id satuan dalam bentuk array
    let satuanIds = historyBahanMasukDetail.map((d) => d.id_satuan);

    // dari seluruh id satuan, buang duplikatnya pake Set
    // kemudian diubah kembali ke array
    let uniqueSatuanIds = [...new Set(satuanIds)];

    // cek apakah id satuan exist
    let listSatuanData = await this.satuanRepo.findAll(
      {
        id: { $in: uniqueSatuanIds },
      },
      {
        id: 1,
        _id: 1,
        konversi: 1,
      },
    );

    if (listSatuanData.length != uniqueSatuanIds.length) {
      throw new NotFoundException('One of ID Satuan not found');
    }

    // buat mapping id satuan supaya bisa diformatting ke ProdukDetailDatabaseInput
    let satuanMap: Map<number, any> = new Map();
    listSatuanData.forEach((s) => {
      satuanMap.set(s.id, {
        _id: s._id as Types.ObjectId,
        konversi: s.konversi,
      });
    });

    // format ke ProdukDetailDatabaseInput
    for (let i = 0; i < historyBahanMasukDetail.length; i++) {
      const d = historyBahanMasukDetail[i];

      const satuanData = satuanMap.get(d.id_satuan);

      const newHistroyBahanMasukDetail: HistoryBahanMasukDetailDatabaseInput = {
        id_bahan: bahanMap.get(d.id_bahan) as Types.ObjectId,
        id_satuan: satuanData._id as Types.ObjectId,
        qty: d.qty,
        qtyPakai: d.qty * satuanData.konversi,
      };

      temp.push(newHistroyBahanMasukDetail);
    }

    return temp;
  }
}
