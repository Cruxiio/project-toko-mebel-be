import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBahanDto {
  @IsString()
  @IsNotEmpty({ message: 'nama is required' })
  nama: string;
}

export class UpdateBahanDto extends PartialType(CreateBahanDto) {}

export class FindAllBahanDto {
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
