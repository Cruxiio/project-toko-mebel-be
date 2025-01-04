import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateNotaDto,
  FindAllNotaDto,
  UpdateNotaDto,
} from './dto/create-nota.dto';
import { NotaRepository } from 'src/database/mongodb/repositories/nota.repository';
import { SupplierRepository } from 'src/database/mongodb/repositories/supplier.repository';
import { HistoryBahanMasukRepository } from 'src/database/mongodb/repositories/historyBahanMasuk.repository';
import {
  NotaDetailArrayData,
  NotaDtoDatabaseInput,
  NotaFindAllResponse,
  NotaFindOneFullDataResponse,
  NotaFindOneResponse,
} from './dto/response.interface';
import { Types } from 'mongoose';
import { HistoryBahanMasukDetailData } from 'src/history-masuk/dto/response.interface';

@Injectable()
export class NotaService {
  constructor(
    private readonly notaRepo: NotaRepository,
    private readonly supplierRepo: SupplierRepository,
    private readonly historyBahanMasukRepo: HistoryBahanMasukRepository,
  ) {}

  async handleCreateNota(createNotaDto: CreateNotaDto) {
    //cek id_supplier valid atau tidak
    let supplierData = await this.supplierRepo.findOne({
      id: createNotaDto.id_supplier,
      deleted_at: null,
    });

    if (!supplierData) {
      throw new NotFoundException('Supplier not found');
    }

    // cek kode nota valid atau tidak
    let historyBahanMasukData = await this.historyBahanMasukRepo.findOne({
      kode_nota: createNotaDto.kode_nota,
      id_supplier: supplierData._id,
      tgl_nota: createNotaDto.tgl_nota,
      deleted_at: null,
    });

    if (!historyBahanMasukData) {
      throw new NotFoundException(
        'Kode nota tidak ditemukan, cek apakah kode nota, nama supplier, dan tgl_nota sudah sesuai dengan data yang dimasukkan pada saat add stok ke gudang',
      );
    }

    // cek apakah kode nota sudah ada atau belum
    let ada = await this.notaRepo.findOne({
      id_history_bahan_masuk: historyBahanMasukData._id,
      deleted_at: null,
    });

    if (ada) {
      throw new BadRequestException('Kode nota pembelian sudah tedaftar');
    }

    // validasi apakah isi detail sama dengan isi history bahan masuk detail
    let historyBahanMasukDetailData =
      await this.historyBahanMasukRepo.findAllDetailByHistoryBahanMasukID(
        { id: historyBahanMasukData.id, deleted_at: null },
        {
          main: {},
          field1: 'id',
          nestedField1: '',
          field2: 'id',
          field3: '',
        },
      );

    // buat temp untuk format history bahan masuk detail
    let temp: HistoryBahanMasukDetailData[] = historyBahanMasukDetailData.map(
      (d) => {
        const res: HistoryBahanMasukDetailData = {
          id: d.id,
          id_bahan: d.id_bahan.id,
          id_satuan: d.id_satuan.id,
          qty: d.qty,
        };

        return res;
      },
    );

    // validasi isi detail nota
    let detailNotaInputDB = await this.notaRepo.validateDetailArray(
      createNotaDto.detail,
      temp,
    );

    // hitung total harga
    let totalHarga = detailNotaInputDB.reduce(
      (sum, detail) => sum + detail.subtotal,
      0,
    );

    //pastikan decimal totalHarga maksimal 2 digit di belakang koma
    totalHarga = parseFloat(totalHarga.toFixed(2));

    // hitung jumlah diskon
    let jumlahDiskon = (createNotaDto.diskon_akhir / 100) * totalHarga;

    // hitung grand total harga
    totalHarga = totalHarga + createNotaDto.total_pajak - jumlahDiskon;

    // pastikan decimal totalHarga maksimal 2 digit di belakang koma
    totalHarga = parseFloat(totalHarga.toFixed(2));

    // buat database input untuk nota
    let notaInputDB: NotaDtoDatabaseInput = {
      id_history_bahan_masuk: historyBahanMasukData._id as Types.ObjectId,
      total_pajak: createNotaDto.total_pajak,
      diskon_akhir: createNotaDto.diskon_akhir,
      total_harga: totalHarga,
      detail: detailNotaInputDB,
    };

    const newNota = await this.notaRepo.create(notaInputDB);

    const res: NotaFindOneResponse = {
      id: newNota.id,
      kode_nota: historyBahanMasukData.kode_nota,
      id_supplier: supplierData.id,
      tgl_nota: historyBahanMasukData.tgl_nota,
      total_pajak: newNota.total_pajak,
      diskon_akhir: newNota.diskon_akhir,
      total_harga: newNota.total_harga,
    };

    return res;
  }

  async handleFindAllNota(requestFilter: FindAllNotaDto) {
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
    const listNota = await this.notaRepo.findAllNota(
      {
        search: requestFilter.search,
        tgl_nota: requestFilter.tgl_nota,
        tgl_input: requestFilter.tgl_input,
        id_supplier: requestFilter.id_supplier,
      },
      {
        page: requestFilter.page,
        per_page: requestFilter.per_page,
      },
      {
        main: {},
        field1: 'id tgl_nota kode_nota',
        nestedField1: 'id',
      },
    );

    const totalListNota = await this.notaRepo.countAllNota({
      search: requestFilter.search,
      tgl_nota: requestFilter.tgl_nota,
      tgl_input: requestFilter.tgl_input,
      id_supplier: requestFilter.id_supplier,
    });

    // hitung total page
    const total_page: number = Math.ceil(
      totalListNota / requestFilter.per_page,
    );

    const res: NotaFindAllResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: listNota.map((n) => {
        const formattedData: NotaFindOneResponse = {
          id: n.id,
          kode_nota: n.id_history_bahan_masuk.kode_nota,
          tgl_nota: n.id_history_bahan_masuk.tgl_nota,
          id_supplier: n.id_history_bahan_masuk.id_supplier.id,
          total_pajak: n.total_pajak,
          diskon_akhir: n.diskon_akhir,
          total_harga: n.total_harga,
          created_at: n.created_at,
          updated_at: n.updated_at,
          deleted_at: n.deleted_at,
        };
        return formattedData;
      }),
      total_page: total_page,
    };

    return res;
  }

  async handleFindOneNota(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // find nota by id
    let notaData = await this.notaRepo.findOneNota(
      {
        id: id,
        deleted_at: null,
      },
      {
        main: {},
        field1: 'id',
        nestedField1: 'id nama',
        field2: 'id nama',
        field3: 'id nama',
      },
    );

    if (!notaData) {
      throw new NotFoundException('Nota not found');
    }

    const res: NotaFindOneFullDataResponse = {
      id: notaData.id,
      kode_nota: notaData.id_history_bahan_masuk.kode_nota,
      id_supplier: notaData.id_history_bahan_masuk.id_supplier.id,
      nama_suplier: notaData.id_history_bahan_masuk.id_supplier.nama,
      tgl_nota: notaData.id_history_bahan_masuk.tgl_nota,
      total_pajak: notaData.total_pajak,
      diskon_akhir: notaData.diskon_akhir,
      total_harga: notaData.total_harga,
      detail: notaData.detail.map((d) => {
        const temp: NotaDetailArrayData = {
          id_bahan: d.id_bahan.id,
          nama_bahan: d.id_bahan.nama,
          id_satuan: d.id_satuan.id,
          nama_satuan: d.id_satuan.nama,
          qty: d.qty,
          harga_satuan: d.harga_satuan,
          diskon: d.diskon,
          subtotal: d.subtotal,
        };

        return temp;
      }),
      created_at: notaData.created_at,
      updated_at: notaData.updated_at,
      deleted_at: notaData.deleted_at,
    };

    return res;
  }

  async handleUpdateNota(id: number, updateNotaDto: UpdateNotaDto) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // cek id_nota valid atau tidak
    let notaData = await this.notaRepo.findOne({
      id,
      deleted_at: null,
    });

    if (!notaData) {
      throw new NotFoundException('Nota not found');
    }

    //cek id_supplier valid atau tidak
    let supplierData = await this.supplierRepo.findOne({
      id: updateNotaDto.id_supplier,
      deleted_at: null,
    });

    if (!supplierData) {
      throw new NotFoundException('Supplier not found');
    }

    // cek kode nota valid atau tidak
    let historyBahanMasukData = await this.historyBahanMasukRepo.findOne({
      kode_nota: updateNotaDto.kode_nota,
      id_supplier: supplierData._id,
      tgl_nota: updateNotaDto.tgl_nota,
      deleted_at: null,
    });

    if (!historyBahanMasukData) {
      throw new NotFoundException(
        'Kode nota tidak ditemukan, cek apakah kode nota, nama supplier, dan tgl_nota sudah sesuai dengan data yang dimasukkan pada saat add stok ke gudang',
      );
    }

    // cek apakah kode nota sudah ada atau belum
    let ada = await this.notaRepo.findOne({
      id_history_bahan_masuk: historyBahanMasukData._id,
      deleted_at: null,
    });

    if (ada && ada.id != id) {
      throw new BadRequestException('Kode nota pembelian sudah tedaftar');
    }

    // validasi apakah isi detail sama dengan isi history bahan masuk detail
    let historyBahanMasukDetailData =
      await this.historyBahanMasukRepo.findAllDetailByHistoryBahanMasukID(
        { id: historyBahanMasukData.id, deleted_at: null },
        {
          main: {},
          field1: 'id',
          nestedField1: '',
          field2: 'id',
          field3: '',
        },
      );

    // buat temp untuk format history bahan masuk detail
    let temp: HistoryBahanMasukDetailData[] = historyBahanMasukDetailData.map(
      (d) => {
        const res: HistoryBahanMasukDetailData = {
          id: d.id,
          id_bahan: d.id_bahan.id,
          id_satuan: d.id_satuan.id,
          qty: d.qty,
        };

        return res;
      },
    );

    // validasi isi detail nota
    let detailNotaInputDB = await this.notaRepo.validateDetailArray(
      updateNotaDto.detail,
      temp,
    );

    // hitung total harga
    let totalHarga = detailNotaInputDB.reduce(
      (sum, detail) => sum + detail.subtotal,
      0,
    );

    // hitung jumlah diskon
    let jumlahDiskon = Math.ceil(
      (updateNotaDto.diskon_akhir / 100) * totalHarga,
    );

    totalHarga = totalHarga + updateNotaDto.total_pajak - jumlahDiskon;

    // buat database input untuk nota
    let notaInputDB: NotaDtoDatabaseInput = {
      id_history_bahan_masuk: historyBahanMasukData._id as Types.ObjectId,
      total_pajak: updateNotaDto.total_pajak,
      diskon_akhir: updateNotaDto.diskon_akhir,
      total_harga: totalHarga,
      detail: detailNotaInputDB,
    };

    const updatedNota = await this.notaRepo.update(
      { id, deleted_at: null },
      notaInputDB,
    );

    const res: NotaFindOneResponse = {
      id: updatedNota.id,
      kode_nota: historyBahanMasukData.kode_nota,
      id_supplier: supplierData.id,
      tgl_nota: historyBahanMasukData.tgl_nota,
      total_pajak: updatedNota.total_pajak,
      diskon_akhir: updatedNota.diskon_akhir,
      total_harga: updatedNota.total_harga,
    };

    return res;
  }

  async handleFindOneNotaByHistoryBahanMasukID(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    let historyBahanMasukData = await this.historyBahanMasukRepo.findOne({
      id,
      deleted_at: null,
    });

    if (!historyBahanMasukData) {
      throw new NotFoundException('History bahan masuk not found');
    }

    // cek apakah kode nota sudah ada atau belum
    let notaData = await this.notaRepo.findOne({
      id_history_bahan_masuk: historyBahanMasukData._id,
      deleted_at: null,
    });

    if (!notaData) {
      throw new NotFoundException('Nota pembelian not found!');
    }

    return await this.handleFindOneNota(notaData.id);
  }
}
