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
import { CreateMasterDto } from './dto/create-master.dto';
import { FindAllSupplierDto } from 'src/supplier/dto/supplier_request.dto';
import { FindAllCustomerDto } from 'src/customer/dto/customer.dto';
import { FindAllSatuanDto } from 'src/satuan/dto/satuan.dto';
import { FindAllBahanDto } from 'src/bahan/dto/bahan.dto';
import {
  FindAllHistoryMasukDto,
  FindAllStokDto,
} from 'src/history-masuk/dto/create-history-masuk.dto';
import { FindAllKaryawanDto } from 'src/karyawan/dto/create-karyawan.dto';

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
  findAllSatuan(@Query() requestFilter: FindAllSatuanDto) {
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
  findAllKaryawanMasuk(@Query() requestFilter: FindAllKaryawanDto) {
    return this.masterService.handleMasterKaryawanFindAll(requestFilter);
  }

  @Get('stok')
  findAllStok(@Query() requestFilter: FindAllStokDto) {
    return this.masterService.handleMasterStokFindAll(requestFilter);
  }
}
