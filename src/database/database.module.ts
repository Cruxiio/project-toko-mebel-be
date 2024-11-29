import { Module } from '@nestjs/common';
// import { MongoDBProvider } from './mongodb/mongodb.providers';
import { MongoDBModule } from './mongodb/mongodb.module';
// import { MySQLProvider } from './mysql.providers';
// import { MysqlModule } from './mysql/mysql.module';

@Module({
  imports: [MongoDBModule],
  // providers: [MySQLProvider],
  exports: [MongoDBModule],
})
export class DatabaseModule {}
