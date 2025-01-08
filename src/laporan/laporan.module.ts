import { Module } from '@nestjs/common';
import { LaporanService } from './laporan.service';
import { LaporanController } from './laporan.controller';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { HelperModule } from 'src/helper/helper.module';
import { LaporanRepository } from 'src/database/mongodb/repositories/laporan.repository';
import { HistoryBahanKeluarModule } from 'src/history-bahan-keluar/history-bahan-keluar.module';
import { NotaModule } from 'src/nota/nota.module';
import { HistoryMasukModule } from 'src/history-masuk/history-masuk.module';

@Module({
  imports: [
    MongoDBModule,
    MongoDBProvider,
    HelperModule,
    HistoryBahanKeluarModule,
    HistoryMasukModule,
    NotaModule,
  ],
  controllers: [LaporanController],
  providers: [LaporanService, LaporanRepository],
  exports: [LaporanService],
})
export class LaporanModule {}
