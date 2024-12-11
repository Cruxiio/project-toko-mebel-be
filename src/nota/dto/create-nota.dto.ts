import { BadRequestException } from '@nestjs/common';
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

export class NotaDetailDto {
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

  @IsNumber({}, { message: 'harga_satuan must be a number' })
  @IsNotEmpty({ message: 'harga_satuan is required' })
  @Min(1000, { message: 'harga_satuan must be greater than 1000' })
  @Transform(({ value }) => Number(value))
  harga_satuan: number;

  @IsNumber({}, { message: 'diskon must be a number' })
  @Min(0, { message: 'diskon must be positive number' })
  @IsNotEmpty({ message: 'diskon is required' })
  @Transform(({ value }) => Number(value))
  diskon: number = 0;
}

export class CreateNotaDto {
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

  @IsNumber({}, { message: 'total_pajak must be a number' })
  @Min(0, { message: 'total_pajak must be positive number' })
  @IsNotEmpty({ message: 'total_pajak is required' })
  @Transform(({ value }) => Number(value))
  total_pajak: number = 0;

  @IsNumber({}, { message: 'diskon_akhir must be a number' })
  @Min(0, { message: 'diskon_akhir must be positive number' })
  @IsNotEmpty({ message: 'diskon_akhir is required' })
  @Transform(({ value }) => Number(value))
  diskon_akhir: number = 0;

  @IsArray({ message: 'detail must be an array' })
  @IsNotEmpty({ message: 'detail is required' })
  // Validasi setiap elemen array
  @ValidateNested({ each: true })
  // kasi tau object typenya dari tiap elemen di array
  @Type(() => NotaDetailDto)
  detail: NotaDetailDto[];
}

export class UpdateNotaDto {}

export class FindAllNotaDto {
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

  @IsOptional()
  @IsDate({ message: 'tgl_input must be a date' })
  @Transform(({ value }) => {
    // validate tgL_nota format
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex untuk format YYYY-MM-DD
    if (!regex.test(value)) {
      throw new BadRequestException('tgl_input must be in YYYY-MM-DD format');
    }

    return new Date(value);
  })
  tgl_input?: Date = null;

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
