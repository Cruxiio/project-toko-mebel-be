import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProyekDto {
  @IsNumber({}, { message: 'id_customer must be a number' })
  @IsNotEmpty({ message: 'id_customer is required' })
  @Transform(({ value }) => Number(value))
  id_customer: number;

  @IsString()
  @IsNotEmpty({ message: 'nama is required' })
  nama: string;

  @IsNotEmpty({ message: 'start date is required' })
  @IsDate({ message: 'start date must be a date' })
  @Transform(({ value }) => {
    // validate tgL_nota format
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex untuk format YYYY-MM-DD
    if (!regex.test(value)) {
      throw new BadRequestException('start date must be in YYYY-MM-DD format');
    }

    return new Date(value);
  })
  start: Date;

  @IsNotEmpty({ message: 'deadline date is required' })
  @IsDate({ message: 'deadline date must be a date' })
  @Transform(({ value }) => {
    // validate tgL_nota format
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex untuk format YYYY-MM-DD
    if (!regex.test(value)) {
      throw new BadRequestException(
        'deadline date must be in YYYY-MM-DD format',
      );
    }

    return new Date(value);
  })
  deadline: Date;

  @IsString()
  @IsNotEmpty({ message: 'alamat_pengiriman is required' })
  alamat_pengiriman: string;
}

export class UpdateProyekDto extends CreateProyekDto {}

export class FindAllProyekDto {
  @IsString()
  @IsOptional()
  search?: string = '';

  @IsNumber({}, { message: 'id_customer must be a number' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  id_customer?: number = 0;

  @IsOptional()
  @IsDate({ message: 'start date must be a date' })
  @Transform(({ value }) => {
    // validate tgL_nota format
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex untuk format YYYY-MM-DD
    if (!regex.test(value)) {
      throw new BadRequestException('start date must be in YYYY-MM-DD format');
    }

    return new Date(value);
  })
  start?: Date = null;

  @IsOptional()
  @IsDate({ message: 'deadline date must be a date' })
  @Transform(({ value }) => {
    // validate tgL_nota format
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex untuk format YYYY-MM-DD
    if (!regex.test(value)) {
      throw new BadRequestException(
        'deadline date must be in YYYY-MM-DD format',
      );
    }

    return new Date(value);
  })
  deadline?: Date = null;

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
