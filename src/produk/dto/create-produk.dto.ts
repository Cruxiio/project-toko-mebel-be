import { BadRequestException } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class DetailProdukDto {
  @IsNumber({}, { message: 'id_bahan must be a number' })
  @IsNotEmpty({ message: 'id_bahan is required' })
  @Transform(({ value }) => Number(value))
  id_bahan: number;

  @IsNumber({}, { message: 'id_satuan must be a number' })
  @IsNotEmpty({ message: 'id_satuan is required' })
  @Transform(({ value }) => Number(value))
  id_satuan: number;

  @IsNumber({}, { message: 'qty must be a number' })
  @IsNotEmpty({ message: 'qty is required' })
  @Min(1, { message: 'qty must be greater than 0' })
  @Transform(({ value }) => Number(value))
  qty: number;

  @IsString()
  @IsOptional()
  keterangan: string = null;
}

export class CreateProdukDto {
  @IsString()
  @IsNotEmpty({ message: 'nama is required' })
  nama: string;
}

export class UpdateProdukDto {
  @IsString()
  @IsNotEmpty({ message: 'nama is required' })
  nama: string;

  @IsArray({ message: 'detail must be an array' })
  @IsNotEmpty({ message: 'detail is required' })
  // Validasi setiap elemen array
  @ValidateNested({ each: true })
  // kasi tau object typenya dari tiap elemen di array
  @Type(() => DetailProdukDto)
  detail: DetailProdukDto[];
}

export class FindAllProdukDto {
  @IsString()
  @IsOptional()
  search?: string = '';

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
