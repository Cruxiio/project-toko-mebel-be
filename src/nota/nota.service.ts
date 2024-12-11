import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotaDto, UpdateNotaDto } from './dto/create-nota.dto';
import { NotaRepository } from 'src/database/mongodb/repositories/nota.repository';
import { SupplierRepository } from 'src/database/mongodb/repositories/supplier.repository';
import { HistoryBahanMasukRepository } from 'src/database/mongodb/repositories/historyBahanMasuk.repository';
import {
  NotaDtoDatabaseInput,
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

    // hitung jumlah diskon
    let jumlahDiskon = Math.ceil(
      (createNotaDto.diskon_akhir / 100) * totalHarga,
    );

    totalHarga = totalHarga + createNotaDto.total_pajak - jumlahDiskon;

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

  findAll() {
    return `This action returns all nota`;
  }

  async findOne(id: number) {}

  update(id: number, updateNotaDto: UpdateNotaDto) {
    return `This action updates a #${id} nota`;
  }

  remove(id: number) {
    return `This action removes a #${id} nota`;
  }
}
