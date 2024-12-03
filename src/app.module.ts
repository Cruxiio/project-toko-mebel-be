import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { SupplierModule } from './supplier/supplier.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
