import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateProyekDto {
  @IsNumber({}, { message: 'id_customer must be a number' })
  @IsNotEmpty({ message: 'id_customer is required' })
  @Transform(({ value }) => Number(value))
  id_customer: number;

  @IsString()
  @IsNotEmpty({ message: 'nama is required' })
  nama: string;

  @IsNotEmpty({ message: 'start date is required' })
  @IsDate({ message: 'start date must be a date' })
  @Transform(({ value }) => {
    // validate tgL_nota format
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex untuk format YYYY-MM-DD
    if (!regex.test(value)) {
      throw new BadRequestException('start date must be in YYYY-MM-DD format');
    }

    return new Date(value);
  })
  start: Date;

  @IsNotEmpty({ message: 'deadline date is required' })
  @IsDate({ message: 'deadline date must be a date' })
  @Transform(({ value }) => {
    // validate tgL_nota format
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex untuk format YYYY-MM-DD
    if (!regex.test(value)) {
      throw new BadRequestException(
        'deadline date must be in YYYY-MM-DD format',
      );
    }

    return new Date(value);
  })
  deadline: Date;

  @IsString()
  @IsNotEmpty({ message: 'alamat_pengiriman is required' })
  alamat_pengiriman: string;
}

export class UpdateProyekDto extends CreateProyekDto {}

export class FindAllProyekDto {
  @IsString()
  @IsOptional()
  search?: string = '';

  @IsNumber({}, { message: 'id_customer must be a number' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  id_customer?: number = 0;

  @IsOptional()
  @IsDate({ message: 'start date must be a date' })
  @Transform(({ value }) => {
    // validate tgL_nota format
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex untuk format YYYY-MM-DD
    if (!regex.test(value)) {
      throw new BadRequestException('start date must be in YYYY-MM-DD format');
    }

    return new Date(value);
  })
  start?: Date = null;

  @IsOptional()
  @IsDate({ message: 'deadline date must be a date' })
  @Transform(({ value }) => {
    // validate tgL_nota format
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex untuk format YYYY-MM-DD
    if (!regex.test(value)) {
      throw new BadRequestException(
        'deadline date must be in YYYY-MM-DD format',
      );
    }

    return new Date(value);
  })
  deadline?: Date = null;

  @ValidateIf((o) => o.tipe !== 'all')
  @IsString()
  @IsOptional()
  @IsIn(['all', 'true', 'false'], {
    message: 'status proyek must be all, true, or false',
  })
  status?: string = 'all';

  @IsNumber({}, { message: 'page must be a number' })
  @IsOptional()
  //transform buat olah value field sebelum masuk ke validasi
  @Transform(({ value }) => Number(value))
  page?: number = 1;

  @IsNumber({}, { message: 'per_page must be a number' })
  @IsOptional()
  //transform buat olah value field sebelum masuk ke validasi
  @Transform(({ value }) => Number(value))
  per_page?: number = 10;
}

// ============= proyek produk DTO =============
export class UpdateProyekProdukDto {
  @IsString()
  @IsNotEmpty({ message: 'nama_produk is required' })
  nama_produk: string;

  @IsNumber({}, { message: 'id_penanggung_jawab must be a number' })
  @IsNotEmpty({ message: 'id_penanggung_jawab is required' })
  @Transform(({ value }) => Number(value))
  id_penanggung_jawab: number;

  @IsNumber({}, { message: 'id_karyawan1 must be a number' })
  @IsNotEmpty({ message: 'id_karyawan1 is required' })
  @Transform(({ value }) => Number(value))
  id_karyawan1: number;

  @IsNumber({}, { message: 'id_karyawan2 must be a number' })
  @IsNotEmpty({ message: 'id_karyawan2 is required' })
  @Transform(({ value }) => Number(value))
  id_karyawan2: number;

  @IsNumber({}, { message: 'qty must be a number' })
  @IsNotEmpty({ message: 'qty is required' })
  @Min(1, { message: 'qty must be greater than 0' })
  @Transform(({ value }) => Number(value))
  qty: number;

  @IsString()
  @IsNotEmpty({ message: 'tipe is required' })
  @IsIn(['kayu', 'finishing', 'resin'], {
    message: 'tipe proyek must be kayu, finishing, or resin',
  })
  tipe: string;
}

export class CreateProyekProdukDto extends UpdateProyekProdukDto {
  @IsNumber({}, { message: 'id_proyek must be a number' })
  @IsNotEmpty({ message: 'id_proyek is required' })
  @Transform(({ value }) => Number(value))
  id_proyek: number;
}

export class FindAllProyekProdukDto {
  @IsNumber({}, { message: 'id_proyek must be a number' })
  @Min(0, { message: 'id_proyek must be greater than 0' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  id_proyek?: number = 0;

  @IsNumber({}, { message: 'id_produk must be a number' })
  @Min(0, { message: 'id_produk must be greater than 0' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  id_produk?: number = 0;

  @IsNumber({}, { message: 'id_karyawan must be a number' })
  @Min(0, { message: 'id_karyawan must be greater than 0' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  id_karyawan?: number = 0;

  // tipe proyek
  @ValidateIf((o) => o.tipe !== '')
  @IsString()
  @IsOptional()
  @IsIn(['kayu', 'finishing', 'resin'], {
    message: 'tipe proyek must be kayu, finishing, or resin',
  })
  tipe?: string = '';

  @ValidateIf((o) => o.tipe !== 'all')
  @IsString()
  @IsOptional()
  @IsIn(['all', 'true', 'false'], {
    message: 'status proyek must be all, true, or false',
  })
  status?: string = 'all';

  @IsNumber({}, { message: 'page must be a number' })
  @Min(1, { message: 'page must be greater than 0' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page?: number = 1;

  @IsNumber({}, { message: 'per_page must be a number' })
  @Min(1, { message: 'page must be greater than 0' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  per_page?: number = 10;
}
