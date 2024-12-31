import { Module } from '@nestjs/common';
import { HistoryMasukService } from './history-masuk.service';
import { HistoryMasukController } from './history-masuk.controller';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { HistoryBahanMasukRepository } from 'src/database/mongodb/repositories/historyBahanMasuk.repository';
import { SupplierRepository } from 'src/database/mongodb/repositories/supplier.repository';
import { SatuanRepository } from 'src/database/mongodb/repositories/satuan.repository';
import { BahanRepository } from 'src/database/mongodb/repositories/bahan.repository';
import { NotaRepository } from 'src/database/mongodb/repositories/nota.repository';
import { ProyekRepository } from 'src/database/mongodb/repositories/proyek.repository';
import { ProyekProdukRepository } from 'src/database/mongodb/repositories/proyek_produk.repository';
import { HelperModule } from 'src/helper/helper.module';

@Module({
  imports: [MongoDBModule, MongoDBProvider, HelperModule],
  controllers: [HistoryMasukController],
  providers: [
    HistoryMasukService,
    HistoryBahanMasukRepository,
    SupplierRepository,
    SatuanRepository,
    BahanRepository,
    NotaRepository,
    ProyekRepository,
    ProyekProdukRepository,
  ],
  exports: [HistoryMasukService],
})
export class HistoryMasukModule {}
