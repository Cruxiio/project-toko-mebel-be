import { Module } from '@nestjs/common';
import { ProdukService } from './produk.service';
import { ProdukController } from './produk.controller';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { ProdukRepository } from 'src/database/mongodb/repositories/produk.repository';
import { HelperModule } from 'src/helper/helper.module';

@Module({
  imports: [MongoDBModule, MongoDBProvider, HelperModule],
  controllers: [ProdukController],
  providers: [ProdukService, ProdukRepository],
  exports: [ProdukService],
})
export class ProdukModule {}
