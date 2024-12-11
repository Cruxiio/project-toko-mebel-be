import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateHistoryMasukDto,
  FindAllStokDto,
  FindAllHistoryMasukDto,
  UpdateHistoryMasukDto,
} from './dto/create-history-masuk.dto';
import {
  HistoryBahanMasukDetailData,
  StokFindAllResponse,
  StokFindAllResponseData,
  HistoryBahanMasukDetailFindOneByIDResponse,
  HistoryBahanMasukFindAllResponse,
  HistoryBahanMasukFindAllResponseData,
  HistoryBahanMasukFindOneResponse,
  HistoryMasukDtoDatabaseInput,
  LaporanStokBahanMasukResponseData,
  LaporanStokBahanMasukResponse,
} from './dto/response.interface';
import { HistoryBahanMasukRepository } from 'src/database/mongodb/repositories/historyBahanMasuk.repository';
import { SupplierRepository } from 'src/database/mongodb/repositories/supplier.repository';
import { SatuanRepository } from 'src/database/mongodb/repositories/satuan.repository';
import { BahanRepository } from 'src/database/mongodb/repositories/bahan.repository';
import { Types } from 'mongoose';

@Injectable()
export class HistoryMasukService {
  constructor(
    private readonly historyBahanMasukRepo: HistoryBahanMasukRepository,
    private readonly supplierRepo: SupplierRepository,
    private readonly satuanRepo: SatuanRepository,
    private readonly bahanRepo: BahanRepository,
  ) {}

  async HandleCreateHistoryBahanMasuk(
    createHistoryBahanMasukDto: CreateHistoryMasukDto,
  ) {
    // cek apakah kode nota sudah ada atau belum
    let ada = await this.historyBahanMasukRepo.findOne({
      kode_nota: {
        $regex: `^${createHistoryBahanMasukDto.kode_nota}$`, // nama harus persis bukan like
        $options: 'i', // i artinya case-insensitive
      },
      deleted_at: null,
    });

    if (ada) {
      throw new BadRequestException('kode_nota sudah terdaftar');
    }

    //cek id_supplier valid
    let supplierData = await this.supplierRepo.findOne({
      id: createHistoryBahanMasukDto.id_supplier,
      deleted_at: null,
    });

    if (!supplierData) {
      throw new NotFoundException('Supplier not found');
    }

    // cek id_satuan dan id_bahan pada tiap detail valid
    let historyBahanMasukDetailForInputDB =
      await this.historyBahanMasukRepo.validateDetailArray(
        createHistoryBahanMasukDto.detail,
      );

    // buat history bahan masuk input database interface
    let historyBahanMasukInputDB: HistoryMasukDtoDatabaseInput = {
      kode_nota: createHistoryBahanMasukDto.kode_nota,
      id_supplier: supplierData._id as Types.ObjectId,
      tgl_nota: createHistoryBahanMasukDto.tgl_nota,
      no_spb: createHistoryBahanMasukDto.no_spb,
      detail: historyBahanMasukDetailForInputDB,
    };

    // create new history bahan masuk
    const newHistoryBahanMasukData = await this.historyBahanMasukRepo.create(
      historyBahanMasukInputDB,
    );

    // buat response
    const res: HistoryBahanMasukFindOneResponse = {
      id: newHistoryBahanMasukData.id,
      kode_nota: newHistoryBahanMasukData.kode_nota,
      id_supplier: createHistoryBahanMasukDto.id_supplier,
      tgl_nota: newHistoryBahanMasukData.tgl_nota,
      no_spb: newHistoryBahanMasukData.no_spb,
      created_at: newHistoryBahanMasukData.created_at,
      updated_at: newHistoryBahanMasukData.updated_at,
      deleted_at: newHistoryBahanMasukData.deleted_at,
    };
    return res;
  }

  async HandleUpdateHistoryBahanMasuk(
    id: number,
    updateHistoryBahanMasukDto: UpdateHistoryMasukDto,
  ) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // cek apakah kode nota sudah ada atau belum
    let ada = await this.historyBahanMasukRepo.findOne({
      kode_nota: updateHistoryBahanMasukDto.kode_nota,
      deleted_at: null,
    });

    if (ada) {
      throw new BadRequestException('kode_nota sudah terdaftar');
    }

    //cek id_supplier valid
    let supplierData = await this.supplierRepo.findOne({
      id: updateHistoryBahanMasukDto.id_supplier,
      deleted_at: null,
    });

    if (!supplierData) {
      throw new NotFoundException('Supplier not found');
    }

    // cek id_satuan dan id_bahan pada tiap detail valid
    let historyBahanMasukDetailForInputDB =
      await this.historyBahanMasukRepo.validateDetailArray(
        updateHistoryBahanMasukDto.detail,
      );

    // buat history bahan masuk input database interface
    let historyBahanMasukInputDB: HistoryMasukDtoDatabaseInput = {
      kode_nota: updateHistoryBahanMasukDto.kode_nota,
      id_supplier: supplierData._id as Types.ObjectId,
      tgl_nota: updateHistoryBahanMasukDto.tgl_nota,
      no_spb: updateHistoryBahanMasukDto.no_spb,
      detail: historyBahanMasukDetailForInputDB,
    };

    // create new history bahan masuk
    const newHistoryBahanMasukData = await this.historyBahanMasukRepo.update(
      { id, deleted_at: null },
      historyBahanMasukInputDB,
    );

    // buat response
    const res: HistoryBahanMasukFindOneResponse = {
      id: newHistoryBahanMasukData.id,
      kode_nota: newHistoryBahanMasukData.kode_nota,
      id_supplier: updateHistoryBahanMasukDto.id_supplier,
      tgl_nota: newHistoryBahanMasukData.tgl_nota,
      no_spb: newHistoryBahanMasukData.no_spb,
      created_at: newHistoryBahanMasukData.created_at,
      updated_at: newHistoryBahanMasukData.updated_at,
      deleted_at: newHistoryBahanMasukData.deleted_at,
    };
    return res;
  }

  async HandleFindAllHistoryBahanMasuk(requestFilter: FindAllHistoryMasukDto) {
    // find all HistoryBahanMasuk
    const listDataHistoryBahanMasuk = await this.historyBahanMasukRepo.findAll(
      {
        kode_nota: requestFilter.search,
        id_supplier: requestFilter.id_supplier,
        tgl_nota: requestFilter.tgl_nota,
      },
      {
        page: requestFilter.page,
        per_page: requestFilter.per_page,
      },
      {},
    );

    // dapatkan total seluruh data berdasarkan hasil filter
    const totalListDataHistoryBahanMasuk =
      await this.historyBahanMasukRepo.countAll({
        kode_nota: requestFilter.search,
        id_supplier: requestFilter.id_supplier,
        tgl_nota: requestFilter.tgl_nota,
      });

    // hitung total page
    const total_page: number = Math.ceil(
      totalListDataHistoryBahanMasuk / requestFilter.per_page,
    );

    // buat response
    const res: HistoryBahanMasukFindAllResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: listDataHistoryBahanMasuk.map((s) => {
        const formattedData: HistoryBahanMasukFindAllResponseData = {
          id: s.id,
          kode_nota: s.kode_nota,
          id_supplier: s.id_supplier.id,
          tgl_nota: s.tgl_nota,
          no_spb: s.no_spb,
          created_at: s.created_at,
          updated_at: s.updated_at,
          deleted_at: s.deleted_at,
        };
        return formattedData;
      }),
      total_page: total_page,
    };

    return res;
  }

  async HandleFindOneHistoryBahanMasuk(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // find History Bahan Masuk by id
    const historyBahanMasukData = await this.historyBahanMasukRepo.findOne({
      id,
      deleted_at: null,
    });

    if (!historyBahanMasukData) {
      throw new NotFoundException('History Bahan Masuk not found');
    }

    // find supplier by _id
    const supplierData = await this.supplierRepo.findOne({
      _id: historyBahanMasukData.id_supplier,
      deleted_at: null,
    });

    if (!supplierData) {
      throw new NotFoundException('Supplier not found');
    }

    // find history bahan masuk detail by history bahan masuk id
    const detailData =
      await this.historyBahanMasukRepo.findAllDetailByHistoryBahanMasukID(
        { id, deleted_at: null },
        { main: {}, field1: 'id', nestedField1: '', field2: 'id', field3: '' },
      );

    // buat response
    const res: HistoryBahanMasukDetailFindOneByIDResponse = {
      kode_nota: historyBahanMasukData.kode_nota,
      id_supplier: supplierData.id,
      tgl_nota: historyBahanMasukData.tgl_nota,
      no_spb: historyBahanMasukData.no_spb,
      created_at: historyBahanMasukData.created_at,
      updated_at: historyBahanMasukData.updated_at,
      deleted_at: historyBahanMasukData.deleted_at,
      detail: detailData.map((s) => {
        const formattedData: HistoryBahanMasukDetailData = {
          id_bahan: s.id_bahan.id,
          id_satuan: s.id_satuan.id,
          qty: s.qty,
        };
        return formattedData;
      }),
    };

    return res;
  }

  async HandleFindAllStok(requestFilter: FindAllStokDto) {
    /* NOTE: 
      untuk showedField: any, data strukturnya:
      {
            main: {}, --> ini buat showed field pada .find()
            field1: '' --> ini buat showed field pada select populate(join table) ke 1,
            nestedField1: '', --> ini buat showed field pada (join table) id ref yang ada pada tabel ke 1, jika nested
            field2: '' --> ini buat showed field pada select populate(join table) ke 2,
            field3: '' --> ini buat showed field pada select populate(join table) ke 3,
      }
    */
    const listStok = await this.historyBahanMasukRepo.findAllStok(
      {
        search: requestFilter.search,
        tgl_nota: requestFilter.tgl_nota,
      },
      {
        page: requestFilter.page,
        per_page: requestFilter.per_page,
      },
      {
        main: {},
        field1: 'id tgl_nota',
        nestedField1: '',
        field2: 'id nama',
        field3: 'id nama',
      },
    );

    const totalListStok = await this.historyBahanMasukRepo.countAllStok({
      search: requestFilter.search,
      tgl_nota: requestFilter.tgl_nota,
    });

    // hitung total page
    const total_page: number = Math.ceil(
      totalListStok / requestFilter.per_page,
    );

    const res: StokFindAllResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: listStok.map((s) => {
        const formattedData: StokFindAllResponseData = {
          tgl_nota: s.id_history_bahan_masuk.tgl_nota,
          nama_bahan: s.id_bahan.nama,
          nama_satuan: s.id_satuan.nama,
          qty: s.qtyPakai,
          created_at: s.created_at,
          updated_at: s.updated_at,
          deleted_at: s.deleted_at,
        };
        return formattedData;
      }),
      total_page: total_page,
    };

    return res;
  }

  async HandleLaporanStokBahanMasuk(requestFilter: FindAllStokDto) {
    /* NOTE: 
      untuk showedField: any, data strukturnya:
      {
            main: {}, --> ini buat showed field pada .find()
            field1: '' --> ini buat showed field pada select populate(join table) ke 1,
            nestedField1: '', --> ini buat showed field pada (join table) id ref yang ada pada tabel ke 1, jika nested
            field2: '' --> ini buat showed field pada select populate(join table) ke 2,
            field3: '' --> ini buat showed field pada select populate(join table) ke 3,
      }
    */
    const listStok = await this.historyBahanMasukRepo.findAllStok(
      {
        search: requestFilter.search,
        tgl_nota: requestFilter.tgl_nota,
        id_supplier: requestFilter.id_supplier,
      },
      {
        page: requestFilter.page,
        per_page: requestFilter.per_page,
      },
      {
        main: {},
        field1: 'id tgl_nota no_spb',
        nestedField1: 'id nama',
        field2: 'id nama',
        field3: 'id nama',
      },
    );

    const totalListStok = await this.historyBahanMasukRepo.countAllStok({
      search: requestFilter.search,
      tgl_nota: requestFilter.tgl_nota,
      id_supplier: requestFilter.id_supplier,
    });

    // hitung total page
    const total_page: number = Math.ceil(
      totalListStok / requestFilter.per_page,
    );

    const res: LaporanStokBahanMasukResponse = {
      data: listStok.map((s) => {
        const formattedData: LaporanStokBahanMasukResponseData = {
          tgl_nota: s.id_history_bahan_masuk.tgl_nota,
          id_bahan: s.id_bahan.id,
          nama_bahan: s.id_bahan.nama,
          qty: s.qty,
          nama_satuan: s.id_satuan.nama,
          nama_supplier: s.id_history_bahan_masuk.id_supplier.nama,
          no_spb: s.id_history_bahan_masuk.no_spb,
          created_at: s.created_at,
          updated_at: s.updated_at,
          deleted_at: s.deleted_at,
        };
        return formattedData;
      }),
    };

    return res;
  }
}
