import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  HistoryBahanKeluar,
  HistoryBahanKeluarDocument,
} from '../schemas/history_bahan_keluar.schema';
import {
  HistoryBahanKeluarDetail,
  HistoryBahanKeluarDetailDocument,
} from '../schemas/history_bahan_keluar_detail.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import {
  HistoryBahanKeluarDetailDatabaseInput,
  HistoryKeluarDtoDatabaseInput,
} from 'src/history-bahan-keluar/dto/response.interface';
import {
  FindAllHistoryBahanKeluarDto,
  HistoryBahanKeluarDetailDto,
  LaporanStokBahanKeluarDto,
} from 'src/history-bahan-keluar/dto/create-history-bahan-keluar.dto';
import { HelperService } from 'src/helper/helper.service';
import { HistoryBahanMasukRepository } from './historyBahanMasuk.repository';
import { SatuanRepository } from './satuan.repository';
import { HistoryBahanMasukDetailUpdateDatabaseInput } from 'src/history-masuk/dto/response.interface';
import { KaryawanRepository } from './karyawan.repository';
import { ProyekProdukRepository } from './proyek_produk.repository';
import path from 'path';
import { CustomerRepository } from './customer.repository';
import { ProyekRepository } from './proyek.repository';
import { populate } from 'dotenv';

@Injectable()
export class HistoryBahanKeluarRepository {
  constructor(
    @InjectModel(HistoryBahanKeluar.name)
    private readonly historyBahanKeluarModel: Model<HistoryBahanKeluarDocument>,
    @InjectModel(HistoryBahanKeluarDetail.name)
    private readonly historyBahanKeluarDetailModel: Model<HistoryBahanKeluarDetailDocument>,
    private readonly helperService: HelperService,
    private readonly historyBahanMasukRepo: HistoryBahanMasukRepository,
    private readonly satuanRepo: SatuanRepository,
    private readonly karyawanRepo: KaryawanRepository,
    private readonly proyekProdukRepo: ProyekProdukRepository,
    private readonly customerRepo: CustomerRepository,
    private readonly proyekRepo: ProyekRepository,
  ) {}

  // =======================   GENERIC FUNCTION  =======================
  async create(historyBahanKeluarData: Partial<HistoryKeluarDtoDatabaseInput>) {
    try {
      // buat history bahan masuk
      const newHistoryBahanKeluar = new this.historyBahanKeluarModel({
        id_proyek_produk: historyBahanKeluarData.id_proyek_produk,
        id_karyawan: historyBahanKeluarData.id_karyawan,
      });
      await newHistoryBahanKeluar.save();

      // buat history bahan masuk detail

      /*
        NOTE: kalau pakai insertMany, auto increment id tidak akan berjalan
      */

      //   // cari id terakhir
      //   let lastID = await this.findLastID();

      //   // mapping history bahan keluar detail input ke array
      //   const historyBahanKeluarDetailInput = historyBahanMasukData.detail.map(
      //     (h) => {
      //       const historyBahanKeluarDetail: HistoryBahanKeluarDetailDatabaseInput =
      //         {
      //           id: lastID++,
      //           id_history_bahan_keluar:
      //             newHistoryBahanKeluar._id as Types.ObjectId,
      //           id_history_bahan_masuk_detail: h.id_history_bahan_masuk_detail,
      //           id_satuan: h.id_satuan,
      //           qty: h.qty,
      //         };
      //       return historyBahanKeluarDetail;
      //     },
      //   );

      //   const newHistoryBahanKeluarDetail =
      //     await this.historyBahanKeluarDetailModel.insertMany(
      //       historyBahanKeluarDetailInput,
      //     );

      for (let i = 0; i < historyBahanKeluarData.detail.length; i++) {
        const d = historyBahanKeluarData.detail[i];

        // buat history bahan masuk detail
        const newHistoryBahanMasukDetail =
          new this.historyBahanKeluarDetailModel({
            id_history_bahan_keluar:
              newHistoryBahanKeluar._id as Types.ObjectId,
            id_history_bahan_masuk_detail: d.id_history_bahan_masuk_detail,
            id_satuan: d.id_satuan,
            qty: d.qty,
          });
        await newHistoryBahanMasukDetail.save();
      }

      return newHistoryBahanKeluar;
    } catch (error) {
      console.error(
        'Error creating bahan keluar atau bahan keluar detail:',
        error,
      );
      throw new Error('Failed to create bahan keluar atau bahan keluar detail');
    }
  }

  async findAll(
    requestFilter: FilterQuery<HistoryBahanKeluar>,
    showedField: any,
  ) {
    let filter: FilterQuery<HistoryBahanKeluar> = { deleted_at: null };

    filter = { ...filter, ...requestFilter };

    return await this.historyBahanKeluarModel
      .find(filter, showedField.main)
      .populate({
        path: 'id_proyek_produk',
        select: showedField.field1,
        populate: [
          { path: 'id_proyek', select: showedField.nestedField1 },
          { path: 'id_produk', select: showedField.nestedField2 },
        ],
      })
      .populate({ path: 'id_karyawan', select: showedField.field2 });
  }

  async findOne(
    requestFilter: FilterQuery<HistoryBahanKeluar>,
    showedField: any,
  ) {
    return await this.historyBahanKeluarModel
      .findOne(requestFilter, showedField.main)
      .populate({
        path: 'id_proyek_produk',
        select: showedField.field1,
        populate: [
          { path: 'id_proyek', select: showedField.nestedField1 },
          { path: 'id_produk', select: showedField.nestedField2 },
        ],
      })
      .populate({ path: 'id_karyawan', select: showedField.field2 });
  }

  async findLastID() {
    // cari data terakhir
    const lastData = await this.historyBahanKeluarModel
      .findOne()
      .sort({ created_at: -1 })
      .limit(1);

    // jika tidak ada data sama sekali
    if (!lastData) {
      return 0;
    }

    return lastData[0].id;
  }

  // ======================= NON-GENERIC FUNCTION  =======================

  async findAllPagination(
    requestFilter: FilterQuery<FindAllHistoryBahanKeluarDto>,
    paginationQuery: any,
    showedField: any,
  ) {
    let filter: FilterQuery<HistoryBahanKeluar> = { deleted_at: null };

    // filter berdasarkan id_proyek_produk
    if (requestFilter.id_proyek_produk && requestFilter.id_proyek_produk > 0) {
      const proyekProdukData = await this.proyekProdukRepo.findOne(
        {
          id: requestFilter.id_proyek_produk,
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

      filter = {
        ...filter,
        id_proyek_produk: proyekProdukData._id as Types.ObjectId,
      };
    }

    // filter berdasarkan id_karyawan
    if (requestFilter.id_karyawan && requestFilter.id_karyawan > 0) {
      const karyawanData = await this.karyawanRepo.findOne({
        id: requestFilter.id_karyawan,
        deleted_at: null,
      });
      filter = { ...filter, id_karyawan: karyawanData._id as Types.ObjectId };
    }

    // ini untuk paginationnya
    const { page, per_page } = paginationQuery;
    // skip untuk mulai dari data ke berapa (mirip OFFSET pada SQL)
    const skip = (page - 1) * per_page;

    return await this.historyBahanKeluarModel
      .find(filter, showedField.main)
      .populate({
        path: 'id_proyek_produk',
        select: showedField.field1,
        populate: [
          { path: 'id_proyek', select: showedField.nestedField1 },
          { path: 'id_produk', select: showedField.nestedField2 },
        ],
      })
      .populate({ path: 'id_karyawan', select: showedField.field2 })
      .skip(skip)
      .limit(per_page);
  }

  async countAll(requestFilter: FilterQuery<FindAllHistoryBahanKeluarDto>) {
    let filter: FilterQuery<HistoryBahanKeluar> = { deleted_at: null };

    // filter berdasarkan id_proyek_produk
    if (requestFilter.id_proyek_produk && requestFilter.id_proyek_produk > 0) {
      const proyekProdukData = await this.proyekProdukRepo.findOne(
        {
          id: requestFilter.id_proyek_produk,
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

      filter = {
        ...filter,
        id_proyek_produk: proyekProdukData._id as Types.ObjectId,
      };
    }

    // filter berdasarkan id_karyawan
    if (requestFilter.id_karyawan && requestFilter.id_karyawan > 0) {
      const karyawanData = await this.karyawanRepo.findOne({
        id: requestFilter.id_karyawan,
        deleted_at: null,
      });
      filter = { ...filter, id_karyawan: karyawanData._id as Types.ObjectId };
    }

    return await this.historyBahanKeluarModel.countDocuments(filter);
  }

  async findOneByHistoryBahanKeluarByID(
    requestFilter: FilterQuery<HistoryBahanKeluar>,
    showedField: any,
  ) {
    const historyBahanKeluarData = await this.findOne(requestFilter, {
      main: {},
      field1: 'id',
      nestedField1: 'id nama',
      nestedField2: 'id nama',
      field2: 'id nama',
    });

    const historyBahanKeluarDetailData =
      await this.historyBahanKeluarDetailModel
        .find(
          {
            id_history_bahan_keluar: historyBahanKeluarData._id,
            deleted_at: null,
          },
          showedField.main,
        )
        .populate({
          path: 'id_history_bahan_masuk_detail',
          select: showedField.field1,
          populate: { path: 'id_bahan', select: showedField.nestedField1 },
        })
        .populate({
          path: 'id_satuan',
          select: showedField.field2,
        });

    return historyBahanKeluarDetailData;
  }

  async laporanStokBahanKeluar(
    requestFilter: FilterQuery<LaporanStokBahanKeluarDto>,
    showedField: any,
  ) {
    let filter: FilterQuery<HistoryBahanKeluarDetail> = { deleted_at: null };

    // filter berdasarkan start_date dan end_date
    if (requestFilter.start_date != null && requestFilter.end_date != null) {
      // waktu hasil dari new Date() pada validasi otomatis di set ke 00:00:00.000
      // jadi waktu start_date tidak perlu di set

      // set waktu end_date ke 23:59:59.999
      requestFilter.end_date.setUTCHours(23, 59, 59, 999);

      filter = {
        ...filter,
        created_at: {
          $gte: requestFilter.start_date,
          $lte: requestFilter.end_date,
        },
      };
    }

    // filter berdasarkan nama customer
    if (requestFilter.id_customer && requestFilter.id_customer > 0) {
      // cari _id customer
      const customerData = await this.customerRepo.findOne({
        id: requestFilter.id_customer,
        deleted_at: null,
      });

      // cari semua _id proyek yang dimiliki customer
      const proyekData = await this.proyekRepo.findAll(
        {
          id_customer: customerData._id,
        },
        {
          main: { _id: 1, id: 1 },
          field1: '',
        },
      );

      const proyekIds = proyekData.map((p) => p._id);

      // cari semua proyek produk yang dimiliki proyek
      const proyekProdukData = await this.proyekProdukRepo.findAll(
        {
          id_proyek: { $in: proyekIds },
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
      const historyBahanKeluarData = await this.findAll(
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

      filter = {
        ...filter,
        id_history_bahan_keluar: { $in: historyBahanKeluarIds },
      };
    }

    return await this.historyBahanKeluarDetailModel
      .find(filter, showedField.main)
      .populate({
        path: 'id_history_bahan_keluar',
        select: showedField.field1,
        populate: [
          { path: 'id_karyawan', select: showedField.nestedField1 },
          {
            path: 'id_proyek_produk',
            select: showedField.nestedField2,
            populate: {
              path: 'id_proyek',
              select: showedField.nestedField3,
              populate: {
                path: 'id_customer',
                select: showedField.nestedField4,
              },
            },
          },
        ],
      })
      .populate({
        path: 'id_history_bahan_masuk_detail',
        select: showedField.field2,
        populate: {
          path: 'id_bahan',
          select: showedField.nestedField5,
        },
      })
      .populate({
        path: 'id_satuan',
        select: showedField.field3,
      });
  }

  async validateInputSatuanIds(
    historyBahanKeluarDetail: HistoryBahanKeluarDetailDto[],
  ) {
    // simpan seluruh id satuan dalam bentuk array
    let satuanIds = historyBahanKeluarDetail.map((d) => d.id_satuan);

    // dari seluruh id satuan, buang duplikatnya pake Set
    // kemudian diubah kembali ke array
    let uniqueSatuanIds = [...new Set(satuanIds)];

    // cek apakah id satuan exist
    let listSatuanData = await this.satuanRepo.findAll(
      {
        id: { $in: uniqueSatuanIds },
        // nama: '',
      },
      {
        id: 1,
        _id: 1,
        konversi: 1,
        satuan_terkecil: 1,
      },
    );

    if (listSatuanData.length != uniqueSatuanIds.length) {
      throw new NotFoundException('One of ID Satuan not found');
    }

    // buat mapping id satuan supaya bisa diformatting ke HistoryBahanKeluarDetailDatabaseInput
    let satuanMap: Map<number, any> = new Map();
    listSatuanData.forEach((s) => {
      satuanMap.set(s.id, {
        _id: s._id as Types.ObjectId,
        konversi: s.konversi,
        satuan_terkecil: s.satuan_terkecil,
      });
    });

    return satuanMap;
  }

  async validateHistoryBahanMasukIds(
    historyBahanKeluarDetail: HistoryBahanKeluarDetailDto[],
  ) {
    // simpan seluruh id bahan dalam bentuk array
    let historyBahanMasukDetailIds = historyBahanKeluarDetail.map(
      (d) => d.id_history_bahan_masuk_detail,
    );

    // cek apakah seluruh id bahan unique
    let isHistoryBahanMasukDetailIdsUnique = this.helperService.cekUnique(
      historyBahanMasukDetailIds,
    );

    if (!isHistoryBahanMasukDetailIdsUnique) {
      throw new BadRequestException('Seluruh bahan yang dipilih harus unique');
    }

    // cek apakah id history bahan masuk detail exist
    let listHistoryBahanMasukDetailData =
      await this.historyBahanMasukRepo.findAllDetail(
        {
          id: { $in: historyBahanMasukDetailIds },
        },
        {
          main: {},
          field1: 'id tgl_nota',
          nestedField1: 'id',
          field2: 'id nama',
          field3: 'id nama konversi satuan_terkecil',
        },
      );

    if (
      listHistoryBahanMasukDetailData.length !=
      historyBahanMasukDetailIds.length
    ) {
      throw new NotFoundException('One of ID Bahan not found');
    }

    // buat mapping id bahan supaya bisa diformatting ke HistoryBahanKeluarDetailDatabaseInput
    let historyBahanMasukDetailMap: Map<number, any> = new Map();
    listHistoryBahanMasukDetailData.forEach((s) => {
      historyBahanMasukDetailMap.set(s.id, {
        _id: s._id as Types.ObjectId,
        nama_bahan: s.id_bahan.nama,
        qtyPakai: s.qtyPakai,
        satuan_terkecil: s.id_satuan.satuan_terkecil,
        konversi: s.id_satuan.konversi,
      });
    });

    return historyBahanMasukDetailMap;
  }

  // validateDetailArray digunakan untuk validasi detail array, dan mengembalikannya dalam bentuk data yang siap dimasukkan ke database
  async validateDetailArray(
    historyBahanKeluarDetail: HistoryBahanKeluarDetailDto[],
  ): Promise<HistoryBahanKeluarDetailDatabaseInput[]> {
    let temp: HistoryBahanKeluarDetailDatabaseInput[] = [];

    // validasi seluruh input id history bahan masuk detail
    const historyBahanMasukDetailMap = await this.validateHistoryBahanMasukIds(
      historyBahanKeluarDetail,
    );

    console.log(
      '==================================== DEBUG ARRAY VALIDATION ====================================',
    );

    console.log('historyBahanKeluarDetail', historyBahanMasukDetailMap);

    // validasi seluruh input id satuan
    const satuanMap = await this.validateInputSatuanIds(
      historyBahanKeluarDetail,
    );

    console.log('satuanMap', satuanMap);

    // format ke HistoryBahanKeluarDetailDatabaseInput
    for (let i = 0; i < historyBahanKeluarDetail.length; i++) {
      const d = historyBahanKeluarDetail[i];

      let stokBahan = historyBahanMasukDetailMap.get(
        d.id_history_bahan_masuk_detail,
      );
      let inputSatuan = satuanMap.get(d.id_satuan);

      console.log('qtyInput', d.qty * inputSatuan.konversi);
      console.log('qtyStok', stokBahan.qtyPakai);

      // cek qty bahan yang keluar valid atau tidak
      if (d.qty * inputSatuan.konversi > stokBahan.qtyPakai) {
        throw new BadRequestException(
          `input Qty ${stokBahan.nama_bahan} melebihi qty stok bahan`,
        );
      }

      // cek satuan terkecil input sama atau tidak dengan satuan terkecil stok bahan
      if (inputSatuan.satuan_terkecil != stokBahan.satuan_terkecil) {
        throw new BadRequestException(
          `input unit satuan ${stokBahan.nama_bahan} tidak sama dengan unit satuan stok bahan (${inputSatuan.satuan_terkecil} dengan ${stokBahan.satuan_terkecil})`,
        );
      }

      const newNotaDetail: HistoryBahanKeluarDetailDatabaseInput = {
        id_history_bahan_masuk_detail: stokBahan._id as Types.ObjectId,
        id_satuan: inputSatuan._id as Types.ObjectId,
        qty: d.qty,
      };

      temp.push(newNotaDetail);
    }
    return temp;
  }

  async updateStokBahanMasukDetail(
    historyBahanKeluarDetail: HistoryBahanKeluarDetailDto[],
  ) {
    // validasi seluruh input id history bahan masuk detail
    const historyBahanMasukDetailMap = await this.validateHistoryBahanMasukIds(
      historyBahanKeluarDetail,
    );

    // validasi seluruh input id satuan
    const satuanMap = await this.validateInputSatuanIds(
      historyBahanKeluarDetail,
    );

    // console.log('historyBahanMasukDetailMap', historyBahanMasukDetailMap);
    // console.log('historyBahanKeluarDetail', historyBahanKeluarDetail);

    // buat mapping listHistoryBahanMasukDetailData untuk input update
    let hasil = historyBahanKeluarDetail.map((d) => {
      const stokBahan = historyBahanMasukDetailMap.get(
        d.id_history_bahan_masuk_detail,
      );
      const inputSatuan = satuanMap.get(d.id_satuan);
      const updatedData: HistoryBahanMasukDetailUpdateDatabaseInput = {
        id: d.id_history_bahan_masuk_detail,
        qtyPakai: stokBahan.qtyPakai - d.qty * inputSatuan.konversi,
      };
      return updatedData;
    });

    console.log('hasil', hasil);

    return await this.historyBahanMasukRepo.updateQtyStokBatch(hasil);
  }
}
