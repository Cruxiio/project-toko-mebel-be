import { Module } from '@nestjs/common';
import { BahanSisaService } from './bahan-sisa.service';
import { BahanSisaController } from './bahan-sisa.controller';
import { BahanSisaRepository } from 'src/database/mongodb/repositories/bahanSisa.repository';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { HelperModule } from 'src/helper/helper.module';
import { HistoryBahanKeluarRepository } from 'src/database/mongodb/repositories/historyBahanKeluar.repository';
import { SatuanRepository } from 'src/database/mongodb/repositories/satuan.repository';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';

@Module({
  imports: [MongoDBModule, MongoDBProvider, HelperModule],
  controllers: [BahanSisaController],
  providers: [
    BahanSisaService,
    BahanSisaRepository,
    HistoryBahanKeluarRepository,
    SatuanRepository,
  ],
  exports: [BahanSisaService],
})
export class BahanSisaModule {}
