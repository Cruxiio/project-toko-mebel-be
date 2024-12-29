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
import { ProdukRepository } from './repositories/produk.repository';
import { TeamRepository } from './repositories/team.repository';
import { ProyekProdukRepository } from './repositories/proyek_produk.repository';
import { HelperModule } from 'src/helper/helper.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/db_mebel'),
    MongoDBProvider,
    HelperModule,
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
    ProdukRepository,
    TeamRepository,
    ProyekProdukRepository,
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
    ProdukRepository,
    TeamRepository,
    ProyekProdukRepository,
  ], // Ekspor agar dapat digunakan di fitur lain
})
export class MongoDBModule {}
