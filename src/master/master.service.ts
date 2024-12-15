import { Injectable } from '@nestjs/common';
import { CreateMasterDto } from './dto/create-master.dto';
import {
  MasterBahanFindAllResponse,
  MasterBahanFindAllResponseData,
  MasterCustomerFindAllResponse,
  MasterCustomerFindAllResponseData,
  MasterHistoryBahanMasukFindAllResponse,
  MasterHistoryBahanMasukFindAllResponseData,
  MasterKaryawanFindAllResponse,
  MasterKaryawanFindAllResponseData,
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
import { BahanRepository } from 'src/database/mongodb/repositories/bahan.repository';
import { FindAllBahanDto } from 'src/bahan/dto/bahan.dto';
import { FindAllHistoryMasukDto } from 'src/history-masuk/dto/create-history-masuk.dto';
import { HistoryBahanMasukRepository } from 'src/database/mongodb/repositories/historyBahanMasuk.repository';
import { FindAllKaryawanDto } from 'src/karyawan/dto/create-karyawan.dto';
import { KaryawanRepository } from 'src/database/mongodb/repositories/karyawan.repository';

@Injectable()
export class MasterService {
  constructor(
    private readonly customerRepo: CustomerRepository,
    private readonly supplierRepo: SupplierRepository,
    private readonly satuanRepo: SatuanRepository,
    private readonly bahanRepo: BahanRepository,
    private readonly historyBahanMasukRepo: HistoryBahanMasukRepository,
    private readonly karyawanRepo: KaryawanRepository,
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

  async handleMasterBahanFindAll(requestFilter: FindAllBahanDto) {
    // ambil data customer
    const bahanData = await this.bahanRepo.masterFindAll(
      {
        nama: requestFilter.search,
      },
      {
        page: requestFilter.page,
        per_page: requestFilter.per_page,
      },
    );

    // hitung total data customer
    let totalBahanData = await this.bahanRepo.countAll({
      nama: requestFilter.search,
    });

    // hitung total page
    const total_page = Math.ceil(totalBahanData / requestFilter.per_page);

    // buat response
    const res: MasterBahanFindAllResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: bahanData.map((satuan) => {
        const temp: MasterBahanFindAllResponseData = {
          id: satuan.id,
          nama: satuan.nama,
        };
        return temp;
      }),
      total_page: total_page,
    };

    return res;
  }

  async handleMasterHistoryBahanMasukFindAll(
    requestFilter: FindAllHistoryMasukDto,
  ) {
    // find all HistoryBahanMasuk
    const listDataHistoryBahanMasuk = await this.historyBahanMasukRepo.findAll(
      {
        kode_nota: requestFilter.search,
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
      });

    // hitung total page
    const total_page: number = Math.ceil(
      totalListDataHistoryBahanMasuk / requestFilter.per_page,
    );

    // buat response
    const res: MasterHistoryBahanMasukFindAllResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: listDataHistoryBahanMasuk.map((s) => {
        const formattedData: MasterHistoryBahanMasukFindAllResponseData = {
          id: s.id,
          kode_nota: s.kode_nota,
        };
        return formattedData;
      }),
      total_page: total_page,
    };

    return res;
  }

  async handleMasterKaryawanFindAll(requestFilter: FindAllKaryawanDto) {
    // ambil data customer
    const listKaryawanData = await this.karyawanRepo.masterFindAll(
      {
        nama: requestFilter.search,
        role: requestFilter.role,
      },
      {
        page: requestFilter.page,
        per_page: requestFilter.per_page,
      },
    );

    // hitung total data customer
    let totalKaryawanData = await this.karyawanRepo.countAll({
      nama: requestFilter.search,
    });

    // hitung total page
    const total_page = Math.ceil(totalKaryawanData / requestFilter.per_page);

    // buat response
    const res: MasterKaryawanFindAllResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: listKaryawanData.map((karyawan) => {
        const temp: MasterKaryawanFindAllResponseData = {
          id: karyawan.id,
          nama: karyawan.nama,
        };
        return temp;
      }),
      total_page: total_page,
    };

    return res;
  }
}
