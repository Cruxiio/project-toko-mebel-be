import { Module } from '@nestjs/common';
import { MongoDBModule } from 'src/database/mongodb/mongodb.module';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';
import { HelperService } from './helper.service';

@Module({
  //   imports: [MongoDBModule, MongoDBProvider],
  providers: [HelperService],
  exports: [HelperService],
})
export class HelperModule {}
