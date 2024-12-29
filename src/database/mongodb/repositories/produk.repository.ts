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
import { FindAllNotaDto, NotaDetailDto } from 'src/nota/dto/create-nota.dto';
import {
  NotaDetailDatabaseInput,
  NotaDtoDatabaseInput,
} from 'src/nota/dto/response.interface';
import { Produk, ProdukDocument } from '../schemas/produk.schema';
import {
  ProdukDetailArrayData,
  ProdukDetailDatabaseInput,
  ProdukDtoDatabaseInput,
} from 'src/produk/dto/response.interface';
import {
  DetailProdukDto,
  FindAllProdukDto,
} from 'src/produk/dto/create-produk.dto';
import { HelperService } from 'src/helper/helper.service';

@Injectable()
export class ProdukRepository {
  constructor(
    @InjectModel(Produk.name)
    private readonly produkModel: Model<ProdukDocument>,
    // @InjectModel(HistoryBahanMasuk.name)
    // private readonly historyBahanMasukModel: Model<HistoryBahanMasukDocument>,
    private readonly satuanRepo: SatuanRepository,
    private readonly bahanRepo: BahanRepository,
    private readonly helperService: HelperService,
  ) {}

  async findOne(produkFilterQuery: FilterQuery<Produk>) {
    const produkData = await this.produkModel.findOne(produkFilterQuery);
    return produkData;
  }

  async findAll(produkFilterQuery: FilterQuery<Produk>, showedField: any) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<Produk> = { deleted_at: null };

    if (produkFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: produkFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    return await this.produkModel.find(filter, showedField);
  }

  async create(produkData: Partial<ProdukDtoDatabaseInput>) {
    try {
      // buat produk
      const newProduk = new this.produkModel({
        nama: produkData.nama,
        detail: produkData.detail,
      });
      await newProduk.save();

      return newProduk;
    } catch (error) {
      console.error('Error creating produk atau produk detail:', error);
      throw new Error('Failed to produk atau produk detail');
    }
  }

  async update(
    produkFilterQuery: FilterQuery<Produk>,
    produkData: Partial<ProdukDtoDatabaseInput>,
  ) {
    try {
      const newProduk = await this.produkModel
        .findOneAndUpdate(
          produkFilterQuery,
          produkData,
          { new: true }, // option new: true supaya hasil find one merupakan data setelah diupdate
        )
        .populate({
          path: 'detail.id_bahan', // Populate data bahan
          select: 'id nama', // Ambil hanya field id dari koleksi bahan
        })
        .populate({
          path: 'detail.id_satuan', // Populate data satuan
          select: 'id nama', // Ambil hanya field id dari koleksi satuan
        });

      return newProduk;
    } catch (error) {
      console.error('Error update produk atau produk detail:', error);
      throw new Error('Failed to update produk atau produk detail');
    }
  }

  // FUNC NON-GENERIC

  async findOneProduk(
    produkFilterQuery: FilterQuery<Produk>,
    showedField: any,
  ) {
    // cari seluruh history bahan masuk detail berdasarkan id produk
    return await this.produkModel
      .findOne(produkFilterQuery, showedField.main)
      .populate({
        path: 'detail.id_bahan', // Populate data bahan
        select: showedField.field1, // Ambil hanya field id dari koleksi bahan
      })
      .populate({
        path: 'detail.id_satuan', // Populate data satuan
        select: showedField.field2, // Ambil hanya field id dari koleksi satuan
      });
  }

  // findAllHistoryBahanMasukDetail untuk tampilin stok sekarang berdasarkan tanggal nota/surat jalan
  async findAllProduk(
    produkFilterQuery: FilterQuery<FindAllProdukDto>,
    paginationQuery: any,
    showedField: any,
  ) {
    let filter: FilterQuery<FindAllProdukDto> = {
      deleted_at: null,
    };

    if (produkFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: produkFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    // ini untuk paginationnya
    const { page, per_page } = paginationQuery;
    // skip untuk mulai dari data ke berapa (mirip OFFSET pada SQL)
    const skip = (page - 1) * per_page;

    return await this.produkModel
      .find(filter, showedField.main)
      .skip(skip)
      .limit(per_page);
  }

  async countAllNota(produkFilterQuery: FilterQuery<FindAllProdukDto>) {
    let filter: FilterQuery<FindAllProdukDto> = {
      deleted_at: null,
    };

    if (produkFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: produkFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    return this.produkModel.countDocuments(filter);
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
  async validateDetailArray(
    produkDetail: DetailProdukDto[],
  ): Promise<ProdukDetailDatabaseInput[]> {
    let temp: ProdukDetailDatabaseInput[] = [];

    // simpan seluruh id bahan dalam bentuk array
    let bahanIds = produkDetail.map((d) => d.id_bahan);

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
      throw new NotFoundException('Bahan not found');
    }

    // simpan seluruh id satuan dalam bentuk array
    let satuanIds = produkDetail.map((d) => d.id_satuan);

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
      },
    );

    if (listSatuanData.length != uniqueSatuanIds.length) {
      throw new NotFoundException('Satuan not found');
    }

    // buat mapping id satuan supaya bisa diformatting ke ProdukDetailDatabaseInput
    let satuanMap: Map<number, Types.ObjectId> = new Map();
    listSatuanData.forEach((s) => {
      satuanMap.set(s.id, s._id as Types.ObjectId);
    });

    // format ke ProdukDetailDatabaseInput
    for (let i = 0; i < produkDetail.length; i++) {
      const d = produkDetail[i];

      const newNotaDetail: ProdukDetailDatabaseInput = {
        id_bahan: listBahanData[i]._id as Types.ObjectId,
        id_satuan: satuanMap.get(d.id_satuan) as Types.ObjectId,
        qty: d.qty,
        qtyPakai: d.qtyPakai == 0 ? d.qty : d.qtyPakai,
        keterangan: d.keterangan,
      };

      temp.push(newNotaDetail);
    }
    return temp;
  }
}
