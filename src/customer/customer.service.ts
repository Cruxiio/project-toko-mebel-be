import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCustomerDto,
  FindAllCustomerDto,
  UpdateCustomerDto,
} from './dto/customer.dto';
import {
  CustomerDeleteResponse,
  CustomerFindAllResponse,
  CustomerFindAllResponseData,
  CustomerFindOneResponse,
} from './dto/response_customer.interface';
import { CustomerRepository } from 'src/database/mongodb/repositories/customer.repository';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepo: CustomerRepository) {}

  async HandleCreateCustomer(createCustomerDto: CreateCustomerDto) {
    //cek apakah no rekening sudah ada atau belum
    let ada = await this.customerRepo.findOne({
      no_rekening: createCustomerDto.no_rekening,
      nama_bank: createCustomerDto.nama_bank,
      deleted_at: null,
    });

    if (ada) {
      throw new BadRequestException(
        'No rekening pada bank ' +
          createCustomerDto.nama_bank +
          ' sudah terdaftar',
      );
    }

    // cek apakah no telepon sudah ada atau belum
    if (createCustomerDto.no_telepon != null) {
      ada = await this.customerRepo.findOne({
        no_telepon: createCustomerDto.no_telepon,
        deleted_at: null,
      });

      if (ada) {
        throw new BadRequestException('No Telepon sudah terdaftar');
      }
    }

    // create new Customer
    const newCustomerData = await this.customerRepo.create(createCustomerDto);

    // buat response
    const res: CustomerFindOneResponse = {
      id: newCustomerData.id,
      nama: newCustomerData.nama,
      no_rekening: newCustomerData.no_rekening,
      nama_bank: newCustomerData.nama_bank,
      no_telepon: newCustomerData.no_telepon,
      alamat: newCustomerData.alamat,
      created_at: newCustomerData.created_at,
      updated_at: newCustomerData.updated_at,
      deleted_at: newCustomerData.deleted_at,
    };
    return res;
  }

  async HandleFindAllCustomer(requestFilter: FindAllCustomerDto) {
    // find all Customer
    const listDataCustomer = await this.customerRepo.findAll(
      {
        nama: requestFilter.search,
        no_telepon: requestFilter.no_telepon,
      },
      {
        page: requestFilter.page,
        per_page: requestFilter.per_page,
      },
    );

    // dapatkan total seluruh data berdasarkan hasil filter
    const totalListDataCustomer = await this.customerRepo.countAll({
      nama: requestFilter.search,
      no_telepon: requestFilter.no_telepon,
    });

    // hitung total page
    const total_page: number = Math.ceil(
      totalListDataCustomer / requestFilter.per_page,
    );

    // buat response
    const res: CustomerFindAllResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: listDataCustomer.map((s) => {
        const formattedData: CustomerFindAllResponseData = {
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

  async HandleFindOneCustomer(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }
    // find Customer by id
    const customerData = await this.customerRepo.findOne({
      id,
      deleted_at: null,
    });
    if (!customerData) {
      throw new NotFoundException('Customer not found');
    }

    // buat response
    const res: CustomerFindOneResponse = {
      id: customerData.id,
      nama: customerData.nama,
      no_rekening: customerData.no_rekening,
      nama_bank: customerData.nama_bank,
      no_telepon: customerData.no_telepon,
      alamat: customerData.alamat,
      created_at: customerData.created_at,
      updated_at: customerData.updated_at,
      deleted_at: customerData.deleted_at,
    };

    return res;
  }

  async HandleUpdateCustomer(id: number, updateCustomerDto: UpdateCustomerDto) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    //cek apakah no rekening sudah ada atau belum
    let ada = await this.customerRepo.findOne({
      no_rekening: updateCustomerDto.no_rekening,
      nama_bank: updateCustomerDto.nama_bank,
    });

    if (ada && ada.id !== id) {
      throw new BadRequestException(
        'No rekening pada bank ' +
          updateCustomerDto.nama_bank +
          ' sudah terdaftar',
      );
    }

    // cek apakah no telepon sudah ada atau belum
    if (updateCustomerDto.no_telepon != null) {
      ada = await this.customerRepo.findOne({
        no_telepon: updateCustomerDto.no_telepon,
        deleted_at: null,
      });

      if (ada && ada.id !== id) {
        throw new BadRequestException('No Telepon sudah terdaftar');
      }
    }

    // update data Customer
    const updatedCustomerData = await this.customerRepo.update(
      { id, deleted_at: null },
      updateCustomerDto,
    );

    if (!updatedCustomerData) {
      throw new NotFoundException('Customer not found');
    }

    // buat response
    const res: CustomerFindOneResponse = {
      nama: updatedCustomerData.nama,
      no_rekening: updatedCustomerData.no_rekening,
      nama_bank: updatedCustomerData.nama_bank,
      no_telepon: updatedCustomerData.no_telepon,
      alamat: updatedCustomerData.alamat,
      created_at: updatedCustomerData.created_at,
      updated_at: updatedCustomerData.updated_at,
      deleted_at: updatedCustomerData.deleted_at,
    };
    return res;
  }

  async HandleDeleteCustomer(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // update data Customer
    const updatedCustomerData = await this.customerRepo.update(
      { id, deleted_at: null },
      { deleted_at: new Date() },
    );

    if (!updatedCustomerData) {
      throw new NotFoundException('Customer not found');
    }

    const res: CustomerDeleteResponse = {
      message: 'OK',
    };

    return res;
  }
}
