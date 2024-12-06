import { Injectable } from '@nestjs/common';
import { CreateMasterDto } from './dto/create-master.dto';
import {
  MasterCustomerFindAllResponse,
  MasterCustomerFindAllResponseData,
  MasterSatuanFindAllResponse,
  MasterSatuanFindAllResponseData,
  MasterSupplierFindAllResponse,
  MasterSupplierFindAllResponseData,
} from './dto/response.interface';
import { CustomerRepository } from 'src/database/mongodb/repositories/customer.repository';
import { SupplierRepository } from 'src/database/mongodb/repositories/supplier.repository';
import { FindAllSupplierDto } from 'src/supplier/dto/supplier_request.dto';
import { FindAllCustomerDto } from 'src/customer/dto/customer.dto';
import { SatuanRepository } from 'src/database/mongodb/repositories/satuan.repository';
import { FindAllSatuanDto } from 'src/satuan/dto/satuan.dto';

@Injectable()
export class MasterService {
  constructor(
    private readonly customerRepo: CustomerRepository,
    private readonly supplierRepo: SupplierRepository,
    private readonly satuanRepo: SatuanRepository,
  ) {}

  async handleMasterSupplierFindAll(requestFilter: FindAllSupplierDto) {
    // ambil data supplier
    const supplierData = await this.supplierRepo.masterFindAll(
      {
        nama: requestFilter.search,
        no_telepon: requestFilter.no_telepon,
      },
      {
        page: requestFilter.page,
        per_page: requestFilter.per_page,
      },
    );

    // hitung total data supplier
    let totalSupplierData = await this.supplierRepo.countAll({
      nama: requestFilter.search,
      no_telepon: requestFilter.no_telepon,
    });

    // hitung total page
    const total_page = Math.ceil(totalSupplierData / requestFilter.per_page);

    // buat response
    const res: MasterSupplierFindAllResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: supplierData.map((supplier) => {
        const temp: MasterSupplierFindAllResponseData = {
          id: supplier.id,
          nama: supplier.nama,
        };
        return temp;
      }),
      total_page: total_page,
    };

    return res;
  }

  async handleMasterCustomerFindAll(requestFilter: FindAllCustomerDto) {
    // ambil data customer
    const customerData = await this.customerRepo.masterFindAll(
      {
        nama: requestFilter.search,
        no_telepon: requestFilter.no_telepon,
      },
      {
        page: requestFilter.page,
        per_page: requestFilter.per_page,
      },
    );

    // hitung total data customer
    let totalCustomerData = await this.customerRepo.countAll({
      nama: requestFilter.search,
      no_telepon: requestFilter.no_telepon,
    });

    // hitung total page
    const total_page = Math.ceil(totalCustomerData / requestFilter.per_page);

    // buat response
    const res: MasterCustomerFindAllResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: customerData.map((customer) => {
        const temp: MasterCustomerFindAllResponseData = {
          id: customer.id,
          nama: customer.nama,
        };
        return temp;
      }),
      total_page: total_page,
    };

    return res;
  }

  async handleMasterSatuanFindAll(requestFilter: FindAllSatuanDto) {
    // ambil data customer
    const satuanData = await this.satuanRepo.masterFindAll(
      {
        nama: requestFilter.search,
      },
      {
        page: requestFilter.page,
        per_page: requestFilter.per_page,
      },
    );

    // hitung total data customer
    let totalSatuanData = await this.satuanRepo.countAll({
      nama: requestFilter.search,
    });

    // hitung total page
    const total_page = Math.ceil(totalSatuanData / requestFilter.per_page);

    // buat response
    const res: MasterSatuanFindAllResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: satuanData.map((satuan) => {
        const temp: MasterSatuanFindAllResponseData = {
          id: satuan.id,
          nama: satuan.nama,
        };
        return temp;
      }),
      total_page: total_page,
    };

    return res;
  }
}
