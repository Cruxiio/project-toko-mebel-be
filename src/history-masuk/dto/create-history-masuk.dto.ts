import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

export class HistoryBahanMasukDetailDto {
  @IsNumber()
  @IsNotEmpty({ message: 'id_history_masuk is required' })
  id_history_masuk: number;

  @IsNumber()
  @IsNotEmpty({ message: 'id_bahan is required' })
  id_bahan: number;

  @IsNumber()
  @IsNotEmpty({ message: 'id_satuan is required' })
  id_satuan: number;

  @IsNumber()
  @IsNotEmpty({ message: 'qty is required' })
  @Min(1, { message: 'qty must be greater than 0' })
  qty: number;
}

export class CreateHistoryMasukDto {
  @IsString()
  @IsNotEmpty({ message: 'kode_nota is required' })
  kode_nota: string;

  @IsNumber()
  @IsNotEmpty({ message: 'id_supplier is required' })
  id_supplier: number;

  @IsDate({ message: 'tgl_nota must be a date' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'tgl_nota must be in YYYY-MM-DD format',
  }) // validate tgL_nota format
  @IsNotEmpty({ message: 'tgl_nota is required' })
  @Transform(({ value }) => new Date(value))
  tgl_nota: Date;

  @IsNumber()
  @IsNotEmpty({ message: 'no_spb is required' })
  no_spb: number;

  @IsArray({ message: 'detail must be an array' })
  @IsNotEmpty({ message: 'detail is required' })
  // Validasi setiap elemen array
  @ValidateNested({ each: true })
  // Konversi setiap elemen array menjadi HistoryBahanMasukDetailDto sebelum divalidasi
  @Transform(() => HistoryBahanMasukDetailDto)
  detail: HistoryBahanMasukDetailDto[];
}

export class UpdateHistoryMasukDto extends PartialType(CreateHistoryMasukDto) {}
