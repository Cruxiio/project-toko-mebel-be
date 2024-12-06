import { Module } from '@nestjs/common';
import { BahanService } from './bahan.service';
import { BahanController } from './bahan.controller';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { BahanRepository } from 'src/database/mongodb/repositories/bahan.repository';

@Module({
  imports: [MongoDBModule, MongoDBProvider],
  controllers: [BahanController],
  providers: [BahanService, BahanRepository],
  exports: [BahanService],
})
export class BahanModule {}
