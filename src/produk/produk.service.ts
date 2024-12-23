import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProdukDto, UpdateProdukDto } from './dto/create-produk.dto';
import { ProdukRepository } from 'src/database/mongodb/repositories/produk.repository';
import {
  ProdukDeleteResponse,
  ProdukDtoDatabaseInput,
  ProdukFindAllResponse,
  ProdukFindOneResponse,
} from './dto/response.interface';

@Injectable()
export class ProdukService {
  constructor(private readonly produkRepo: ProdukRepository) {}

  async handleCreateProduk(createProdukDto: CreateProdukDto) {
    // buat database input untuk nota
    let produkInputDB: ProdukDtoDatabaseInput = {
      nama: createProdukDto.nama,
      detail: [],
    };

    const newProduk = await this.produkRepo.create(produkInputDB);

    const res: ProdukFindAllResponse = {
      id: newProduk.id,
      nama: newProduk.nama,
    };

    return res;
  }

  async handleUpdateProduk(id: number, updateProdukDto: UpdateProdukDto) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // cek id_produk valid atau tidak
    let produkData = await this.produkRepo.findOneProduk(
      {
        id,
        deleted_at: null,
      },
      {
        main: {},
        field1: 'id nama',
        field2: 'id nama',
      },
    );

    if (!produkData) {
      throw new NotFoundException('Produk not found');
    }

    // validasi isi detail produk
    let detailProdukInputDB = await this.produkRepo.validateDetailArray(
      updateProdukDto.detail,
    );

    // buat database input untuk produk
    let produkInputDB: ProdukDtoDatabaseInput = {
      nama: updateProdukDto.nama,
      detail: detailProdukInputDB,
    };

    const updatedProduk = await this.produkRepo.update(
      { id, deleted_at: null },
      produkInputDB,
    );

    // buat response
    const res: ProdukFindOneResponse = {
      nama: produkData.nama,
      detail: produkData.detail.map((item) => ({
        id_bahan: item.id_bahan.id,
        nama_bahan: item.id_bahan.nama,
        id_satuan: item.id_satuan.id,
        nama_satuan: item.id_satuan.nama,
        qty: item.qty,
        keterangan: item.keterangan,
      })),
      created_at: produkData.created_at,
      updated_at: produkData.updated_at,
      deleted_at: produkData.deleted_at,
    };

    return res;
  }

  async handleFindOneProduk(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // cek id_produk valid atau tidak
    let produkData = await this.produkRepo.findOneProduk(
      {
        id,
        deleted_at: null,
      },
      {
        main: {},
        field1: 'id nama',
        field2: 'id nama',
      },
    );

    if (!produkData) {
      throw new NotFoundException('Produk not found');
    }

    // buat response
    const res: ProdukFindOneResponse = {
      id: produkData.id,
      nama: produkData.nama,
      detail: produkData.detail.map((item) => ({
        id_bahan: item.id_bahan.id,
        nama_bahan: item.id_bahan.nama,
        id_satuan: item.id_satuan.id,
        nama_satuan: item.id_satuan.nama,
        qty: item.qty,
        keterangan: item.keterangan,
      })),
      created_at: produkData.created_at,
      updated_at: produkData.updated_at,
      deleted_at: produkData.deleted_at,
    };

    return res;
  }

  async handleRemoveProduk(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // cek id_produk valid atau tidak
    let produkData = await this.produkRepo.findOne({
      id,
      deleted_at: null,
    });

    if (!produkData) {
      throw new NotFoundException('Produk not found');
    }

    // hapus produk
    await this.produkRepo.update(
      { id, deleted_at: null },
      { deleted_at: new Date() },
    );

    const res: ProdukDeleteResponse = {
      message: 'OK',
    };

    return res;
  }
}
