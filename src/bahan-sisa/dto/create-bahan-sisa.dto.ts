import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateBahanSisaDto {
  @IsNumber({}, { message: 'id_history_bahan_keluar_detail must be a number' })
  @IsNotEmpty({ message: 'id_history_bahan_keluar_detail is required' })
  @Transform(({ value }) => Number(value))
  id_history_bahan_keluar_detail?: number;

  @IsNumber({}, { message: 'id_satuan must be a number' })
  @IsNotEmpty({ message: 'id_satuan is required' })
  @Transform(({ value }) => Number(value))
  id_satuan: number;

  @IsNumber({}, { message: 'qty must be a number' })
  @IsNotEmpty({ message: 'qty is required' })
  @Min(0, { message: 'qty must be positive number' })
  @Transform(({ value }) => Number(value))
  qty: number;

  @IsString()
  @IsOptional()
  keterangan?: string = null;
}

export class UpdateBahanSisaDto extends CreateBahanSisaDto {}

export class FindAllBahanSisaDto {
  @IsOptional()
  @IsNumber({}, { message: 'id_history_bahan_masuk_detail must be a number' })
  @Transform(({ value }) => Number(value))
  id_history_bahan_masuk_detail?: number = 0;

  @IsOptional()
  @IsNumber({}, { message: 'id_satuan must be a number' })
  @Transform(({ value }) => Number(value))
  id_satuan?: number = 0;

  @IsOptional()
  @IsNumber({}, { message: 'id_proyek must be a number' })
  @Transform(({ value }) => Number(value))
  id_proyek?: number = 0;

  @IsNumber({}, { message: 'page must be a number' })
  @IsOptional()
  @Min(1, { message: 'page must be greater than 0' })
  //transform buat olah value field sebelum masuk ke validasi
  @Transform(({ value }) => Number(value))
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'per_page must be greater than 0' })
  //transform buat olah value field sebelum masuk ke validasi
  @Transform(({ value }) => Number(value))
  per_page?: number = 10;
}
