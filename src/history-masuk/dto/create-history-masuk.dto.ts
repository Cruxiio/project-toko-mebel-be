import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

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
}

export class UpdateHistoryMasukDto extends PartialType(CreateHistoryMasukDto) {}
