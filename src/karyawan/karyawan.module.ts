import { Module } from '@nestjs/common';
import { KaryawanService } from './karyawan.service';
import { KaryawanController } from './karyawan.controller';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { KaryawanRepository } from 'src/database/mongodb/repositories/karyawan.repository';

@Module({
  imports: [MongoDBModule, MongoDBProvider],
  controllers: [KaryawanController],
  providers: [KaryawanService, KaryawanRepository],
  exports: [KaryawanService],
})
export class KaryawanModule {}
