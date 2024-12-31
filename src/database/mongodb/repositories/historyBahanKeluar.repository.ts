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
import { Model, Types } from 'mongoose';
import {
  HistoryBahanKeluarDetailDatabaseInput,
  HistoryKeluarDtoDatabaseInput,
} from 'src/history-bahan-keluar/dto/response.interface';
import { HistoryBahanKeluarDetailDto } from 'src/history-bahan-keluar/dto/create-history-bahan-keluar.dto';
import { HelperService } from 'src/helper/helper.service';
import { HistoryBahanMasukRepository } from './historyBahanMasuk.repository';
import { SatuanRepository } from './satuan.repository';
import { HistoryBahanMasukDetailUpdateDatabaseInput } from 'src/history-masuk/dto/response.interface';

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
