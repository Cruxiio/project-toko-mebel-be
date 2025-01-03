import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { SupplierModule } from './supplier/supplier.module';
import { CustomerModule } from './customer/customer.module';
import { MasterModule } from './master/master.module';
import { HistoryMasukModule } from './history-masuk/history-masuk.module';
import { SatuanModule } from './satuan/satuan.module';
import { BahanModule } from './bahan/bahan.module';
import { NotaModule } from './nota/nota.module';
import { ProyekModule } from './proyek/proyek.module';
import { KaryawanModule } from './karyawan/karyawan.module';
import { ProdukModule } from './produk/produk.module';
import { HistoryBahanKeluarModule } from './history-bahan-keluar/history-bahan-keluar.module';
import { BahanSisaModule } from './bahan-sisa/bahan-sisa.module';
import { ProdukJasaModule } from './produk-jasa/produk-jasa.module';

@Module({
  imports: [
    // ini supaya ConfigService bisa digunakan di seluruh aplikasi
    // ini biar variabel .env bisa dipakai di seluruh aplikasi
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available throughout the app
    }),
    // mongoose module
    // MongooseModule.forRoot('mongodb://localhost/db_mebel'),
    UserModule,
    AuthModule,
    DatabaseModule,
    SupplierModule,
    CustomerModule,
    MasterModule,
    HistoryMasukModule,
    SatuanModule,
    BahanModule,
    NotaModule,
    ProyekModule,
    KaryawanModule,
    ProdukModule,
    HistoryBahanKeluarModule,
    BahanSisaModule,
    ProdukJasaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
