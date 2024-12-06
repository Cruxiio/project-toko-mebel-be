import { Module } from '@nestjs/common';
import { SatuanService } from './satuan.service';
import { SatuanController } from './satuan.controller';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { SatuanRepository } from 'src/database/mongodb/repositories/satuan.repository';

@Module({
  imports: [MongoDBModule, MongoDBProvider],
  controllers: [SatuanController],
  providers: [SatuanService, SatuanRepository],
  exports: [SatuanService],
})
export class SatuanModule {}
