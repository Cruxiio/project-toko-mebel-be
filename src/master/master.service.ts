import { Injectable } from '@nestjs/common';
import {
  MasterFindAllKaryawanDto,
  MasterFindAllSatuanDto,
  MasterFindAllStokDto,
} from './dto/create-master.dto';
import {
  MasterBahanFindAllResponse,
  MasterBahanFindAllResponseData,
  MasterCustomerFindAllResponse,
  MasterCustomerFindAllResponseData,
  MasterHistoryBahanMasukFindAllResponse,
  MasterHistoryBahanMasukFindAllResponseData,
  MasterKaryawanFindAllResponse,
  MasterKaryawanFindAllResponseData,
  MasterProyekFindAllResponse,
  MasterProyekFindAllResponseData,
  MasterProyekProdukFindAllResponse,
  MasterProyekProdukFindAllResponseData,
  MasterSatuanFindAllResponse,
  MasterSatuanFindAllResponseData,
  MasterStokFindAllResponse,
  MasterStokFindAllResponseData,
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
import {
  FindAllHistoryMasukDto,
  FindAllStokDto,
} from 'src/history-masuk/dto/create-history-masuk.dto';
import { HistoryBahanMasukRepository } from 'src/database/mongodb/repositories/historyBahanMasuk.repository';
import { FindAllKaryawanDto } from 'src/karyawan/dto/create-karyawan.dto';
import { KaryawanRepository } from 'src/database/mongodb/repositories/karyawan.repository';
import {
  FindAllProyekDto,
  FindAllProyekProdukDto,
} from 'src/proyek/dto/create-proyek.dto';
import { ProyekRepository } from 'src/database/mongodb/repositories/proyek.repository';
import { ProyekProdukRepository } from 'src/database/mongodb/repositories/proyek_produk.repository';
import { ProdukRepository } from 'src/database/mongodb/repositories/produk.repository';

@Injectable()
export class MasterService {
  constructor(
    private readonly customerRepo: CustomerRepository,
    private readonly supplierRepo: SupplierRepository,
    private readonly satuanRepo: SatuanRepository,
    private readonly bahanRepo: BahanRepository,
    private readonly historyBahanMasukRepo: HistoryBahanMasukRepository,
    private readonly karyawanRepo: KaryawanRepository,
    private readonly proyekRepo: ProyekRepository,
    private readonly proyekProdukRepo: ProyekProdukRepository,
    private readonly produkRepo: ProdukRepository,
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

  async handleMasterSatuanFindAll(requestFilter: MasterFindAllSatuanDto) {
    // ambil data customer
    const satuanData = await this.proyekProdukRepo.masterFindAllSatuan(
      {
        search: requestFilter.search,
        id_proyek_produk: requestFilter.id_proyek_produk,
        satuan_terkecil: requestFilter.satuan_terkecil,
      },
      {
        main: {},
      },
    );

    // buat response
    const res: MasterSatuanFindAllResponse = {
      data: satuanData.map((satuan) => {
        const temp: MasterSatuanFindAllResponseData = {
          id: satuan.id,
          nama: satuan.nama,
        };
        return temp;
      }),
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

  async handleMasterKaryawanFindAll(requestFilter: MasterFindAllKaryawanDto) {
    // ambil data karyawan
    const listKaryawanData = await this.proyekProdukRepo.masterFindAllKaryawan(
      {
        search: requestFilter.search,
        id_proyek_produk: requestFilter.id_proyek_produk,
        role: requestFilter.role,
      },
      {
        main: {},
      },
    );

    // buat response
    const res: MasterKaryawanFindAllResponse = {
      data: listKaryawanData.map((karyawan) => {
        const temp: MasterKaryawanFindAllResponseData = {
          id: karyawan.id,
          nama: karyawan.nama,
        };
        return temp;
      }),
    };

    return res;
  }

  async handleMasterStokFindAll(requestFilter: MasterFindAllStokDto) {
    // ambil data stok bahan
    const listStokBahan = await this.historyBahanMasukRepo.masterFindAllStok(
      {
        search: requestFilter.search,
        id_proyek_produk: requestFilter.id_proyek_produk,
      },
      {
        main: {},
        field1: 'id tgl_nota',
        nestedField1: '',
        field2: 'id nama',
        field3: 'id nama',
      },
    );

    // buat response
    const res: MasterStokFindAllResponse = {
      data: listStokBahan.map((stok) => {
        const temp: MasterStokFindAllResponseData = {
          id: stok.id,
          nama: stok.id_bahan.nama,
          tgl_stok: stok.id_history_bahan_masuk.tgl_nota,
        };
        return temp;
      }),
    };

    return res;
  }

  async handleMasterProyekFindAll(requestFilter: FindAllProyekDto) {
    // ambil data proyek
    const listProyek = await this.proyekRepo.masterFindAll(
      {
        nama: requestFilter.search,
        status: requestFilter.status,
      },
      {
        main: {},
        field1: 'id nama',
      },
    );

    // buat response
    const res: MasterProyekFindAllResponse = {
      data: listProyek.map((proyek) => {
        const temp: MasterProyekFindAllResponseData = {
          id: proyek.id,
          nama: proyek.nama,
        };
        return temp;
      }),
    };

    return res;
  }

  async handleMasterProyekProdukFindAll(requestFilter: FindAllProyekProdukDto) {
    // ambil data proyek produk
    const listProyekProduk = await this.proyekProdukRepo.masterFindAll(
      {
        id_proyek: requestFilter.id_proyek,
        status: requestFilter.status,
      },
      {
        main: {},
        field1: 'id nama',
        field2: 'id nama',
        field3: '',
        nestedField3: '',
      },
    );

    // buat response
    const res: MasterProyekProdukFindAllResponse = {
      data: listProyekProduk.map((proyek) => {
        const temp: MasterProyekProdukFindAllResponseData = {
          id: proyek.id,
          nama: proyek.id_produk.nama,
          tipe: proyek.tipe,
        };
        return temp;
      }),
    };

    return res;
  }
}
