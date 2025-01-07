import { Module } from '@nestjs/common';
import { LaporanService } from './laporan.service';
import { LaporanController } from './laporan.controller';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { HelperModule } from 'src/helper/helper.module';
import { LaporanRepository } from 'src/database/mongodb/repositories/laporan.repository';
import { HistoryBahanKeluarModule } from 'src/history-bahan-keluar/history-bahan-keluar.module';
import { NotaModule } from 'src/nota/nota.module';

@Module({
  imports: [
    MongoDBModule,
    MongoDBProvider,
    HelperModule,
    HistoryBahanKeluarModule,
    NotaModule,
  ],
  controllers: [LaporanController],
  providers: [LaporanService, LaporanRepository],
  exports: [LaporanService],
})
export class LaporanModule {}
