import { Module } from '@nestjs/common';
import { ProdukJasaService } from './produk-jasa.service';
import { ProdukJasaController } from './produk-jasa.controller';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { HelperModule } from 'src/helper/helper.module';
import { SatuanRepository } from 'src/database/mongodb/repositories/satuan.repository';
import { ProdukRepository } from 'src/database/mongodb/repositories/produk.repository';
import { ProdukJasaRepository } from 'src/database/mongodb/repositories/produkJasa.repository';

@Module({
  imports: [MongoDBModule, MongoDBProvider, HelperModule],
  controllers: [ProdukJasaController],
  providers: [
    ProdukJasaService,
    ProdukJasaRepository,
    SatuanRepository,
    ProdukRepository,
  ],
  exports: [ProdukJasaService],
})
export class ProdukJasaModule {}
