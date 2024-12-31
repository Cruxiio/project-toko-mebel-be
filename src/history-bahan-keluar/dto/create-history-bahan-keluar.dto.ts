import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';

export class HistoryBahanKeluarDetailDto {
  @IsNumber({}, { message: 'id_history_bahan_masuk_detail must be a number' })
  @IsNotEmpty({ message: 'id_history_bahan_masuk_detail is required' })
  @Transform(({ value }) => Number(value))
  id_history_bahan_masuk_detail: number;

  @IsNumber({}, { message: 'id_satuan must be a number' })
  @IsNotEmpty({ message: 'id_satuan is required' })
  @Transform(({ value }) => Number(value))
  id_satuan: number;

  @IsNumber({}, { message: 'qty must be a number' })
  @IsNotEmpty({ message: 'qty is required' })
  @Min(1, { message: 'qty must be greater than 0' })
  @Transform(({ value }) => Number(value))
  qty: number;
}

export class CreateHistoryBahanKeluarDto {
  @IsNumber({}, { message: 'id_proyek_produk must be a number' })
  @IsNotEmpty({ message: 'id_proyek_produk is required' })
  @Transform(({ value }) => Number(value))
  id_proyek_produk: number;

  @IsNumber({}, { message: 'id_karyawan must be a number' })
  @IsNotEmpty({ message: 'id_karyawan is required' })
  @Transform(({ value }) => Number(value))
  id_karyawan: number;

  @IsArray({ message: 'detail must be an array' })
  @IsNotEmpty({ message: 'detail is required' })
  // Validasi setiap elemen array
  @ValidateNested({ each: true })
  // kasi tau object typenya dari tiap elemen di array
  @Type(() => HistoryBahanKeluarDetailDto)
  detail: HistoryBahanKeluarDetailDto[];
}

export class UpdateHistoryBahanKeluarDto extends CreateHistoryBahanKeluarDto {}

export class FindAllHistoryBahanKeluarDto {
  @IsNumber({}, { message: 'id_proyek_produk must be a number' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  id_proyek_produk?: number = 0;

  @IsNumber({}, { message: 'id_karyawan must be a number' })
  @IsOptional()
  //transform buat olah value field sebelum masuk ke validasi
  @Transform(({ value }) => Number(value))
  id_karyawan?: number = 0;

  @IsNumber({}, { message: 'page must be a number' })
  @IsOptional()
  @Min(1, { message: 'per_page must be greater than 0' })
  //transform buat olah value field sebelum masuk ke validasi
  @Transform(({ value }) => Number(value))
  page?: number = 1;

  @IsNumber({}, { message: 'per_page must be a number' })
  @IsOptional()
  @Min(1, { message: 'per_page must be greater than 0' })
  //transform buat olah value field sebelum masuk ke validasi
  @Transform(({ value }) => Number(value))
  per_page?: number = 10;
}
