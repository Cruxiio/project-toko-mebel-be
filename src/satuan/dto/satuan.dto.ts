import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateSatuanDto {
  @IsString()
  @IsNotEmpty({ message: 'nama is required' })
  nama: string;

  @IsString()
  @IsNotEmpty({ message: 'satuan_terkecil is required' })
  satuan_terkecil: string;

  @IsNumber()
  @IsNotEmpty({ message: 'konversi is required' })
  @Min(1, { message: 'konversi must be at least 1' })
  @Transform(({ value }) => Number(value))
  konversi: number;
}

export class UpdateSatuanDto extends CreateSatuanDto {}

export class FindAllSatuanDto {
  @IsString()
  @IsOptional()
  search?: string = '';

  @IsNumber({}, { message: 'page must be a number' })
  @IsOptional()
  //transform buat olah value field sebelum masuk ke validasi
  @Transform(({ value }) => Number(value))
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  //transform buat olah value field sebelum masuk ke validasi
  @Transform(({ value }) => Number(value))
  per_page?: number = 10;
}
