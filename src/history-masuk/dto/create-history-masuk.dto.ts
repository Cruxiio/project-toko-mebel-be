import { BadRequestException } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class HistoryBahanMasukDetailDto {
  @IsNumber({}, { message: 'id_bahan must be a number' })
  @IsNotEmpty({ message: 'id_bahan is required' })
  id_bahan: number;

  @IsNumber({}, { message: 'id_satuan must be a number' })
  @IsNotEmpty({ message: 'id_satuan is required' })
  id_satuan: number;

  @IsNumber({}, { message: 'qty must be a number' })
  @IsNotEmpty({ message: 'qty is required' })
  @Min(1, { message: 'qty must be greater than 0' })
  qty: number;
}

export class CreateHistoryMasukDto {
  @IsString()
  @IsNotEmpty({ message: 'kode_nota is required' })
  kode_nota: string;

  @IsNumber({}, { message: 'id_supplier must be a number' })
  @IsNotEmpty({ message: 'id_supplier is required' })
  @Transform(({ value }) => Number(value))
  id_supplier: number;

  @IsNotEmpty({ message: 'tgl_nota is required' })
  @IsDate({ message: 'tgl_nota must be a date' })
  @Transform(({ value }) => {
    // validate tgL_nota format
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex untuk format YYYY-MM-DD
    if (!regex.test(value)) {
      throw new BadRequestException('tgl_nota must be in YYYY-MM-DD format');
    }

    return new Date(value);
  })
  tgl_nota: Date;

  @IsString()
  @IsNotEmpty({ message: 'no_spb is required' })
  no_spb: string;

  @IsArray({ message: 'detail must be an array' })
  @IsNotEmpty({ message: 'detail is required' })
  // Validasi setiap elemen array
  @ValidateNested({ each: true })
  // kasi tau object typenya dari tiap elemen di array
  @Type(() => HistoryBahanMasukDetailDto)
  detail: HistoryBahanMasukDetailDto[];
}

export class UpdateHistoryMasukDto extends CreateHistoryMasukDto {}

export class FindAllHistoryMasukDto {
  @IsString()
  @IsOptional()
  search?: string = '';

  @IsNumber({}, { message: 'id_supplier must be a number' })
  @IsOptional()
  //transform buat olah value field sebelum masuk ke validasi
  @Transform(({ value }) => Number(value))
  id_supplier?: number = null;

  @IsOptional()
  @IsDate({ message: 'tgl_nota must be a date' })
  @Transform(({ value }) => {
    // validate tgL_nota format
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex untuk format YYYY-MM-DD
    if (!regex.test(value)) {
      throw new BadRequestException('tgl_nota must be in YYYY-MM-DD format');
    }

    return new Date(value);
  })
  tgl_nota?: Date = null;

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

export class FindAllStokDto {
  @IsString()
  @IsOptional()
  search?: string = '';

  @IsOptional()
  @IsDate({ message: 'tgl_nota must be a date' })
  @Transform(({ value }) => {
    // validate tgL_nota format
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex untuk format YYYY-MM-DD
    if (!regex.test(value)) {
      throw new BadRequestException('tgl_nota must be in YYYY-MM-DD format');
    }

    return new Date(value);
  })
  tgl_nota?: Date = null;

  @IsNumber({}, { message: 'id_supplier must be a number' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  id_supplier?: number = 0;

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
