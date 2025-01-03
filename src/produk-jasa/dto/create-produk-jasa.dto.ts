import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProdukJasaDto {
  @IsNumber({}, { message: 'id_produk must be a number' })
  @IsNotEmpty({ message: 'id_produk is required' })
  @Transform(({ value }) => Number(value))
  id_produk: number;

  @IsNumber({}, { message: 'id_satuan must be a number' })
  @IsNotEmpty({ message: 'id_satuan is required' })
  @Transform(({ value }) => Number(value))
  id_satuan: number;

  @IsString()
  @IsNotEmpty({ message: 'nama is required' })
  nama: string;

  @IsNumber({}, { message: 'qty must be a number' })
  @IsNotEmpty({ message: 'qty is required' })
  @Transform(({ value }) => Number(value))
  @Min(0, { message: 'qty must be positive number' })
  qty: number;

  @IsNumber({}, { message: 'harga_satuan must be a number' })
  @IsNotEmpty({ message: 'harga_satuan is required' })
  @Transform(({ value }) => Number(value))
  @Min(0, { message: 'harga_satuan must be positive number' })
  harga_satuan: number;

  @IsString()
  @IsOptional()
  keterangan?: string = null;
}

export class FindAllProdukJasaDto {
  @IsString()
  @IsOptional()
  search?: string = '';

  @IsNumber({}, { message: 'id_produk must be a number' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  id_produk?: number = 0;

  @IsNumber({}, { message: 'id_satuan must be a number' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  id_satuan?: number = 0;

  @IsNumber({}, { message: 'page must be a number' })
  @IsOptional()
  //transform buat olah value field sebelum masuk ke validasi
  @Transform(({ value }) => Number(value))
  @Min(1, { message: 'page must be greater than 0' })
  page?: number = 1;

  @IsNumber({}, { message: 'per_page must be a number' })
  @IsOptional()
  //transform buat olah value field sebelum masuk ke validasi
  @Transform(({ value }) => Number(value))
  @Min(1, { message: 'per_page must be greater than 0' })
  per_page?: number = 10;
}
