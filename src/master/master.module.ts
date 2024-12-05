import { Module } from '@nestjs/common';
import { MasterService } from './master.service';
import { MasterController } from './master.controller';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { SupplierRepository } from 'src/database/mongodb/repositories/supplier.repository';
import { CustomerRepository } from 'src/database/mongodb/repositories/customer.repository';

@Module({
  imports: [MongoDBModule, MongoDBProvider],
  controllers: [MasterController],
  providers: [MasterService, SupplierRepository, CustomerRepository],
  exports: [MasterService],
})
export class MasterModule {}
