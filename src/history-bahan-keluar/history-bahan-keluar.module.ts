import { Module } from '@nestjs/common';
import { HistoryBahanKeluarService } from './history-bahan-keluar.service';
import { HistoryBahanKeluarController } from './history-bahan-keluar.controller';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { HelperModule } from 'src/helper/helper.module';
import { HistoryBahanKeluarRepository } from 'src/database/mongodb/repositories/historyBahanKeluar.repository';
import { KaryawanRepository } from 'src/database/mongodb/repositories/karyawan.repository';
import { ProyekProdukRepository } from 'src/database/mongodb/repositories/proyek_produk.repository';
import { HistoryBahanMasukRepository } from 'src/database/mongodb/repositories/historyBahanMasuk.repository';
import { SatuanRepository } from 'src/database/mongodb/repositories/satuan.repository';

@Module({
  imports: [MongoDBModule, MongoDBProvider, HelperModule],
  controllers: [HistoryBahanKeluarController],
  providers: [
    HistoryBahanKeluarService,
    HistoryBahanKeluarRepository,
    KaryawanRepository,
    ProyekProdukRepository,
    HistoryBahanMasukRepository,
    SatuanRepository,
  ],
  exports: [HistoryBahanKeluarService],
})
export class HistoryBahanKeluarModule {}
