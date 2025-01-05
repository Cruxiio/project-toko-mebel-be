import { Module } from '@nestjs/common';
import { LaporanService } from './laporan.service';
import { LaporanController } from './laporan.controller';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { HelperModule } from 'src/helper/helper.module';
import { LaporanRepository } from 'src/database/mongodb/repositories/laporan.repository';

@Module({
  imports: [MongoDBModule, MongoDBProvider, HelperModule],
  controllers: [LaporanController],
  providers: [LaporanService, LaporanRepository],
  exports: [LaporanService],
})
export class LaporanModule {}
