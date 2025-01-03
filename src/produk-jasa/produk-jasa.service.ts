import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProdukJasaDto,
  FindAllProdukJasaDto,
} from './dto/create-produk-jasa.dto';
import { ProdukJasaRepository } from 'src/database/mongodb/repositories/produkJasa.repository';
import {
  ProdukJasaDeleteResponse,
  ProdukJasaFindAllResponse,
  ProdukJasaFindAllResponseData,
  ProdukJasaFindOneResponse,
  ProdukJasaInputDatabaseDto,
} from './dto/response.interface';
import { ProdukRepository } from 'src/database/mongodb/repositories/produk.repository';
import { SatuanRepository } from 'src/database/mongodb/repositories/satuan.repository';
import { Types } from 'mongoose';

@Injectable()
export class ProdukJasaService {
  constructor(
    private readonly produkJasaRepository: ProdukJasaRepository,
    private readonly produkRepository: ProdukRepository,
    private readonly satuanRepository: SatuanRepository,
  ) {}

  async handleCreateProdukJasa(createProdukJasaDto: CreateProdukJasaDto) {
    // validate id_produk
    const produkData = await this.produkRepository.findOne({
      id: createProdukJasaDto.id_produk,
    });

    if (!produkData) {
      throw new NotFoundException('Produk not found');
    }

    // cek apakah nama produk jasa sudah ada atau belum
    const produkJasaData = await this.produkJasaRepository.findOne(
      {
        nama: createProdukJasaDto.nama,
        id_produk: produkData._id,
      },
      {
        main: {},
        field1: '',
        field2: '',
      },
    );

    if (produkJasaData) {
      throw new BadRequestException(
        `Jasa ${createProdukJasaDto.nama} pada produk ${produkData.nama} sudah ada`,
      );
    }

    // validate id_satuan
    const satuanData = await this.satuanRepository.findOne({
      id: createProdukJasaDto.id_satuan,
    });

    if (!satuanData) {
      throw new NotFoundException('Satuan not found');
    }

    // buat produkJasaInputDatabaseDto
    const produkJasaInputDatabaseDto: ProdukJasaInputDatabaseDto = {
      id_produk: produkData._id as Types.ObjectId,
      id_satuan: satuanData._id as Types.ObjectId,
      nama: createProdukJasaDto.nama,
      qty: createProdukJasaDto.qty,
      harga_satuan: createProdukJasaDto.harga_satuan,
      subtotal: createProdukJasaDto.qty * createProdukJasaDto.harga_satuan,
      keterangan: createProdukJasaDto.keterangan,
    };

    // create produkJasa
    const newProdukJasa = await this.produkJasaRepository.create(
      produkJasaInputDatabaseDto,
    );

    // buat response
    const res: ProdukJasaFindOneResponse = {
      id: newProdukJasa.id,
      id_produk: produkData.id,
      nama_produk: produkData.nama,
      id_satuan: satuanData.id,
      nama_satuan: satuanData.nama,
      nama: newProdukJasa.nama,
      qty: newProdukJasa.qty,
      harga_satuan: newProdukJasa.harga_satuan,
      subtotal: newProdukJasa.subtotal,
      keterangan: newProdukJasa.keterangan,
      created_at: newProdukJasa.created_at,
      updated_at: newProdukJasa.updated_at,
      deleted_at: newProdukJasa.deleted_at,
    };

    return res;
  }

  async handleFindAllProdukJasa(requestFilter: FindAllProdukJasaDto) {
    const listProdukJasaData =
      await this.produkJasaRepository.findAllPagination(
        {
          search: requestFilter.search,
          id_produk: requestFilter.id_produk,
          id_satuan: requestFilter.id_satuan,
        },
        {
          page: requestFilter.page,
          per_page: requestFilter.per_page,
        },
        {
          main: {},
          field1: 'id nama',
          field2: 'id nama',
        },
      );

    // dapatkan total seluruh data berdasarkan hasil filter
    const totalListDataProdukJasa = await this.produkJasaRepository.countAll({
      search: requestFilter.search,
      id_produk: requestFilter.id_produk,
      id_satuan: requestFilter.id_satuan,
    });

    // hitung total page
    const total_page: number = Math.ceil(
      totalListDataProdukJasa / requestFilter.per_page,
    );

    // buat response
    const res: ProdukJasaFindAllResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: listProdukJasaData.map((produkJasa) => {
        const formattedData: ProdukJasaFindAllResponseData = {
          id: produkJasa.id,
          id_produk: produkJasa.id_produk.id,
          nama_produk: produkJasa.id_produk.nama,
          id_satuan: produkJasa.id_satuan.id,
          nama_satuan: produkJasa.id_satuan.nama,
          nama: produkJasa.nama,
          qty: produkJasa.qty,
          harga_satuan: produkJasa.harga_satuan,
          subtotal: produkJasa.subtotal,
          keterangan: produkJasa.keterangan,
          created_at: produkJasa.created_at,
          updated_at: produkJasa.updated_at,
          deleted_at: produkJasa.deleted_at,
        };
        return formattedData;
      }),
      total_page: total_page,
    };

    return res;
  }

  async handleDeleteProdukJasa(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // validate id produkJasa
    const produkJasaData = await this.produkJasaRepository.findOne(
      {
        id: id,
      },
      {
        main: {},
        field1: '',
        field2: '',
      },
    );

    if (!produkJasaData) {
      throw new NotFoundException('Produk Jasa not found');
    }

    // delete produkJasa
    await this.produkJasaRepository.delete({ id: id });

    // buat response
    const res: ProdukJasaDeleteResponse = {
      message: 'OK',
    };

    return res;
  }
}
