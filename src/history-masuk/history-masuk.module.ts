import { Module } from '@nestjs/common';
import { HistoryMasukService } from './history-masuk.service';
import { HistoryMasukController } from './history-masuk.controller';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { HistoryBahanMasukRepository } from 'src/database/mongodb/repositories/historyBahanMasuk.repository';
import { SupplierRepository } from 'src/database/mongodb/repositories/supplier.repository';
import { SatuanRepository } from 'src/database/mongodb/repositories/satuan.repository';
import { BahanRepository } from 'src/database/mongodb/repositories/bahan.repository';

@Module({
  imports: [MongoDBModule, MongoDBProvider],
  controllers: [HistoryMasukController],
  providers: [
    HistoryMasukService,
    HistoryBahanMasukRepository,
    SupplierRepository,
    SatuanRepository,
    BahanRepository,
  ],
  exports: [HistoryMasukService],
})
export class HistoryMasukModule {}
