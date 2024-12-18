import { Module } from '@nestjs/common';
import { ProdukService } from './produk.service';
import { ProdukController } from './produk.controller';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { ProdukRepository } from 'src/database/mongodb/repositories/produk.repository';

@Module({
  imports: [MongoDBModule, MongoDBProvider],
  controllers: [ProdukController],
  providers: [ProdukService, ProdukRepository],
  exports: [ProdukService],
})
export class ProdukModule {}
