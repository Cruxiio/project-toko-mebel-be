import { Module } from '@nestjs/common';
import { ProyekService } from './proyek.service';
import { ProyekController } from './proyek.controller';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { ProyekRepository } from 'src/database/mongodb/repositories/proyek.repository';
import { CustomerRepository } from 'src/database/mongodb/repositories/customer.repository';

@Module({
  imports: [MongoDBModule, MongoDBProvider],
  controllers: [ProyekController],
  providers: [ProyekService, ProyekRepository, CustomerRepository],
  exports: [ProyekService],
})
export class ProyekModule {}
