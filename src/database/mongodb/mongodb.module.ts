import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './repositories/user.repository';
import { MongoDBProvider } from './mongodb.providers';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/db_mebel'),
    MongoDBProvider,
  ], // Koneksi MongoDB
  providers: [UserRepository],
  exports: [UserRepository], // Ekspor UserRepository untuk digunakan di fitur lain
})
export class MongoDBModule {}
