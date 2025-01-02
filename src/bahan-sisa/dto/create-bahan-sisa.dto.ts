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
  id_history_bahan_keluar_detail: number;

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
  keterangan: string = null;
}

export class UpdateBahanSisaDto extends CreateBahanSisaDto {}
