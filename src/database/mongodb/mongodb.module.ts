import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './repositories/user.repository';
import { MongoDBProvider } from './mongodb.providers';
import { SupplierRepository } from './repositories/supplier.repository';
import { CustomerRepository } from './repositories/customer.repository';
import { BahanRepository } from './repositories/bahan.repository';
import { SatuanRepository } from './repositories/satuan.repository';
import { NotaRepository } from './repositories/nota.repository';
import { HistoryBahanMasukRepository } from './repositories/historyBahanMasuk.repository';
import { ProyekRepository } from './repositories/proyek.repository';
import { KaryawanRepository } from './repositories/karyawan.repository';

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
    SatuanRepository,
    HistoryBahanMasukRepository,
    NotaRepository,
    ProyekRepository,
    KaryawanRepository,
  ],
  exports: [
    UserRepository,
    SupplierRepository,
    CustomerRepository,
    BahanRepository,
    SatuanRepository,
    HistoryBahanMasukRepository,
    NotaRepository,
    ProyekRepository,
    KaryawanRepository,
  ], // Ekspor agar dapat digunakan di fitur lain
})
export class MongoDBModule {}
