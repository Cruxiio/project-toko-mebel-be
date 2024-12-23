import { Module } from '@nestjs/common';
import { ProyekService } from './proyek.service';
import { ProyekController } from './proyek.controller';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { ProyekRepository } from 'src/database/mongodb/repositories/proyek.repository';
import { CustomerRepository } from 'src/database/mongodb/repositories/customer.repository';
import { TeamRepository } from 'src/database/mongodb/repositories/team.repository';
import { ProyekProdukRepository } from 'src/database/mongodb/repositories/proyek_produk.repository';
import { ProdukRepository } from 'src/database/mongodb/repositories/produk.repository';

@Module({
  imports: [MongoDBModule, MongoDBProvider],
  controllers: [ProyekController],
  providers: [
    ProyekService,
    ProyekRepository,
    CustomerRepository,
    TeamRepository,
    ProdukRepository,
    ProyekProdukRepository,
  ],
  exports: [ProyekService],
})
export class ProyekModule {}
