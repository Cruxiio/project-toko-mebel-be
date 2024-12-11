import { Module } from '@nestjs/common';
import { NotaService } from './nota.service';
import { NotaController } from './nota.controller';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { NotaRepository } from 'src/database/mongodb/repositories/nota.repository';
import { SatuanRepository } from 'src/database/mongodb/repositories/satuan.repository';
import { BahanRepository } from 'src/database/mongodb/repositories/bahan.repository';
import { SupplierRepository } from 'src/database/mongodb/repositories/supplier.repository';
import { HistoryBahanMasukRepository } from 'src/database/mongodb/repositories/historyBahanMasuk.repository';

@Module({
  imports: [MongoDBModule, MongoDBProvider],
  controllers: [NotaController],
  providers: [
    NotaService,
    NotaRepository,
    SatuanRepository,
    BahanRepository,
    SupplierRepository,
    HistoryBahanMasukRepository,
  ],
  exports: [NotaService],
})
export class NotaModule {}
