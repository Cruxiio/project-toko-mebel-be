import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './repositories/user.repository';
import { MongoDBProvider } from './mongodb.providers';
import { SupplierRepository } from './repositories/supplier.repository';
import { CustomerRepository } from './repositories/customer.repository';
import { BahanRepository } from './repositories/bahan.repository';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/db_mebel'),
    MongoDBProvider,
  ], // Koneksi MongoDB
  providers: [
    UserRepository,
    SupplierRepository,
    CustomerRepository,
    BahanRepository,
  ],
  exports: [
    UserRepository,
    SupplierRepository,
    CustomerRepository,
    BahanRepository,
  ], // Ekspor agar dapat digunakan di fitur lain
})
export class MongoDBModule {}
