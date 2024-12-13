import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateSupplierDto,
  FindAllSupplierDto,
  UpdateSupplierDto,
} from './dto/supplier_request.dto';
import { SupplierRepository } from 'src/database/mongodb/repositories/supplier.repository';
import {
  SupplierDeleteResponse,
  SupplierFindAllResponse,
  SupplierFindAllResponseData,
  SupplierFindOneResponse,
} from './dto/response.interface';

@Injectable()
export class SupplierService {
  constructor(private readonly SupplierRepo: SupplierRepository) {}

  async HandleCreateSupplier(createSupplierDto: CreateSupplierDto) {
    //cek apakah no rekening sudah ada atau belum
    let ada = await this.SupplierRepo.findOne({
      no_rekening: createSupplierDto.no_rekening,
      nama_bank: createSupplierDto.nama_bank,
      deleted_at: null,
    });

    if (ada) {
      throw new BadRequestException(
        'No rekening pada bank ' +
          createSupplierDto.nama_bank +
          ' sudah terdaftar',
      );
    }

    // cek apakah no telepon sudah ada atau belum
    if (createSupplierDto.no_telepon != null) {
      ada = await this.SupplierRepo.findOne({
        no_telepon: createSupplierDto.no_telepon,
        deleted_at: null,
      });

      if (ada) {
        throw new BadRequestException('No Telepon sudah terdaftar');
      }
    }

    // create new supplier
    const newSupplierData = await this.SupplierRepo.create(createSupplierDto);

    // buat response
    const res: SupplierFindOneResponse = {
      id: newSupplierData.id,
      nama: newSupplierData.nama,
      no_rekening: newSupplierData.no_rekening,
      nama_bank: newSupplierData.nama_bank,
      no_telepon: newSupplierData.no_telepon,
      alamat: newSupplierData.alamat,
      created_at: newSupplierData.created_at,
      updated_at: newSupplierData.updated_at,
      deleted_at: newSupplierData.deleted_at,
    };
    return res;
  }

  async HandleFindAllSupplier(requestFilter: FindAllSupplierDto) {
    // find all supplier
    const listDataSupplier = await this.SupplierRepo.findAll(
      {
        nama: requestFilter.search,
        no_telepon: requestFilter.no_telepon,
      },
      {
        page: requestFilter.page,
        per_page: requestFilter.per_page,
      },
      {},
    );

    // dapatkan total seluruh data berdasarkan hasil filter
    const totalListDataSupplier = await this.SupplierRepo.countAll({
      nama: requestFilter.search,
      no_telepon: requestFilter.no_telepon,
    });

    // hitung total page
    const total_page: number = Math.ceil(
      totalListDataSupplier / requestFilter.per_page,
    );

    // buat response
    const res: SupplierFindAllResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: listDataSupplier.map((s) => {
        const formattedData: SupplierFindAllResponseData = {
          id: s.id,
          nama: s.nama,
          no_rekening: s.no_rekening,
          nama_bank: s.nama_bank,
          no_telepon: s.no_telepon,
          alamat: s.alamat,
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

  async HandleFindOneSupplier(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // find supplier by id
    const supplierData = await this.SupplierRepo.findOne({
      id,
      deleted_at: null,
    });
    if (!supplierData) {
      throw new NotFoundException('Supplier not found');
    }

    // buat response
    const res: SupplierFindOneResponse = {
      id: supplierData.id,
      nama: supplierData.nama,
      no_rekening: supplierData.no_rekening,
      nama_bank: supplierData.nama_bank,
      no_telepon: supplierData.no_telepon,
      alamat: supplierData.alamat,
      created_at: supplierData.created_at,
      updated_at: supplierData.updated_at,
      deleted_at: supplierData.deleted_at,
    };

    return res;
  }

  async HandleUpdateSupplier(id: number, updateSupplierDto: UpdateSupplierDto) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    //cek apakah no rekening sudah ada atau belum
    let ada = await this.SupplierRepo.findOne({
      no_rekening: updateSupplierDto.no_rekening,
      nama_bank: updateSupplierDto.nama_bank,
      deleted_at: null,
    });

    if (ada && ada.id !== id) {
      throw new BadRequestException(
        'No rekening pada bank ' +
          updateSupplierDto.nama_bank +
          ' sudah terdaftar',
      );
    }

    // cek apakah no telepon sudah ada atau belum
    if (updateSupplierDto.no_telepon != null) {
      ada = await this.SupplierRepo.findOne({
        no_telepon: updateSupplierDto.no_telepon,
        deleted_at: null,
      });

      if (ada && ada.id !== id) {
        throw new BadRequestException('No Telepon sudah terdaftar');
      }
    }

    // update data supplier
    const updatedSupplierData = await this.SupplierRepo.update(
      { id, deleted_at: null },
      updateSupplierDto,
    );

    if (!updatedSupplierData) {
      throw new NotFoundException('Supplier not found');
    }

    // buat response
    const res: SupplierFindOneResponse = {
      nama: updatedSupplierData.nama,
      no_rekening: updatedSupplierData.no_rekening,
      nama_bank: updatedSupplierData.nama_bank,
      no_telepon: updatedSupplierData.no_telepon,
      alamat: updatedSupplierData.alamat,
      created_at: updatedSupplierData.created_at,
      updated_at: updatedSupplierData.updated_at,
      deleted_at: updatedSupplierData.deleted_at,
    };
    return res;
  }

  async HandleDeleteSupplier(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // update data supplier
    const updatedSupplierData = await this.SupplierRepo.update(
      { id, deleted_at: null },
      { deleted_at: new Date() },
    );

    if (!updatedSupplierData) {
      throw new NotFoundException('Supplier not found');
    }

    // buat response
    const res: SupplierDeleteResponse = {
      message: 'OK',
    };

    return res;
  }
}
