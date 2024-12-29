import { Module } from '@nestjs/common';
import { MasterService } from './master.service';
import { MasterController } from './master.controller';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { SupplierRepository } from 'src/database/mongodb/repositories/supplier.repository';
import { CustomerRepository } from 'src/database/mongodb/repositories/customer.repository';
import { SatuanRepository } from 'src/database/mongodb/repositories/satuan.repository';
import { BahanRepository } from 'src/database/mongodb/repositories/bahan.repository';
import { HistoryBahanMasukRepository } from 'src/database/mongodb/repositories/historyBahanMasuk.repository';
import { KaryawanRepository } from 'src/database/mongodb/repositories/karyawan.repository';
import { ProyekRepository } from 'src/database/mongodb/repositories/proyek.repository';
import { ProyekProdukRepository } from 'src/database/mongodb/repositories/proyek_produk.repository';
import { ProdukRepository } from 'src/database/mongodb/repositories/produk.repository';
import { HelperModule } from 'src/helper/helper.module';

@Module({
  imports: [MongoDBModule, MongoDBProvider, HelperModule],
  controllers: [MasterController],
  providers: [
    MasterService,
    SupplierRepository,
    CustomerRepository,
    SatuanRepository,
    BahanRepository,
    HistoryBahanMasukRepository,
    KaryawanRepository,
    ProyekRepository,
    ProyekProdukRepository,
    ProdukRepository,
  ],
  exports: [MasterService],
})
export class MasterModule {}
