import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty({ message: 'nama is required' })
  nama: string;

  @IsString()
  @IsNotEmpty({ message: 'no_telepon is required' })
  @MinLength(10, { message: 'no_telepon must be at least 10 characters' })
  @IsNumberString(
    { no_symbols: true },
    { message: 'no_telepon must be a number' },
  )
  no_telepon: string;

  @IsString()
  @IsNotEmpty({ message: 'alamat is required' })
  alamat: string;
}

export class UpdateCustomerDto extends CreateCustomerDto {}

export class FindAllCustomerDto {
  @IsString()
  @IsOptional()
  search?: string = '';

  @IsString()
  @IsOptional()
  no_telepon?: string = null;

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
