import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MasterService } from './master.service';
import {
  MasterFindAllKaryawanDto,
  MasterFindAllSatuanDto,
  MasterFindAllStokDto,
} from './dto/create-master.dto';
import { FindAllSupplierDto } from 'src/supplier/dto/supplier_request.dto';
import { FindAllCustomerDto } from 'src/customer/dto/customer.dto';
import { FindAllSatuanDto } from 'src/satuan/dto/satuan.dto';
import { FindAllBahanDto } from 'src/bahan/dto/bahan.dto';
import {
  FindAllHistoryMasukDto,
  FindAllStokDto,
} from 'src/history-masuk/dto/create-history-masuk.dto';
import { FindAllKaryawanDto } from 'src/karyawan/dto/create-karyawan.dto';
import {
  FindAllProyekDto,
  FindAllProyekProdukDto,
} from 'src/proyek/dto/create-proyek.dto';

@Controller('api/master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Get('supplier')
  findAllSupplier(@Query() requestFilter: FindAllSupplierDto) {
    return this.masterService.handleMasterSupplierFindAll(requestFilter);
  }

  @Get('customer')
  findAllCustomer(@Query() requestFilter: FindAllCustomerDto) {
    return this.masterService.handleMasterCustomerFindAll(requestFilter);
  }

  @Get('satuan')
  findAllSatuan(@Query() requestFilter: MasterFindAllSatuanDto) {
    return this.masterService.handleMasterSatuanFindAll(requestFilter);
  }

  @Get('bahan')
  findAllBahan(@Query() requestFilter: FindAllBahanDto) {
    return this.masterService.handleMasterBahanFindAll(requestFilter);
  }

  @Get('history-bahan-masuk')
  findAllHistoryBahanMasuk(@Query() requestFilter: FindAllHistoryMasukDto) {
    return this.masterService.handleMasterHistoryBahanMasukFindAll(
      requestFilter,
    );
  }

  @Get('karyawan')
  findAllKaryawanMasuk(@Query() requestFilter: MasterFindAllKaryawanDto) {
    return this.masterService.handleMasterKaryawanFindAll(requestFilter);
  }

  @Get('stok')
  findAllStok(@Query() requestFilter: MasterFindAllStokDto) {
    return this.masterService.handleMasterStokFindAll(requestFilter);
  }

  @Get('proyek')
  findAllProyek(@Query() requestFilter: FindAllProyekDto) {
    return this.masterService.handleMasterProyekFindAll(requestFilter);
  }

  @Get('proyek-produk')
  findAllProyekProduk(@Query() requestFilter: FindAllProyekProdukDto) {
    return this.masterService.handleMasterProyekProdukFindAll(requestFilter);
  }
}
