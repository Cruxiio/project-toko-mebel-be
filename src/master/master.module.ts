import { Module } from '@nestjs/common';
import { MasterService } from './master.service';
import { MasterController } from './master.controller';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { SupplierRepository } from 'src/database/mongodb/repositories/supplier.repository';
import { CustomerRepository } from 'src/database/mongodb/repositories/customer.repository';
import { SatuanRepository } from 'src/database/mongodb/repositories/satuan.repository';
import { BahanRepository } from 'src/database/mongodb/repositories/bahan.repository';

@Module({
  imports: [MongoDBModule, MongoDBProvider],
  controllers: [MasterController],
  providers: [
    MasterService,
    SupplierRepository,
    CustomerRepository,
    SatuanRepository,
    BahanRepository,
  ],
  exports: [MasterService],
})
export class MasterModule {}
